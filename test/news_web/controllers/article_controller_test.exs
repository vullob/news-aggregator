defmodule NewsWeb.ArticleControllerTest do
  use NewsWeb.ConnCase

  alias News.Articles
  alias News.Articles.Article

  @create_attrs %{
    author: "some author",
    content: "some content",
    description: "some description",
    publishedAt: ~N[2010-04-17 14:00:00],
    title: "some title",
    url: "some url",
    urlToImage: "some urlToImage"
  }
  @update_attrs %{
    author: "some updated author",
    content: "some updated content",
    description: "some updated description",
    publishedAt: ~N[2011-05-18 15:01:01],
    title: "some updated title",
    url: "some updated url",
    urlToImage: "some updated urlToImage"
  }
  @invalid_attrs %{author: nil, content: nil, description: nil, publishedAt: nil, title: nil, url: nil, urlToImage: nil}

  def fixture(:article) do
    {:ok, article} = Articles.create_article(@create_attrs)
    article
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all articles", %{conn: conn} do
      conn = get(conn, Routes.article_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create article" do
    test "renders article when data is valid", %{conn: conn} do
      conn = post(conn, Routes.article_path(conn, :create), article: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.article_path(conn, :show, id))

      assert %{
               "id" => id,
               "author" => "some author",
               "content" => "some content",
               "description" => "some description",
               "publishedAt" => "2010-04-17T14:00:00",
               "title" => "some title",
               "url" => "some url",
               "urlToImage" => "some urlToImage"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.article_path(conn, :create), article: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update article" do
    setup [:create_article]

    test "renders article when data is valid", %{conn: conn, article: %Article{id: id} = article} do
      conn = put(conn, Routes.article_path(conn, :update, article), article: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.article_path(conn, :show, id))

      assert %{
               "id" => id,
               "author" => "some updated author",
               "content" => "some updated content",
               "description" => "some updated description",
               "publishedAt" => "2011-05-18T15:01:01",
               "title" => "some updated title",
               "url" => "some updated url",
               "urlToImage" => "some updated urlToImage"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, article: article} do
      conn = put(conn, Routes.article_path(conn, :update, article), article: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete article" do
    setup [:create_article]

    test "deletes chosen article", %{conn: conn, article: article} do
      conn = delete(conn, Routes.article_path(conn, :delete, article))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.article_path(conn, :show, article))
      end
    end
  end

  defp create_article(_) do
    article = fixture(:article)
    {:ok, article: article}
  end
end
