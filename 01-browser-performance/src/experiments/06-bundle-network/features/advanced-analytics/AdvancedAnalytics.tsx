import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsSeries } from "../../data/reports";

export function AdvancedAnalytics({ onClose }: { onClose: () => void }) {
  return (
    <section
      className="reporting-tool-panel"
      aria-labelledby="analytics-heading"
    >
      <div className="reporting-tool-heading">
        <div>
          <p className="section-label">Advanced analytics</p>
          <h2 id="analytics-heading">Service performance trend</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          type="button"
          aria-label="Close advanced analytics"
        >
          ×
        </button>
      </div>
      <p className="analytics-description">
        Compare the weekly on-time completion trend with reported operational
        exceptions.
      </p>
      <div
        className="reporting-chart"
        role="img"
        aria-label="Line chart showing on-time completion and exceptions over eight weeks"
      >
        <ResponsiveContainer height="100%" width="100%">
          <LineChart
            data={analyticsSeries}
            margin={{ top: 8, right: 18, left: -16, bottom: 0 }}
          >
            <CartesianGrid stroke="#dce6ed" strokeDasharray="3 3" />
            <XAxis dataKey="week" stroke="#65798a" />
            <YAxis stroke="#65798a" yAxisId="completion" domain={[80, 100]} />
            <YAxis stroke="#65798a" orientation="right" yAxisId="exceptions" />
            <Tooltip />
            <Legend />
            <Line
              dataKey="onTime"
              name="On-time %"
              stroke="#1766a3"
              strokeWidth={3}
              type="monotone"
              yAxisId="completion"
            />
            <Line
              dataKey="exceptions"
              name="Exceptions"
              stroke="#c06b37"
              strokeWidth={3}
              type="monotone"
              yAxisId="exceptions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
