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

  fetch_moar_articles(publishedBefore , category) {
    console.log(`Fetching more articles published before ${publishedBefore}, from ${category}`)
    window.channel.push("more_articles", {publishedBefore, category}).receive("ok", (resp) =>  {
                                                                              const lastArticlePublished = resp.articles.data[resp.articles.data.length - 1];
                                                                              const lastFetched = lastArticlePublished ? lastArticlePublished.publishedAt : undefined
                                                                              const hasMore = lastFetched != undefined
                                                                              const updateFetchedArticlesAction = {
                                                                                type: "FETCHED_CATEGORY",
                                                                                data: {
                                                                                  category,
                                                                                  fetched: hasMore ? {lastFetched, hasMore} : {hasMore}
                                                                                }
                                                                              }
                                                                              store.dispatch(updateFetchedArticlesAction)
                                                                              this.addArticles(resp)})
  }

}

export default new TheChannel();
