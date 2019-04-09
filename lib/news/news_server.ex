defmodule News.NewsServer do
  use GenServer

  def start_link(_) do
     GenServer.start_link(__MODULE__, %{})
  end


  def init(_) do
    Process.send_after(self(), :update, 10000)
    #Process.send(self(), :update, [])
    {:ok, %{}}
  end

  def handle_info(:update, state) do
    # only need to update these once a day, or on start
    state = if rem(Map.get(state, :time) || 0, 86400000) == 0 do
                "FETCHING SOURCES" |> IO.inspect
                case News.NewsApi.fetch_sources do
                  {:ok, data} -> News.Sources.create_all_sources(data["sources"])
                  _ -> "No Sources Found? Something went wrong :(" |> IO.inspect
                end
                Map.put(state, :time, 0)
          else Map.put(state, :time, (state[:time] || 0) + 900000) end
    if rem(Map.get(state, :time), 3600000) == 0 do # every hour, we update unpopular categories
        "FETCHING UNPOPULAR ARTICLES" |> IO.inspect
        ["science", "entertainment", "sports", "business", "health"]
        |> Enum.each(fn category -> case News.NewsApi.fetch_category(category) do
                                                                    {:ok, data} -> data["articles"]
                                                                                    |> Enum.map(fn article -> Map.put(article, "article_category", category) end)
                                                                                    |> News.Articles.create_all_articles
                                                                                    |> broadcast
                                                                      _ -> "No Articles Found? Something went wrong :(" |> IO.inspect;
                                                                    end end)
    end
    "FETCHING POPULAR ARTICLES" |> IO.inspect
    ["general", "technology"]
      |> Enum.each(fn category -> case News.NewsApi.fetch_category(category) do
                                                                    {:ok, data} -> data["articles"]
                                                                                    |> Enum.map(fn article -> Map.put(article, "article_category", category) end)
                                                                                    |> News.Articles.create_all_articles
                                                                                    |> broadcast
                                                                      _ -> "No Articles Found? Something went wrong :(" |> IO.inspect;
                                                                    end end)
    schedule_timer(900000)
    {:noreply, state}
  end


  defp schedule_timer(inter) do
    Process.send_after(self(), :update, inter)
  end

  defp broadcast(data) do
      data = %{articles: NewsWeb.ArticleView.render("index.json", %{articles: data})}
      NewsWeb.Endpoint.broadcast!("news", "update_news",  data)
  end

end
