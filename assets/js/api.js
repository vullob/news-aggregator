import store from './store'

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
          //@TODO liked Articles are returned in this response
          //they need to be parsed into the store
          sessionStorage.setItem('token', resp.data.token)
          sessionStorage.setItem('user', resp.data.user_id)
          store.dispatch({
            type: 'CLEAR_LOGIN_MODAL_ERRORS'
          })
          store.dispatch({
            type: 'HIDE_LOGIN_MODAL'
          })
          store.dispatch({
            type: "NEW_SESSION",
            data: resp.data,
          })
        },
          (resp) =>{
            console.log(resp)
           store.dispatch({
                type: "LOGIN_ERROR",
            })
          })
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

}

export default new TheServer()
