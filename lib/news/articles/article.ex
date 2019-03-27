defmodule News.Articles.Article do
  use Ecto.Schema
  import Ecto.Changeset

  schema "articles" do
    field :author, :string
    field :content, :string, size: 2000
    field :description, :string, size: 2000
    field :publishedAt, :naive_datetime
    field :title, :string, size: 2000
    field :url, :string, size: 2000
    field :urlToImage, :string, size: 2000
    belongs_to :source, News.Sources.Source, references: :source_id, type: :string

    timestamps()
  end

  @doc false
  def changeset(article, attrs) do
    article
    |> cast(attrs, [:author, :title, :description, :url, :urlToImage, :publishedAt, :content, :source_id])
    |> foreign_key_constraint(:source_id, [message: "source not found"])
    |> unique_constraint(:title)
    |> validate_required([:title, :url, :urlToImage, :publishedAt])
  end
end
