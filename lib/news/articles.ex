defmodule News.Articles do
  @moduledoc """
  The Articles context.
  """

  import Ecto.Query, warn: false
  alias News.Repo
  alias Ecto.Multi

  alias News.Articles.Article

  @doc """
  Returns the list of articles.

  ## Examples

      iex> list_articles()
      [%Article{}, ...]

  """
  def list_articles do
    Repo.all(Article)
  end

  def list_articles_from_category(category) do
    Repo.all from a in Article,
        join: s in assoc(a, :source),
        where: s.category == ^category,
        preload: [:source]
  end

  def fetch_more_from_category_after(category, publishedBefore) do
      {:ok, datetime} = NaiveDateTime.from_iso8601(publishedBefore)
      Repo.all from a in Article,
        where: a.article_category == ^category and a.publishedAt < ^datetime,
        preload: [:source, :users],
        limit: 200,
        order_by: [desc: :publishedAt]
  end

  def fetch_more_with_offset(off) do
    Repo.all from a in Article,
        preload: [:source],
        limit: 200,
        offset: ^off,
        order_by: [desc: :publishedAt]
  end

  def search(query) do
    Repo.all from a in Article,
      where: like(a.title, ^("%#{query}%")) or like(a.description, ^("%#{query}%")),
      preload: [:source, :users],
      order_by: [desc: :publishedAt]
  end

  @doc """
  Gets a single article.

  Raises `Ecto.NoResultsError` if the Article does not exist.

  ## Examples

      iex> get_article!(123)
      %Article{}

      iex> get_article!(456)
      ** (Ecto.NoResultsError)

  """
  def get_article!(id), do: Repo.get!(Article, id)

  def get_article(id), do: Repo.get(Article, id) |> Repo.preload(:source) |> Repo.preload(:users)

  @doc """
  Creates a article.

  ## Examples

      iex> create_article(%{field: value})
      {:ok, %Article{}}

      iex> create_article(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_article(attrs \\ %{}) do
    %Article{}
    |> Article.changeset(attrs)
    |> Repo.insert()
  end

  def create_all_articles(articles \\ []) do
    articles
    |> Enum.map(fn a -> Map.put(a, "source_id", Map.get(a["source"] || %{}, "id")) |>
                        Map.delete("source") end)
    |> Enum.map(fn a -> create_article(a) end)
    |> remove_errors
    |> Enum.map(fn x -> get_article(x.id) end)
    |> count_likes
  end

  defp remove_errors(articles) do
    Enum.reduce(articles, [], fn x, acc -> case x do
                                                {:ok, data} -> data = data |> Repo.preload(:source); [data | acc]
                                                {:error, err} -> acc
                                                end end)
  end

  def count_likes(articles) do
    Enum.map(articles, fn x -> Map.put(x, :likes, length(x.users)) |> Map.delete(:users) end)
  end


  @doc """
  Updates a article.

  ## Examples

      iex> update_article(article, %{field: new_value})
      {:ok, %Article{}}

      iex> update_article(article, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_article(%Article{} = article, attrs) do
    article
    |> Article.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Article.

  ## Examples

      iex> delete_article(article)
      {:ok, %Article{}}

      iex> delete_article(article)
      {:error, %Ecto.Changeset{}}

  """
  def delete_article(%Article{} = article) do
    Repo.delete(article)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking article changes.

  ## Examples

      iex> change_article(article)
      %Ecto.Changeset{source: %Article{}}

  """
  def change_article(%Article{} = article) do
    Article.changeset(article, %{})
  end
end
