defmodule NewsWeb.UserView do
  use NewsWeb, :view
  alias NewsWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      email: user.email,
      articles: render_many(user.articles, NewsWeb.ArticleView, "article.json") }
  end

  def render("new_user.json", %{user: user, token: token}) do
    %{id: user.id,
      email: user.email,
      articles: render_many(user.articles, NewsWeb.ArticleView, "article.json"),
      token: token
     }
  end
end
