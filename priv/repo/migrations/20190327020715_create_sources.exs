defmodule News.Repo.Migrations.CreateSources do
  use Ecto.Migration

  def change do
    create table(:sources) do
      add :source_id, :string, primary_key: true
      add :name, :string, null: false, default: ""
      add :description, :string, null: false, default: "", size: 2000
      add :url, :string, null: false
      add :category, :string, null: false, default: ""

      timestamps()
    end
    create unique_index(:sources, [:source_id])


    alter table(:articles) do
      add :source, references(:sources, column: :source_id, type: :string, on_delete: :delete_all), null: true
    end

  end
end
