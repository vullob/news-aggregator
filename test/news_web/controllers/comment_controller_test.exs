defmodule NewsWeb.CommentControllerTest do
  use NewsWeb.ConnCase

  alias News.Comments
  alias News.Comments.Comment

  @create_attrs %{
    publishedAt: ~N[2010-04-17 14:00:00],
    text: "some text"
  }
  @update_attrs %{
    publishedAt: ~N[2011-05-18 15:01:01],
    text: "some updated text"
  }
  @invalid_attrs %{publishedAt: nil, text: nil}

  def fixture(:comment) do
    {:ok, comment} = Comments.create_comment(@create_attrs)
    comment
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all comments", %{conn: conn} do
      conn = get(conn, Routes.comment_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create comment" do
    test "renders comment when data is valid", %{conn: conn} do
      conn = post(conn, Routes.comment_path(conn, :create), comment: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.comment_path(conn, :show, id))

      assert %{
               "id" => id,
               "publishedAt" => "2010-04-17T14:00:00",
               "text" => "some text"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.comment_path(conn, :create), comment: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update comment" do
    setup [:create_comment]

    test "renders comment when data is valid", %{conn: conn, comment: %Comment{id: id} = comment} do
      conn = put(conn, Routes.comment_path(conn, :update, comment), comment: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.comment_path(conn, :show, id))

      assert %{
               "id" => id,
               "publishedAt" => "2011-05-18T15:01:01",
               "text" => "some updated text"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, comment: comment} do
      conn = put(conn, Routes.comment_path(conn, :update, comment), comment: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete comment" do
    setup [:create_comment]

    test "deletes chosen comment", %{conn: conn, comment: comment} do
      conn = delete(conn, Routes.comment_path(conn, :delete, comment))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.comment_path(conn, :show, comment))
      end
    end
  end

  defp create_comment(_) do
    comment = fixture(:comment)
    {:ok, comment: comment}
  end
end
