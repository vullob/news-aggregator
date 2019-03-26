defmodule News.NewsApi do

  alias HTTPoision

  def fetch_top_headlines do
    headers = ["Authorization": System.get_env("NEWS_API_KEY")]
    url = System.get_env("NEWS_API_BASE") <> "/top-headlines?country=us"
    case HTTPoison.get(url, headers) do
      {:ok, %{body: raw_body, status_code: code}} -> Jason.decode(raw_body)
      {:error, %{reason: reason}} -> {:error, reason}
    end
  end

end
