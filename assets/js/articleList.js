import React from 'react';
import { connect } from 'react-redux';

import channel from './channel'

import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import Spinner from 'react-bootstrap/Spinner'

import LazyLoad from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroller';
import like from '../static/images/like.svg'
import liked from '../static/images/liked.svg'
import share from '../static/images/share.svg'

const Like = (props) => {
    return<img {...{src: like, height: 25, width: 25}}/>
  }

const Liked = (props) => {
    return<img {...{src: liked, height: 25, width: 25}}/>
  }

const Share = (props) => {
    return<img {...{src: share, height: 25, width: 25}}/>
  }

function Article(props) {
  const { article: {description, title, url, urlToImage, source, publishedAt}, currentDate} = props;
  const ms_per_hour = 1000 * 60 * 60;
  const currentDateGMT = new Date(currentDate.valueOf() + currentDate.getTimezoneOffset() + 60000)
  const hoursSincePublished = Math.floor((currentDateGMT - new Date(publishedAt || undefined))/ms_per_hour);
  const footerText = hoursSincePublished > 24 ?
    `Published ${Math.floor(hoursSincePublished/24)} days ago`
    :
    `published ${hoursSincePublished} hours ago`;
  return <React.Fragment>
    <LazyLoad offset={450} height={210}>
      <Card rel="noopener noreferrer" className="bg-light rounded no-border">
      <Card.Img {...{variant: 'top', src: urlToImage, className: "rounded"}} />
        <Card.Body as="a" href={url} target="_blank">
          <Card.Title className="red-text">{title}</Card.Title>
          {source && <Card.Subtitle className="green-text">{source.name}</Card.Subtitle>}
          <Card.Text className="purple-text">{description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <div className="social-bar text-muted red-text">
            <span>{publishedAt && footerText}   </span>
            <span><Button variant="light"><Like/></Button>   </span>
            <span><Button variant="light"><Share/></Button></span>
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
  }

  getArticlesOfCategory() {
    const { articles, selectedCategory } = this.props;
    return Object.values(articles).filter((article) => {
          return article.article_category == selectedCategory;
    }) //.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)) uncomment this for sorted articles
       // Doesn't format great in CardColumns
  }

  renderArticles(articles) {
    const currentDate = new Date();
    return articles.map((article) => <Article {...{article, currentDate, key: article.id}}/>)
  }



  render() {
    const { articles, lastFetched, selectedCategory, searchArticles, pageType} = this.props;
    const articlesInCategory = pageType == 'browse' ? this.getArticlesOfCategory() : searchArticles.map((id) => articles[id])
    const currentFetchState = lastFetched[selectedCategory]
    return <React.Fragment>
      {pageType == 'search' && <div class="row purple"><strong>Search Results</strong></div>}
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
        <CardColumns>
        {this.renderArticles(articlesInCategory)}
        </CardColumns>
      </InfiniteScroll>
    </React.Fragment>
  }
}

export default connect((state) => {return {lastFetched: state.lastFetched,articles: state.articles, selectedCategory: state.selectedCategory, searchArticles: state.searchArticles, pageType: state.pageType}})(ArticleList)
