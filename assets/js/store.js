import { createStore, combineReducers } from 'redux'
const currentDate = new Date()
const currentDateGMT = new Date(currentDate.valueOf() + currentDate.getTimezoneOffset() + 60000).toISOString()
const lastFetchedInitialState =
  {
    general: {hasMore: true, lastFetched: currentDateGMT},
    science: {hasMore: true, lastFetched: currentDateGMT},
    entertainment: {hasMore: true, lastFetched: currentDateGMT},
    sports: {hasMore: true, lastFetched: currentDateGMT},
    business: {hasMore: true, lastFetched: currentDateGMT},
    technology: {hasMore: true, lastFetched: currentDateGMT},
    health: {hasMore:true, lastFetched: currentDateGMT}
  }


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

function pageType(state = 'browse', action) {
  switch (action.type) {
    case 'SET_PAGE_TYPE':
      return action.data;
    case 'RESET_PAGE_TYPE':
      return 'browse';
    default:
      return state;
  }
}

function lastFetched(state = lastFetchedInitialState, action){
  switch (action.type) {
    case 'FETCHED_CATEGORY':
      return {...state, [action.data.category]: {...state[action.data.category], ...action.data.fetched}};
    default:
      return state;
  }
}

function searchQuery(state = "", action){
  switch(action.type) {
    case 'UPDATE_SEARCH_QUERY':
      return action.data;
    case 'RESET_SEARCH_QUERY':
      return '';
    default:
      return state
  }
}

function searchArticles(state = [], action) {
  switch(action.type) {
    case 'SET_SEARCH_ARTICLES':
      return action.data;
    case 'RESET_SEARCH_ARTICLES':
      return [];
    default:
      return state
  }
}

function session(state = null, action){
  switch(action.type) {
    case 'NEW_SESSION':
        return action.data;
    case 'CLOSE_SESSION':
        return null;
    case 'UPDATE_SESSION_ARTICLES':
        return {...state, articles: action.data}
    default:
      return state;
  }
}

function articleModal(state = {show: false, selectedArticleId: undefined, errors: []}, action){
  switch (action.type) {
    case 'SHOW_ARTICLE_MODAL':
      return {...state, show: true};
    case 'HIDE_ARTICLE_MODAL':
      return {...state, show: false};
    case 'UPDATE_SELECTED_ARTICLE_ID':
      return {...state, selectedArticleId: action.data}
    case 'RESET_ARTICLE_MODAL':
      return {show: false, selectedArticleId: undefined, errors:[]}
    case 'SET_ARTICLE_MODAL_ERRORS':
      return {...state, errors: action.data}
    case 'CLEAR_ARTICLE_MODAL_ERRORS':
      return {...state, errors:[]}
    default:
      return state;
  }
}

function comments(state = {ids: [], commentData : {}}, action){
  switch(action.type){
    case 'SET_COMMENTS':
      return action.data;
    case 'RESET_COMMENTS':
      return {ids: [], commentData: {}};
    default:
      return state;
  }
}

function loginModal(state = {show: false, type: 'login', errors: []}, action) {
  switch (action.type) {
      case 'LOGIN_ERROR':
        return {...state, errors: [{type: "loginError", msg: "Unknown Email Address or Password"}]}
      case 'REGISTER_ERROR':
        return {...state, errors: action.data}
      case 'SHOW_LOGIN_MODAL':
        return {...state, show: true};
      case 'HIDE_LOGIN_MODAL':
        return {...state, show: false};
      case 'SET_LOGIN_MODAL_ERRORS':
        return {...state, errors: action.data}
      case 'CLEAR_LOGIN_MODAL_ERRORS':
        return {...state, errors: []}
      case 'SET_LOGIN_MODAL_TYPE':
        return {...state, type: action.data}
      default:
        return state;
  }
}




function root_reducer(state0, action) {
  const reducer = combineReducers({selectedCategory, articles, session, loginModal, lastFetched, searchQuery, searchArticles, pageType, comments, articleModal});
  const state1 = reducer(state0, action)
  return state1
}

const store = createStore(root_reducer)
export default store
