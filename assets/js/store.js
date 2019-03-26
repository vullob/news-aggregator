import { createStore, combineReducers } from 'redux'

function test(state={}, action) {
  return state
}


function root_reducer(state0, action) {
  console.log('reducer', state0, action)

  const reducer = combineReducers({test});
  const state1 = reducer(state0, action)
  return state1
}

const store = createStore(root_reducer)
export default store
