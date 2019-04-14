defmodule News.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field :publishedAt, :utc_datetime
    field :text, :string
    belongs_to :user, News.Users.User
    belongs_to :article, News.Users.User

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:text, :publishedAt, :user_id, :article_id])
    |> foreign_key_constraint(:user_id, [message: "user not found"])
    |> foreign_key_constraint(:article_id, [message: "article not found"])
    |> validate_length(:text)
    |> validate_required([:text, :publishedAt])
  end

  def validate_length(changeset, field) do
    validate_change(changeset, field, fn _, name ->
      cond do
        String.length(name) > 255 && field == :text -> [comment: "comment cannot be longer than 255 characters"]
        true -> []
      end
    end)
  end

end
