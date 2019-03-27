defmodule News.Sources.Source do
  use Ecto.Schema
  import Ecto.Changeset
  @primary_key {:source_id, :string, autogenerate: false}

  schema "sources" do
    field :category, :string, null: false, default: "general"
    field :description, :string, null: false, default: "", size: 2000
    field :name, :string, null: false
    field :url, :string, null: false
    has_many :articles, News.Articles.Article

    timestamps()
  end

  @doc false
  def changeset(source, attrs) do
    source
    |> cast(attrs, [:source_id, :name, :description, :url, :category])
    |> unique_constraint(:source_id)
    |> validate_required([:source_id, :name, :description, :url, :category])
  end
end
