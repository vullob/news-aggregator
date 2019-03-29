import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import  channel  from './channel'

export default function root_init(node, store) {
  ReactDOM.render(
    <Provider store={store}>
      <Root/>
    </Provider>, node);
}

class Root extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    window.channel.join("news").receive("ok", (r) => console.log(r));
    window.channel.on("update_news", msg => console.log(msg))
  }

  render() {
    return <div>
        <p>Working</p>
    </div>
  }

}
