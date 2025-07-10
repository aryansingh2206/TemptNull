import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchWithToken } from "../utils/fetchWithToken";

ChartJS.register(ArcElement, Tooltip, Legend);

const SkippedVsBoughtChart = () => {
  const [chartData, setChartData] = useState<{ labels: string[]; data: number[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchWithToken("/api/stats/skipped-vs-bought");
        setChartData(res);
      } catch (err) {
        console.error("Failed to fetch doughnut chart data", err);
        setChartData({ labels: ["Bought", "Skipped"], data: [0, 0] }); // fallback
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return <div className="text-center">Loading Chart...</div>;

  if (!chartData || chartData.data.every((val) => val === 0)) {
    return <div className="text-center text-gray-500">No decision data yet!</div>;
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Decisions",
        data: chartData.data,
        backgroundColor: ["#f87171","#4ade80"], // green (bought), red (skipped)
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-48 h-48">
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default SkippedVsBoughtChart;
