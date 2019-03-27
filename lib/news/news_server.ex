defmodule News.NewsServer do
  use GenServer

  def start_link(_) do
     GenServer.start_link(__MODULE__, %{})
  end


  def init(_) do
    Process.send(self(), :update, [])
    schedule_timer(900000) # 15 min timer
    {:ok, %{}}
  end

  def handle_info(:update, state) do

   # only need to update these once a day, or on start
    state = if rem(state[:time] || 0, 86400000) do
                case News.NewsApi.fetch_sources do
                  {:ok, data} -> News.Sources.create_all_sources(data["sources"])
                  true -> "No Sources Found? Something went wrong :(" |> IO.inspect
                end
                0
          else Map.put(state, :time, state[:time] || 0 + 900000) end
    case News.NewsApi.fetch_top_headlines do
      {:ok, data} -> News.Articles.create_all_articles(data["articles"])
      true -> "No Articles Found? Something went wrong :(" |> IO.inspect
    end
    case News.NewsApi.fetch_everything_recent do
      {:ok, data} -> News.Articles.create_all_articles(data["articles"])
      true -> "No Articles Found? Something went wrong :(" |> IO.inspect
    end


    schedule_timer(900000)
    {:noreply, state}
  end

  defp schedule_timer(inter) do
    Process.send_after(self(), :update, inter)
  end

end
