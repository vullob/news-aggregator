import React from 'react';
import {connect} from 'react-redux';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

import LoginForm from './loginForm'
import api from './api'
import RegisterForm from './registerForm'

class LoginModal extends React.Component {
  constructor(props){
    super(props);
    // store login info locally, since no one else needs to know these
    this.state = {
      email: "",
      password: "",
      paswordConfirmation: ""
    }
    this.hideModal = this.hideModal.bind(this);
    this.changePassword = this.changePassword.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.login = this.login.bind(this)
    this.renderLoginErrors = this.renderLoginErrors.bind(this)
    this.renderRegisterErrors = this.renderRegisterErrors.bind(this)
    this.changePasswordConfirmation = this.changePasswordConfirmation.bind(this)
    this.register = this.register.bind(this)
  }


  hideModal() {
    const { dispatch } = this.props;
    dispatch({ type: 'CLEAR_LOGIN_MODAL_ERRORS' })
    const closeModalAction = {
      type: "HIDE_LOGIN_MODAL"
    }
    dispatch(closeModalAction);
  }

  changePassword(e) {
    this.setState({password: e.target.value})
  }

  changeEmail(e){
    this.setState({email: e.target.value});
  }

  changePasswordConfirmation(e) {
    this.setState({passwordConfirmation: e.target.value});
  }

  register() {
    const {modal: {type}, dispatch} = this.props;
    const {email, password, passwordConfirmation} = this.state;
    dispatch({
        type: 'CLEAR_LOGIN_MODAL_ERRORS'
    })
    switch (type) {
      case 'login':
        return dispatch({
              type: 'SET_LOGIN_MODAL_TYPE',
              data: 'register'
        })
      case 'register':
        return api.create_user(email, password, passwordConfirmation)
      default:
        return alert("how'd you get here?")
    }
  }

  login(){
    const {modal: {type}, dispatch} = this.props;
    const { email, password } = this.state;
    dispatch({
        type: 'CLEAR_LOGIN_MODAL_ERRORS'
    })
    switch (type) {
      case 'login':
        return api.create_session(email, password)
      case 'register':
        return dispatch({
            type: 'SET_LOGIN_MODAL_TYPE',
            data: 'login'
        })
      default:
          return alert("how'd you get here?")
  }}

  renderLoginErrors(){
    const { modal: {errors} } = this.props
    return errors.reduce((acc, error, i) => { if(error.type == 'loginError') {
                                                acc.push(<Alert {...{key: i, variant: "danger"}}>{error.msg}</Alert>);
                                              }
                                              return acc}, [])
  }

  renderRegisterErrors(){
    const {modal: {errors} } = this.props;
    return errors.reduce((acc, error, i) => {
      if(error.type == 'registerError') {
          const errorField = error.component.split("_").map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(" ")
          acc.push(<Alert {...{key: i, variant: 'danger'}}><strong>{`${errorField}: `}</strong>{error.msg}</Alert>)
      }
      return acc }, [])
  }

  render() {
    const { modal: {show, type}} = this.props;
    const { email, password, passwordConfirmation } = this.state
    return (
      <Modal show={show} onHide={this.hideModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="green-text">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type == 'login' && this.renderLoginErrors()}
          {type == 'register' && this.renderRegisterErrors()}
          <Form>
            {type == 'login' && <LoginForm {...{email, password, changeEmail: this.changeEmail, changePassword: this.changePassword}}/>}
            {type == 'register' && <RegisterForm {...{email, password, password,  changeEmail: this.changeEmail, changePassword: this.changePassword, changePasswordConfirmation: this.changePasswordConfirmation}}/>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" className="green" onClick={this.register}>Register</Button>
           <Button variant="outline" className="red" onClick={this.hideModal}>
              Close
            </Button>
            <Button variant="outline" className="purple" onClick={this.login}>
              Login
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }

}

export default connect((state) => {return {modal: state.loginModal}})(LoginModal)
