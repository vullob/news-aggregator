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

  search(query){
    console.log(`searching for ${query}`)
    window.channel.push("search", {query}).receive("ok", (resp) => {
      const { articles: {data}} = resp;
      const ids = data.map((article) => article.id)
      this.addArticles(resp);
      store.dispatch({
        type: 'SET_SEARCH_ARTICLES',
        data: ids
      })
      store.dispatch({
        type: 'SET_PAGE_TYPE',
        data: 'search'
      })
    })

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
