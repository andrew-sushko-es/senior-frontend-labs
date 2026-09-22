import type { Company } from "./company";

export type CompanyStatsSnapshot = {
  completionRate: string;
  recentResponseRate: string;
  deliveryScore: number;
  serviceCoverage: string[];
  trialMix: string;
};

export function calculateCompanyStats(company: Company): CompanyStatsSnapshot {
  const orderedHistory = [...company.history].sort((left, right) =>
    left.period.localeCompare(right.period),
  );
  const recentHistory = orderedHistory.slice(-6);
  const totalEnrolled = orderedHistory.reduce(
    (total, period) => total + period.enrolledParticipants,
    0,
  );
  const totalCompleted = orderedHistory.reduce(
    (total, period) => total + period.completedParticipants,
    0,
  );
  const recentResponseRate =
    recentHistory.reduce((total, period) => total + period.responseRate, 0) /
    recentHistory.length;
  const completionRate = totalCompleted / totalEnrolled;
  const completionTrend = recentHistory.reduce(
    (total, period, index) =>
      total + period.completedParticipants * (index + 1),
    0,
  );
  const serviceCoverage = company.services
    .map((service) =>
      service.replace(" strategy", "").replace(" operations", ""),
    )
    .sort((left, right) => left.localeCompare(right));
  const deliveryScore = Math.round(
    company.rating * 14 +
      recentResponseRate * 0.24 +
      completionRate * 22 +
      Math.min(12, completionTrend / 550),
  );

  return {
    completionRate: `${Math.round(completionRate * 100)}%`,
    recentResponseRate: `${Math.round(recentResponseRate)}%`,
    deliveryScore,
    serviceCoverage,
    trialMix: `${company.activeTrials} active / ${company.completedTrials} completed`,
  };
}
