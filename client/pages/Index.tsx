import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DashboardCard } from "@/components/DashboardCard";
import RegretTrendChart from "@/components/RegretTrendChart";
import  SkippedVsBoughtChart from "@/components/SkippedVsBoughtChart";

export default function Index() {
  const [recentDecisions, setRecentDecisions] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalSaved: 0,
    totalHours: 0,
    totalImpulses: 0,
    avgRegret: "0.0",
  });

  useEffect(() => {
    const fetchImpulses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/impulses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch impulses");

        const data = await response.json();
        console.log("📦 Fetched impulses:", data);
        const latestFour = data.slice(-4).reverse();
        setRecentDecisions(latestFour);
      } catch (error) {
        console.error("📉 Failed to fetch impulses:", error);
      }
    };

    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch summary");

        const data = await response.json();
        console.log("📊 Fetched summary:", data);
        setSummary(data);
      } catch (error) {
        console.error("📉 Failed to fetch summary:", error);
      }
    };

    fetchImpulses();
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="₹ Saved This Month"
            value={`₹${summary.totalSaved}`}
            trend="up"
            trendValue="+15%"
            subtitle="from last month"
            icon={
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          <DashboardCard
            title="Hours Saved"
            value={`${summary.totalHours}`}
            trend="up"
            trendValue="+8hrs"
            subtitle="research time saved"
            icon={
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
         <DashboardCard
  title="Impulses Resisted"
  value={`${summary.totalImpulses}`}
  trend="up"
  trendValue={`+${summary.totalImpulses}`} // optional, or remove this line
  subtitle="this month"
  icon={
    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  }
/>

          <DashboardCard
            title="Regret Score Trend"
            value={`${summary.avgRegret}/10`}
            trend="down"
            trendValue="-1.1"
            subtitle="improving!"
            icon={
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Placeholder Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Regret Probability Over Time
            </h3>
            <RegretTrendChart />

          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
    Skipped vs Bought Ratio
  </h3>
  <div className="flex items-center justify-center h-64">
  <div className="w-48 h-48">
    <SkippedVsBoughtChart />
  </div>
</div>
</div>
        </div>

        {/* Recent Impulse Decisions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Recent Impulse Decisions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Item Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Regret Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {recentDecisions.map((decision, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">{decision.item}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">₹{decision.price}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          decision.status === "skipped"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {decision.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {decision.regretRating ? `${decision.regretRating}/10` : "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                      {decision.date ? new Date(decision.date).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
