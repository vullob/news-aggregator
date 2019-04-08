import React from 'react';
import { connect } from 'react-redux';

import channel from './channel'
import api from './api'

import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Spinner from 'react-bootstrap/Spinner'
import Image from 'react-bootstrap/Image'

import LazyLoad from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroller';

import like from '../static/images/like.svg'
import liked from '../static/images/liked.svg'
import share from '../static/images/share.svg'

const Like = (props) => {
  const { session, id, likes } = props;
  return <Button {...{size:"sm", variant:"outline-light", className:"red red-border", onClick: () => api.update_user({...session, articles: session.articles.concat([id])}) }}>
          {likes}
          <Image {...{src: like, height: 25, width: 25}}/>
    </Button>
  }

const Liked = (props) => {
  const {session, likes, id} = props;
  return<Button {...{size: "sm", variant:"outline-light", className:"red red-border", onClick: () => api.update_user({...session, articles: session.articles.filter((a) => a != id)})}}>
        {likes}
        <Image {...{src: liked, height: 25, width: 25}}/>
      </Button>
  }

const Share = (props) => {
  const { url } = props;
  var clipboard = new Clipboard('.shareButton');
  //TODO: do something with the share button
  return<Button data-clipboardaction="copy" data-clipboard-text={url} value={url} {...{size: "sm", variant: "outline-light", className: "red-border no-padding shareButton", onClick: () => alert("URL Copied to Clipboard")}}>
          <Image {...{className: "purple-svg", src: share, height: 25, width: 25}}/>
        </Button>
  }

function Article(props) {
  const { article: {description, title, url, urlToImage, source, publishedAt, likes}, currentDate, session, id, index} = props;
  const ms_per_hour = 1000 * 60 * 60;
  const currentDateGMT = new Date(currentDate.valueOf() + currentDate.getTimezoneOffset() * 60000)
  const hoursSincePublished = Math.floor((currentDateGMT - new Date(publishedAt || undefined))/ms_per_hour);
  const footerText = hoursSincePublished > 24 ?
    `Published ${Math.floor(hoursSincePublished/24)} days ago`
    :
    `published ${hoursSincePublished} hours ago`;
  return <React.Fragment>
    <LazyLoad offset={450}>
      <Card rel="noopener noreferrer" className="bg-light rounded no-border article">
      <Card.Img {...{variant: 'top', src: urlToImage, className: "rounded"}} />
        <Card.Body as="a" href={url} target="_blank">
          <Card.Title className="red-text">{title}</Card.Title>
          {source && <Card.Subtitle className="green-text">{source.name}</Card.Subtitle>}
          <Card.Text className="purple-text">{description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <div className="row text-muted red-text">
            <div className="col-xs-8">{publishedAt && footerText}</div>
            {session != null && (session.articles.includes(id) ? <div className="col-2 pull-right"><Liked {...{session, id, likes}} /></div> : <div className="col-2 pull-right"><Like {...{session, id, likes}} /></div>)}
            <div className="col-2 pull-right"><Share {...{url, session, id}}/></div>
          </div>
        </Card.Footer>
      </Card>
    </LazyLoad>
  </React.Fragment>
}

class ArticleList extends React.Component {
  constructor(props){
    super(props)
    this.getArticlesOfCategory = this.getArticlesOfCategory.bind(this)
    this.pickArticlesToRender = this.pickArticlesToRender.bind(this)
  }

  getArticlesOfCategory() {
    const { articles, selectedCategory } = this.props;
    return Object.values(articles).filter((article) => {
          return article.article_category == selectedCategory;
    }).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)) // uncomment this for sorted articles
       // Doesn't format great in CardColumns
  }

  renderArticles(articles, session) {
    const currentDate = new Date();
    return articles.map((article, index) => <Article {...{session, article, currentDate, key: index, index, id: article.id}}/>)
  }

  pickArticlesToRender() {
    const { pageType, session, searchArticles, articles} = this.props;
    switch (pageType) {
      case 'browse':
        return this.getArticlesOfCategory();
      case 'search':
        return searchArticles.map((id) => articles[id])
      case 'favorites':
        return  session.articles.map((id) => articles[id]).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    }

  }



  render() {
    const { articles, lastFetched, selectedCategory, searchArticles, pageType, session} = this.props;
    const articlesInCategory = this.pickArticlesToRender()
    const currentFetchState = lastFetched[selectedCategory]
    return <React.Fragment>
      {pageType == 'search' && <div className="row purple"><strong>Search Results</strong></div>}
      <InfiniteScroll
        {...{
          pageStart: 0,
          loadMore: () => channel.fetch_moar_articles(currentFetchState.lastFetched, selectedCategory),
          hasMore: pageType == 'browse' ? currentFetchState.hasMore : false, // this may break if we implement article specific requests to the server
          loader: <div className="col">
                      <div className="row justify-content-center">
                        <Spinner animation="border" className="purple-text" />
                      </div>
                    </div>,
          useWindow: true
        }}
      >
       <div className="row articleListContainer justify-content-center">
        {this.renderArticles(articlesInCategory, session)}
        </div>
      </InfiniteScroll>
    </React.Fragment>
  }
}

export default connect((state) => {return {session: state.session, lastFetched: state.lastFetched,articles: state.articles, selectedCategory: state.selectedCategory, searchArticles: state.searchArticles, pageType: state.pageType}})(ArticleList)
