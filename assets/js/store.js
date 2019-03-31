import { createStore, combineReducers } from 'redux'

function selectedCategory(state = 'general', action) {
  switch (action.type) {
    case 'SET_SELECTED_CATEGORY':
      return action.data;
    default:
      return state;
  }
}

function articles(state = {}, action){
  switch (action.type){
    case 'SET_ARTICLES':
      return action.data;
    case 'ADD_MORE_ARTICLES':
      return {...state, ...action.data}
    default:
      return state;
  }
}

function session(state = null, action){
  switch(action.type) {
    case 'NEW_SESSION':
        return action.data;
    case 'CLOSE_SESSION':
        return null;
    default:
      return state;
  }
}

function loginModal(state = {show: false, type: 'login', errors: []}, action) {
  switch (action.type) {
      case 'SHOW_LOGIN_MODAL':
        return {...state, show: true};
      case 'HIDE_LOGIN_MODAL':
        return {...state, show: false};
      case 'SET_LOGIN_MODAL_ERRORS':
        return {...state, errors: action.data}
      case 'CLEAR_LOGIN_MODAL_ERRORS':
        return {...state, errors: []}
      case 'SET_MODAL_TYPE':
        return {...state, type: action.data}
      default:
        return state;
  }
}



function root_reducer(state0, action) {
  console.log('reducer', state0, action)
  const reducer = combineReducers({selectedCategory, articles, session, loginModal});
  const state1 = reducer(state0, action)
  return state1
}

const store = createStore(root_reducer)
export default store
