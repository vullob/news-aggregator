import React from 'react';
import {connect} from 'react-redux';

import Form from 'react-bootstrap/Form'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { email, password, changeEmail, changePassword, type} = this.props;
    return <React.Fragment>
      <Form.Group controlId="formBasicEmail">
        <Form.Label className="purple-text">Email address</Form.Label>
        <Form.Control type="email" value={email} placeholder="Email" className="purple" onChange={changeEmail}/>
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label className="purple-text">Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} className="purple" onChange={changePassword}/>
        {type == 'register' && <small className="text-muted green-text">Passwords must be at least 7 characters in length</small>}
      </Form.Group>
    </React.Fragment>
  }
}

export default LoginForm
