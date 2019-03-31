import React from 'react';
import {connect} from 'react-redux';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import LoginForm from './loginForm'
import api from './api'

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
  }


  hideModal() {
    const { dispatch } = this.props;
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

  login(){
    const { email, password } = this.state;
    api.create_session(email, password)
  }

  render() {
    const { modal: {show}} = this.props;
    const { email, password } = this.state
    //TODO implement register w/a popout input for password validation
    //TODO implement modal errors
    return (
      <Modal show={show} onHide={this.hideModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="green-text">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm {...{email, password, changeEmail: this.changeEmail, changePassword: this.changePassword}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" className="green" onClick={()=>alert("not yet implemented")}>Register</Button>
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
