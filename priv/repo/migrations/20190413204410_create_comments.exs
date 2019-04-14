defmodule News.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :text, :string
      add :publishedAt, :naive_datetime
      add :user_id, references(:users, on_delete: :nilify_all), null: false
      add :article_id, references(:articles, on_delete: :delete_all), null: false

      timestamps()
    end

  end
end
