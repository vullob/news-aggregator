import React from 'react';
import { connect } from 'react-redux';

import channel from './channel'

import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'

import LazyLoad from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroller';


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
    <LazyLoad offset={200} height={350}>
      <Card as="a" href={url} target="_blank" rel="noopener noreferrer" className="bg-light rounded purple-border">
        <div className="article">
          <Card.Img {...{variant: 'top', src: urlToImage}}/>
          <Card.Title className="red-text">{title}</Card.Title>
          {source && <Card.Subtitle className="green-text">{source.name}</Card.Subtitle>}
          <Card.Text className="purple-text">{description}</Card.Text>
          {publishedAt && <Card.Footer>{footerText}</Card.Footer>}
      </div>
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
      switch(selectedCategory) {
        case "general":
          return !article.source || article.source.category == selectedCategory;
        default:
          return article.source && article.source.category == selectedCategory;
      }
    })
  }

  renderArticles(articles) {
    const currentDate = new Date();
    return articles.map((article) => <Article {...{article, currentDate, key: article.id}}/>)
  }



  render() {
    const { articles } = this.props;
    const articlesInCategory = this.getArticlesOfCategory()
    const numArticles = Object.values(articles).length
    return <div>
      <InfiniteScroll
        {...{
          pageStart: 0,
          loadMore: () => channel.fetch_moar_articles(numArticles),
          hasMore: true, //TODO: add this
          loader: <div className="loader" key={0}>Loading...</div>,
          useWindow: true
        }}
      >
        <CardColumns>
        {this.renderArticles(articlesInCategory)}
        </CardColumns>
      </InfiniteScroll>
      </div>
  }
}

export default connect((state) => {return {articles: state.articles, selectedCategory: state.selectedCategory}})(ArticleList)
