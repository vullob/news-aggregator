defmodule News.Repo.Migrations.UserArticleXref do
  use Ecto.Migration

  def change do
    create table(:user_article, primary_key: false) do
      add(:user_id, references(:users, on_delete: :delete_all), primary_key: true)
      add(:article_id, references(:articles, on_delete: :delete_all), primary_key: true)
    end
    

    create(index(:user_article, [:user_id]))
    create(index(:user_article, [:article_id]))

    create(unique_index(:user_article, [:user_id, :article_id], name: :user_id_article_id_unique_index))
  end
end
