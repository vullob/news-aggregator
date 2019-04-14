defmodule NewsWeb.CommentView do
  use NewsWeb, :view
  alias NewsWeb.CommentView

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "comment.json")}
  end

  def render("show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("comment.json", %{comment: comment}) do
    %{id: comment.id,
      text: comment.text,
      publishedAt: comment.publishedAt,
      user: render_one(comment.user, NewsWeb.UserView, "user_no_articles.json")}
  end
end
