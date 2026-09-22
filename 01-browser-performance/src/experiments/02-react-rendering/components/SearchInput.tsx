import { useMarketplace } from "../context/useMarketplace";

export function SearchInput() {
  const { search, setSearch } = useMarketplace();

  return (
    <label className="marketplace-search">
      Search companies
      <input
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Try biopharma"
        type="search"
        value={search}
      />
    </label>
  );
}
