import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import  channel  from './channel'

import Header from './header'
import ArticleList from './articleList'
import LoginModal from './loginModal'
import Footer from './footer'

export default function root_init(node, store) {
  ReactDOM.render(
    <Provider store={store}>
      <Root/>
    </Provider>, node);
}

class Root extends React.Component {
  constructor(props){
    super(props)
    window.channel.join("news").receive("ok", (r) => {});
    window.channel.on("update_news", msg => { channel.addArticles(msg);})
    this.hideFooter = this.hideFooter.bind(this)
    this.state = {
      footer: localStorage.getItem('footer')
    }
  }

  hideFooter() {
    this.setState({footer: true})
    localStorage.setItem("footer", true)
  }

  render() {
    return <div>
        <Header/>
        <ArticleList/>
        {this.state.footer == null && <Footer {...{hideFooter: this.hideFooter}}/>}
    </div>
  }

}
