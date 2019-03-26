defmodule News.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :password_hash, :string

      timestamps()
    end

    index(:users, [:email], unique: true)
  end
end
