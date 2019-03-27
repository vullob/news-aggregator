defmodule News.SourcesTest do
  use News.DataCase

  alias News.Sources

  describe "sources" do
    alias News.Sources.Source

    @valid_attrs %{category: "some category", description: "some description", name: "some name", "source-id": "some source-id", url: "some url"}
    @update_attrs %{category: "some updated category", description: "some updated description", name: "some updated name", "source-id": "some updated source-id", url: "some updated url"}
    @invalid_attrs %{category: nil, description: nil, name: nil, "source-id": nil, url: nil}

    def source_fixture(attrs \\ %{}) do
      {:ok, source} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Sources.create_source()

      source
    end

    test "list_sources/0 returns all sources" do
      source = source_fixture()
      assert Sources.list_sources() == [source]
    end

    test "get_source!/1 returns the source with given id" do
      source = source_fixture()
      assert Sources.get_source!(source.id) == source
    end

    test "create_source/1 with valid data creates a source" do
      assert {:ok, %Source{} = source} = Sources.create_source(@valid_attrs)
      assert source.category == "some category"
      assert source.description == "some description"
      assert source.name == "some name"
      assert source.source-id == "some source-id"
      assert source.url == "some url"
    end

    test "create_source/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Sources.create_source(@invalid_attrs)
    end

    test "update_source/2 with valid data updates the source" do
      source = source_fixture()
      assert {:ok, %Source{} = source} = Sources.update_source(source, @update_attrs)
      assert source.category == "some updated category"
      assert source.description == "some updated description"
      assert source.name == "some updated name"
      assert source.source-id == "some updated source-id"
      assert source.url == "some updated url"
    end

    test "update_source/2 with invalid data returns error changeset" do
      source = source_fixture()
      assert {:error, %Ecto.Changeset{}} = Sources.update_source(source, @invalid_attrs)
      assert source == Sources.get_source!(source.id)
    end

    test "delete_source/1 deletes the source" do
      source = source_fixture()
      assert {:ok, %Source{}} = Sources.delete_source(source)
      assert_raise Ecto.NoResultsError, fn -> Sources.get_source!(source.id) end
    end

    test "change_source/1 returns a source changeset" do
      source = source_fixture()
      assert %Ecto.Changeset{} = Sources.change_source(source)
    end
  end
end
