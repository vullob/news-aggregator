import store from './store'
import channel from './channel'

class TheServer {
   fetch_path(path, callback) {
    if (!sessionStorage.getItem('token')) return;
      $.ajax(path, {
        method: "get",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: "",
        success: callback,
        headers: {"x-auth": sessionStorage.getItem('token')}
    });
   }

   send_post(path, data, callback, error) {
    if (!sessionStorage.getItem('token') && !path.includes('sessions') && !path.includes("users")) return;
      $.ajax(path, {
        method: "post",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(data),
        success: callback,
        error: error,
        headers: {"x-auth": sessionStorage.getItem('token')}
     });
   }

   create_session(email, password) {
      this.send_post("/api/v1/sessions",
        {email, password},
        (resp) => {
           const {articles, token, id} = resp.data
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('user', id)
          sessionStorage.setItem('articles', JSON.stringify(articles))
          const sessionArticlesIds = articles.map((a) => a.id)
          store.dispatch({
            type: 'CLEAR_LOGIN_MODAL_ERRORS'
          })
          store.dispatch({
            type: 'HIDE_LOGIN_MODAL'
          })
          store.dispatch({
            type: "ADD_MORE_ARTICLES",
            data: articles.reduce((acc, elem) => {return {...acc, [elem.id]: elem}}, {})
          })
          store.dispatch({
            type: "NEW_SESSION",
            data: {...resp.data, articles: sessionArticlesIds, user_id: id},
          })
        },
          (resp) =>{
            store.dispatch({
                type: "LOGIN_ERROR",
            })
          })
   }

   create_user(email, password, password_confirmation) {
      this.send_post('/api/v1/users',
         {user: {email, password, password_confirmation}},
         (resp) => {
            this.create_session(email, password);
         },
         (resp) => {
            const reqErrors = resp.responseJSON.errors
            const registerErrors = Object.keys(reqErrors).map(key =>{
               if (key != 'password_hash'){
                  return {type: 'registerError', component: key, msg: reqErrors[key][0]}
               }  else {
                  return {}
               }
            })
            const registerErrorAction = {
                  type: 'REGISTER_ERROR',
                  data: registerErrors
            }
            store.dispatch(registerErrorAction)
         })
   }

   create_comment(user, article, text, success) {
      store.dispatch({
         type: 'CLEAR_ARTICLE_MODAL_ERRORS'
      })
      this.send_post('/api/v1/comments',
         {comment: {user_id: user, article_id: article, text}},
         (resp) => {channel.fetch_comments_for_article(article); success()},
         (resp) => {
            const reqErrors = resp.responseJSON.errors
            const articleModalErrors = Object.keys(reqErrors).map(key =>{
               return { component: key, msg: reqErrors[key][0]}
            })
            const articleModalErrorAction = {
                  type: 'SET_ARTICLE_MODAL_ERRORS',
                  data: articleModalErrors
            }
            store.dispatch(articleModalErrorAction)
         })
   }


   update_user(user) {
      this.send_patch(`/api/v1/users/${user.user_id}`,
         {id: user.user_id, user},
         (resp) => {
            sessionStorage.setItem('user', resp.data.id)
            sessionStorage.setItem('articles', JSON.stringify(resp.data.articles))
            store.dispatch({
               type: 'UPDATE_SESSION_ARTICLES',
               data: resp.data.articles.map((a) => a.id)
            })
         }
      )
   }

   send_patch(path, data, callback, error) {
    if (!sessionStorage.getItem('token')) return;
      $.ajax(path, {
        method: "patch",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(data),
        success: callback,
        error: error,
        headers: {"x-auth": sessionStorage.getItem('token')}
      });
   }

   send_delete(path, data, cb, error) {
      if (!sessionStorage.getItem('token')) return;
      $.ajax(path, {
        method: "delete",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(data),
        success: cb,
        error: error,
        headers: {"x-auth": sessionStorage.getItem('token')}
      });
   }

   delete_comment_from_article(id, article_id) {
      this.send_delete(`/api/v1/comments/${id}`,
         {id},
         (resp) => channel.fetch_comments_for_article(article_id),
         (resp) => {})

   }

}

export default new TheServer()
