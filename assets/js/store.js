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


function root_reducer(state0, action) {
  console.log('reducer', state0, action)
  const reducer = combineReducers({selectedCategory, articles});
  const state1 = reducer(state0, action)
  return state1
}

const store = createStore(root_reducer)
export default store
