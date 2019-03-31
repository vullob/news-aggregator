import React from 'react';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'

import LazyLoad from 'react-lazyload';


function Article(props) {
  const { article: {description, title, url, urlToImage, source}} = props;
  return <React.Fragment>
    <LazyLoad offset={0} height={250}>
      <Card as="a" href={url} target="_blank" rel="noopener noreferrer" className="bg-light rounded purple-border">
        <div className="article">
          <Card.Img {...{variant: 'top', src: urlToImage}}/>
          <Card.Title className="red-text">{title}</Card.Title>
          {source && <Card.Subtitle className="green-text">{source.name}</Card.Subtitle>}
          <Card.Text className="purple-text">{description}</Card.Text>
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
    return articles.map((article) => <Article article={article}/>)
  }



  render() {
    const articles = this.getArticlesOfCategory()
    return <div>
        <CardColumns>
        {this.renderArticles(articles)}
        </CardColumns>
      </div>
  }
}

export default connect((state) => {return {articles: state.articles, selectedCategory: state.selectedCategory}})(ArticleList)
