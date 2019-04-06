defmodule NewsWeb.SessionController do
  use NewsWeb, :controller

  action_fallback NewsWeb.FallbackController

  alias News.Users.User

  def create(conn, %{"email" => email, "password" => password}) do
    with %User{} = user <- News.Users.get_and_auth_user(email, password) do

      resp = %{
        data: NewsWeb.UserView.render("new_user.json", %{user: user, token: Phoenix.Token.sign(NewsWeb.Endpoint, "user_id", user.id)})
      }
       conn
        |> put_resp_header("content-type", "applcication/json; charset=UTF-8")
        |> send_resp(:created, Jason.encode!(resp))
    end

  end

end

