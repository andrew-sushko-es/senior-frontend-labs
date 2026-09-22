import type { Company } from "../domain/company";
import { calculateCompanyStats } from "../domain/stats";

export function CompanyStats({ company }: { company: Company }) {
  const stats = calculateCompanyStats(company);

  return (
    <section
      className="marketplace-company-stats"
      aria-label="Company statistics"
    >
      <div>
        <span>Delivery score</span>
        <strong>{stats.deliveryScore}</strong>
      </div>
      <div>
        <span>Completion</span>
        <strong>{stats.completionRate}</strong>
      </div>
      <div>
        <span>Recent response</span>
        <strong>{stats.recentResponseRate}</strong>
      </div>
      <p>{stats.trialMix}</p>
      <ul>
        {stats.serviceCoverage.slice(0, 3).map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </section>
  );
}
