import store from './store'


class TheChannel {

  fetch_moar_articles(offset) {
    window.channel.push("more_articles", {offset}).receive("ok", (resp) => console.log(resp))
  }

}

export default new TheChannel();
