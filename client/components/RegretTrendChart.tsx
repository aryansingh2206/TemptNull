import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function RegretTrendChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/stats/regret-trend", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        const labels = data.map((entry: any) => entry.date);
        const values = data.map((entry: any) => parseFloat(entry.averageRegret));

        setChartData({
          labels,
          datasets: [
            {
              label: "Avg Regret (bought items)",
              data: values,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.3,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("❌ Chart fetch failed:", err);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>;

  return (
    <div className="h-64">
      <Line data={chartData} />
    </div>
  );
}
