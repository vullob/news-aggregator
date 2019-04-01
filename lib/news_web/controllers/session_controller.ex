defmodule NewsWeb.SessionController do
  use NewsWeb, :controller

  action_fallback NewsWeb.FallbackController

  alias News.Users.User

  def create(conn, %{"email" => email, "password" => password}) do
    with %User{} = user <- News.Users.get_and_auth_user(email, password) do
      resp = %{
        data: %{
          token: Phoenix.Token.sign(NewsWeb.Endpoint, "user_id", user.id),
          user_id: user.id,
          articles: user.articles |> Enum.map(fn article -> article.id end)
          }
      }
       conn
        |> put_resp_header("content-type", "applcication/json; charset=UTF-8")
        |> send_resp(:created, Jason.encode!(resp))
    end

  end

end

