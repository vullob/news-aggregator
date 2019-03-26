defmodule NewsWeb.Router do
  use NewsWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_auth do
    plug :accepts, ["json"]
    plug NewsWeb.Plugs.RequireAuth
  end

  scope "/", NewsWeb do
    pipe_through :browser
    get "/", PageController, :index
  end

   scope "/api/v1", NewsWeb do
     pipe_through :api
     resources "/users", UserController, only: [:create]
   end

  scope "/api/v1", NewsWeb do
    pipe_through :api_auth

    resources "/users", UserController, except: [:new, :edit, :create]
  end
end
