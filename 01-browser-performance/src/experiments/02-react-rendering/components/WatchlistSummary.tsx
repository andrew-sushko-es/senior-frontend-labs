import { useMarketplace } from "../context/useMarketplace";

export function WatchlistSummary() {
  const { watchlist } = useMarketplace();
  return <p className="watchlist-summary">Watchlist: {watchlist.size}</p>;
}
