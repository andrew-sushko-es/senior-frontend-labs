import { useLayoutEffect, useState } from "react";

type LayoutShiftEntry = PerformanceEntry & {
  hadRecentInput: boolean;
  value: number;
};

export function useObservedCls() {
  const [observedCls, setObservedCls] = useState(0);

  useLayoutEffect(() => {
    if (!("PerformanceObserver" in window)) {
      return;
    }

    let total = 0;
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          total += entry.value;
        }
      }
      setObservedCls(total);
    });

    observer.observe({ type: "layout-shift", buffered: true });
    return () => observer.disconnect();
  }, []);

  return observedCls;
}
