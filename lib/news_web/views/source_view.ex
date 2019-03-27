defmodule NewsWeb.SourceView do
  use NewsWeb, :view
  alias NewsWeb.SourceView

  def render("index.json", %{sources: sources}) do
    %{data: render_many(sources, SourceView, "source.json")}
  end

  def render("show.json", %{source: source}) do
    %{data: render_one(source, SourceView, "source.json")}
  end

  def render("source.json", %{source: source}) do
    %{id: source.id,
      source_id: source.source_id,
      name: source.name,
      description: source.description,
      url: source.url,
      category: source.category}
  end
end
