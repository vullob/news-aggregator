import React from 'react';
import {connect} from 'react-redux';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'

import api from './api'

import CommentForm from './commentForm'

class ArticleModal extends React.Component {
  constructor(props){
    super(props);
    // store login info locally, since no one else needs to know these
    this.hideModal = this.hideModal.bind(this);
  }


  hideModal() {
    const { dispatch } = this.props;
   //TOOD fill this in
    const hideArticleModalAction = {
      type: 'RESET_ARTICLE_MODAL'
    }
    dispatch(hideArticleModalAction)
  }

   renderComments(comments) {
      return comments.map(comment => <ListGroup.Item><strong className="red-text">{comment.user.email}</strong><p className="purple-text">{comment.text}</p></ListGroup.Item>)
   }
   // TODO add form validation for comments
  render() {
    const { modal: {show, selectedArticleId}, articles, comments: {ids, commentData}, session} = this.props;
    const selectedArticle = articles[selectedArticleId]
     const orderedComments = ids.map(id => commentData[id])
    return (
      <Modal show={show} onHide={this.hideModal} size={'lg'}>
        <Modal.Header closeButton>
          <Modal.Title className="green-text">Comments For: {selectedArticle.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <ListGroup>
            {this.renderComments(orderedComments)}
         </ListGroup>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
           {session && <CommentForm {...{userId: session.user_id, articleId: selectedArticleId}}/>}
        </Modal.Footer>
      </Modal>
    )
  }

}

export default connect((state) => {return {modal: state.articleModal, articles: state.articles, comments: state.comments, session: state.session}})(ArticleModal)
