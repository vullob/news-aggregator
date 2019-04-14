defmodule NewsWeb.CommentController do
  use NewsWeb, :controller

  alias News.Comments
  alias News.Comments.Comment

  action_fallback NewsWeb.FallbackController

  def index(conn, _params) do
    comments = Comments.list_comments()
    render(conn, "index.json", comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    cond do
      conn.assigns[:current_user].id != (Map.get(comment_params, "user_id") || "") -> send_resp(conn, 401, "cannot create comments for other users")
      true ->
          with {:ok, %Comment{} = comment} <- Comments.create_comment_now(comment_params) |> IO.inspect do
            conn
            |> put_status(:created)
            |> put_resp_header("location", Routes.comment_path(conn, :show, comment))
            |> render("show.json", comment: comment)
          end
      end
  end

  def show(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    render(conn, "show.json", comment: comment)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{} = comment} <- Comments.update_comment(comment, comment_params) do
      render(conn, "show.json", comment: comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    cond do
      conn.assigns[:current_user].id != Map.get(comment, :user_id) -> send_resp(conn, 401, "stop deleting other user's comments")
      true ->
        with {:ok, %Comment{}} <- Comments.delete_comment(comment) do
          send_resp(conn, :no_content, "")
        end
    end
    end
end
