defmodule NewsWeb.NewsChannelChannel do
  use NewsWeb, :channel

  def join("news", payload, socket) do
    if authorized?(payload) do
      articles = News.Articles.fetch_more_with_offset(0)
      {:ok, %{"articles" => NewsWeb.ArticleView.render("index.json", %{articles: articles})}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("more_articles", %{"offset" => offset}, socket) do
      articles = NewsWeb.ArticleView.render("index.json", %{articles: News.Articles.fetch_more_with_offset(offset)})
      {:reply, {:ok, %{articles: articles}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (news_channel:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end