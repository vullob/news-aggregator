import React from 'react';
import {connect} from 'react-redux';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Image from 'react-bootstrap/Image'

import api from './api'

import deleteImage from '../static/images/delete.svg'

import CommentForm from './commentForm'
const ms_per_hour = 1000 * 60 * 60;

function Comment(props) {
  const { user: {email}, text, publishedAt, canDelete, deleteComment, currentDate} = props;
  const hoursSincePublished = Math.floor((currentDate - new Date(publishedAt || undefined))/ms_per_hour);
  const dateText = hoursSincePublished > 24 ?  `${Math.floor(hoursSincePublished/24)} days ago` : `${hoursSincePublished} hours ago`;
  return  <ListGroup.Item className="rounded purple mb-2">
      <div className="row">
      <div className="col-8">
      <strong className="red-text">{email}</strong>
      <small className="text-muted green">{"\n" + dateText}</small>
    </div>
      <div className="col-4">
        {canDelete &&
            <Button variant="outline" className="purple" onClick={deleteComment}>
              <Image src={deleteImage} width={25} height={25}/>
            </Button>}
      </div>
    </div>
      <p className="purple-text">{text}</p></ListGroup.Item>
}

class ArticleModal extends React.Component {
  constructor(props){
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.deleteComment = this.deleteComment.bind(this)
    this.renderComments = this.renderComments.bind(this)
    this.renderErrors = this.renderErrors.bind(this)
  }

  hideModal() {
    const { dispatch } = this.props;
   //TOOD fill this in
    const hideArticleModalAction = {
      type: 'RESET_ARTICLE_MODAL'
    }
    dispatch(hideArticleModalAction)
  }

  deleteComment(id) {
    const { modal: {selectedArticleId}} = this.props;
    api.delete_comment_from_article(id, selectedArticleId)
  }

   renderComments(comments) {
     const { session } = this.props;
     const currentDate = new Date()
     return comments.map(comment => <Comment {...{...comment, deleteComment: () => this.deleteComment(comment.id), currentDate, canDelete: (session && session.user_id) || undefined == comment.user.id}}/>)
   }


  renderErrors(){
    const {modal: {errors} } = this.props;
    return errors.map((error, i) => {
        const errorField = error.component.split("_").map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(" ")
        return <Alert {...{key: i, variant: 'danger'}}><strong>{`${errorField}: `}</strong>{error.msg}</Alert>
      })
  }
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
        <div className="row justify-content-center">
           {this.renderErrors()}
         </div>
        <Modal.Footer className="justify-content-center">
           {session && <CommentForm {...{userId: session.user_id, articleId: selectedArticleId}}/>}
        </Modal.Footer>
      </Modal>
    )
  }

}

export default connect((state) => {return {modal: state.articleModal, articles: state.articles, comments: state.comments, session: state.session}})(ArticleModal)
