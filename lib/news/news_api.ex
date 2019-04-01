defmodule News.NewsApi do

  alias HTTPoision

  def fetch_sources do
    headers = ["Authorization": System.get_env("NEWS_API_KEY")]
    url = System.get_env("NEWS_API_BASE") <> "sources?language=en"
    case HTTPoison.get(url, headers) do
      {:ok, %{body: raw_body, status_code: 200}} -> Jason.decode(raw_body)
      {:error, %{reason: reason}} -> {:error, reason}
    end
  end

  def fetch_everything_recent do
    headers = ["Authorization": System.get_env("NEWS_API_KEY")]
    sources = "bbc-news,abc-news,associated-press,bloomberg,cbs-news,cnn,fox-news,fox-sports,hacker-news,nbc-news,reuters,techcrunch,the-new-york-times,the-wall-street-journal"
    earliestTime = DateTime.to_iso8601(DateTime.add(DateTime.truncate(DateTime.utc_now, :second), -1800, :second)) # this is set to -30 mins, since the free plan gives us a 15 min delay
    url = System.get_env("NEWS_API_BASE") <> "/everything?sources=" <> sources <> "&pageSize=100&sortBy=popularity&language=en&from" <> earliestTime
    case HTTPoison.get(url, headers) do
      {:ok, %{body: raw_body, status_code: 200}} -> Jason.decode(raw_body)
      {:error, %{reason: reason}} -> {:error, reason}
    end
  end

  def fetch_category(category) do
    headers = ["Authorization": System.get_env("NEWS_API_KEY")]
    url = System.get_env("NEWS_API_BASE") <> "/top-headlines?category=#{category}&pageSize=100&country=us"
    case HTTPoison.get(url, headers) do
      {:ok, %{body: raw_body, status_code: 200}} -> Jason.decode(raw_body)
      {:error, %{reason: reason}} -> {:error, reason}
    end
  end

  def fetch_top_headlines do
    headers = ["Authorization": System.get_env("NEWS_API_KEY")]
    url = System.get_env("NEWS_API_BASE") <> "/top-headlines?country=us&pageSize=100&language=en"
    case HTTPoison.get(url, headers) do
      {:ok, %{body: raw_body, status_code: 200}} -> Jason.decode(raw_body)
      {:error, %{reason: reason}} -> {:error, reason}
    end
  end

end
