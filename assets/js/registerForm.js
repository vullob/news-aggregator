import React from 'react';
import {connect} from 'react-redux';

import Form from 'react-bootstrap/Form'

import LoginForm from './loginForm'

class RegisterForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { email, password, passwordConfirmation, changeEmail, changePassword, changePasswordConfirmation } = this.props;
    return <React.Fragment>
       <LoginForm {...{email, password, changeEmail, changePassword, type: 'register'}}/>
      <Form.Group controlId="formBasicPassword">
        <Form.Label className="purple-text">Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" value={passwordConfirmation} className="purple" onChange={changePasswordConfirmation}/>
      </Form.Group>
    </React.Fragment>
  }
}

export default RegisterForm
