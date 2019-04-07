defmodule News.Users do
  @moduledoc """
  The Users context.
  """

  import Ecto.Query, warn: false
  alias News.Repo

  alias News.Users.User

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  def get_user_by_email(email) do
    Repo.one from u in User,
      where: u.email == ^email,
      preload: [articles: [:source, :users]]
  end

  def get_and_auth_user(email, password) do
    user = get_user_by_email(email)
    pwrd = Argon2.check_pass(user, password)
    case pwrd do
      {:ok, user} -> Map.put(user, :articles, News.Articles.count_likes(user.articles))
      _else -> nil
    end
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """

  def get_user!(id), do: Repo.get!(User, id)

  def get_user(id) do
    Repo.one from u in User,
        preload: [articles: [:source, :users]],
        where: u.id == ^id
  end
  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
    |> case do
        {:ok, user} -> {:ok, News.Users.get_user(user.id)}
        error -> error |> IO.inspect
        end
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user |> IO.inspect
    attrs |> IO.inspect
    with {:ok, _} <- add_articles_to_user(user, attrs["articles"] || []) do
      user
      |> User.changeset(attrs)
      |> Repo.update()
      |> case do
        {:ok, user} -> ret = News.Users.get_user(user.id); {:ok, Map.put(ret, :articles, News.Articles.count_likes(ret.articles))}
        error -> error |> IO.inspect
        end
    else
      err -> err
    end
  end

  def add_articles_to_user(user, article_ids \\ []) do
    articles = article_ids |> Enum.map(fn x -> News.Articles.get_article(x) end)
    changeset = user |> User.changeset_add_articles(articles)

    case changeset |> Repo.update do
      {:ok, res} -> broadcast(Enum.map(res.articles, fn x -> News.Articles.get_article(x.id)end)|> News.Articles.count_likes);{:ok, res}
      error -> error
    end
  end

  defp broadcast(data) do
      data = %{articles: NewsWeb.ArticleView.render("index.json", %{articles: data})}
      NewsWeb.Endpoint.broadcast!("news", "update_news",  data)
  end



  @doc """
  Deletes a User.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end
end
