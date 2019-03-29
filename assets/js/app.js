// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"
import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;
import socket from './socket'

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"
import root_init from './root'
import store from './store'

$(() => {
  let node = $('#root')[0];
  let channel = socket.channel("news", {})
  window.channel = channel
  root_init(node, store)
})
