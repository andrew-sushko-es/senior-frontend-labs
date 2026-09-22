export function measureApplyFilters<T>(operation: () => T) {
  performance.clearMarks("apply-filters:start");
  performance.clearMarks("apply-filters:end");
  performance.clearMeasures("apply-filters");
  performance.mark("apply-filters:start");
  const result = operation();
  performance.mark("apply-filters:end");
  performance.measure(
    "apply-filters",
    "apply-filters:start",
    "apply-filters:end",
  );
  return {
    result,
    duration:
      performance.getEntriesByName("apply-filters").at(-1)?.duration ?? 0,
  };
}
