import React from 'react';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import api from './api'

class CommentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: ""
    }
    this.onCommentChange = this.onCommentChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onCommentChange(e) {
      this.setState({comment: e.target.value})
  }

  onSubmit() {
    const { articleId, userId } = this.props
    const {comment } = this.state;
    api.create_comment(userId, articleId, comment)
  }

  render() {
    const { articleId, commmentId } = this.props;
     const { comment } = this.state
    return <React.Fragment>
      <Form.Group>
        <Form.Label as="strong" className="green-text">New Comment</Form.Label>
        <Form.Control as="textarea" size="lg" type="text" value={comment} placeholder="Enter Comment Here..." className="purple" onChange={this.onCommentChange}/>
      </Form.Group>
      <Button onClick={this.onSubmit} variant="outline" className="purple">Submit</Button>
    </React.Fragment>
  }
}

export default CommentForm
