defmodule News.Repo do
  use Ecto.Repo,
    otp_app: :news,
    adapter: Ecto.Adapters.Postgres
end
