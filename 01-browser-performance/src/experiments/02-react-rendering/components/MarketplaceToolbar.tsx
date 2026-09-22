import { useMarketplace } from "../context/useMarketplace";

export function MarketplaceToolbar() {
  const { compactMode, setCompactMode, compareSelection } = useMarketplace();

  return (
    <div className="marketplace-toolbar">
      <label className="marketplace-toggle">
        <input
          checked={compactMode}
          onChange={(event) => setCompactMode(event.target.checked)}
          type="checkbox"
        />
        Compact mode
      </label>
      <span>{compareSelection.length} selected for comparison</span>
    </div>
  );
}
