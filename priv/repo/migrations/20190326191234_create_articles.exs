defmodule News.Repo.Migrations.CreateArticles do
  use Ecto.Migration

  def change do
    create table(:articles) do
      add :author, :string, null: false, default: ""
      add :title, :string, null: false
      add :description, :string, null: true, default: "", size: 2000
      add :url, :string, null: false
      add :urlToImage, :string, null: false
      add :publishedAt, :naive_datetime, null: false
      add :content, :string, null: true, default: "", size: 2000

      timestamps()
    end
    create unique_index(:articles, [:title])
  end
end
