import { SearchResults } from "~/components/Forum/search-results";
import { SearchForm } from "~/components/Forum/search-form";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; tags?: string }
}) {
  const query = searchParams.q || ""
  const tags = searchParams.tags ? searchParams.tags.split(",") : []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>
      <SearchForm initialQuery={query} initialTags={tags} />
      <SearchResults query={query} tags={tags} />
    </div>
  )
}

