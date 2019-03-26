defmodule News.NewsServer do
  use GenServer

  def start_link(_) do
     GenServer.start_link(__MODULE__, %{})
  end


  def init(_) do
    Process.send(self(), :update, [])
    schedule_timer(900000) # 15 min timer
    {:ok, []}
  end

  def handle_info(:update, _) do
    "UPDATING" |> IO.inspect
    case News.NewsApi.fetch_top_headlines do
      {:ok, data} -> News.Articles.create_all_articles(data["articles"])
      true -> "No Articles Found? Something went wrong :(" |> IO.inspect
    end
    schedule_timer(900000)
    {:noreply, []}
  end

  defp schedule_timer(inter) do
    Process.send_after(self(), :update, inter)
  end

end
