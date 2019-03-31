import store from './store'

class TheChannel {

  setArticles(articles) {
    const setArticleAction = {
      type: "SET_ARTICLES",
      data: this.formatArticles(articles.articles.data)
    }
    store.dispatch(setArticleAction)
  }

  addArticles(articles) {
    const addArticlesAction = {
      type: "ADD_MORE_ARTICLES",
      data: this.formatArticles(articles.articles.data)
    }
    store.dispatch(addArticlesAction)
  }

  formatArticles(articles){
   return articles.reduce((acc, elem) => {return {...acc, [elem.id]: elem}}, {})
  }

  fetch_moar_articles(offset) {
    window.channel.push("more_articles", {offset}).receive("ok", (resp) => this.addArticles(resp))
  }

}

export default new TheChannel();
