defmodule NewsWeb.ArticleView do
  use NewsWeb, :view
  alias NewsWeb.ArticleView

  def render("index.json", %{articles: articles}) do
    %{data: render_many(articles, ArticleView, "article.json")}
  end

  def render("show.json", %{article: article}) do
    %{data: render_one(article, ArticleView, "article.json")}
  end

  def render("article.json", %{article: article}) do
    source = (article.source != nil) && render_one(article.source, NewsWeb.SourceView, "source.json") || article.source
    %{id: article.id,
      author: article.author,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      content: article.content,
      article_category: article.article_category,
      likes: article.likes,
      source: source}
  end
end
