"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AverageRatingData {
  major: string;
  averageRating: number;
}

const AverageRatingsByMajor: React.FC = () => {
  const [averageRatings, setAverageRatings] = useState<AverageRatingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAverageRatings = async () => {
      try {
        const response = await fetch("/api/chart");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAverageRatings(data.data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchAverageRatings();
  }, []);

  const chartData = {
    labels: averageRatings.map((item) => item.major),
    datasets: [
      {
        label: "Rata-Rata Rating",
        data: averageRatings.map((item) => item.averageRating),
        backgroundColor: "rgba(54, 162, 235, 0.8)", // Warna bar
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Rata-Rata Rating Per Jurusan",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Asumsi skala rating maksimum adalah 5
        title: {
          display: true,
          text: "Rata-Rata Rating",
        },
      },
      x: {
        title: {
          display: true,
          text: "Jurusan",
        },
      },
    },
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div>Error loading chart data: {error}</div>;
  }

  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AverageRatingsByMajor;