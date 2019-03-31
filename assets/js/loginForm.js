import React from 'react';
import {connect} from 'react-redux';

import Form from 'react-bootstrap/Form'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { email, password, changeEmail, changePassword } = this.props;
    return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label className="purple-text">Email address</Form.Label>
        <Form.Control type="email" value={email} placeholder="Email" className="purple" onChange={changeEmail}/>
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label className="purple-text">Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} className="purple" onChange={changePassword}/>
      </Form.Group>
  </Form>
    )
  }
}

export default LoginForm
