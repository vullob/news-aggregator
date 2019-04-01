defmodule News.Repo.Migrations.AddArticleCategory do
  use Ecto.Migration

  def change do
    alter table(:articles) do
      add :article_category, :string, null: false, default: "general"
    end

    create(index(:articles, [:article_category]))
  end
end
