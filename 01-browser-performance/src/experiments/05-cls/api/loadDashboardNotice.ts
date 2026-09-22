export type DashboardNotice = {
  message: string;
  type: "warning";
};

const dashboardNoticeUrl = "/experiments/05-cls/dashboard-notice.json";

export async function loadDashboardNotice(signal: AbortSignal) {
  const response = await fetch(dashboardNoticeUrl, { signal });
  if (!response.ok) {
    throw new Error("Dashboard notice could not be loaded.");
  }

  return (await response.json()) as DashboardNotice;
}
