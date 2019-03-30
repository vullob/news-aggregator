defmodule News.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :password_hash, :string
    many_to_many :articles, News.Articles.Article, join_through: "user_article", on_replace: :delete


    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password_hash])
    |> validate_confirmation(:password)
    |> validate_password(:password)
    |> put_pass_hash()
    |> validate_format(:email, ~r/@/)
    |> validate_required([:email, :password_hash])
  end

  def changeset_add_articles(%News.Users.User{} = user, articles) do
    articles = articles |> Enum.map(&Ecto.Changeset.change/1)
    Ecto.Changeset.change(user)
    |> put_assoc(:articles, articles)
  end

  # Password validation
  # From Comeonin docs
  def validate_password(changeset, field, options \\ []) do
    validate_change(changeset, field, fn _, password ->
      case valid_password?(password) do
        {:ok, _} -> []
        {:error, msg} -> [{field, options[:message] || msg}]
      end
    end)
  end

  def put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, Comeonin.Argon2.add_hash(password))
  end

  def put_pass_hash(changeset), do: changeset

  def valid_password?(password) when byte_size(password) > 7 do
    {:ok, password}
   end

  def valid_password?(_), do: {:error, "The password is too short"}
end
