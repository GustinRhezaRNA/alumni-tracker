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
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y" as const, // Ini yang membuat batang jadi horizontal
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Rata-Rata Rating Per Jurusan",
        font: {
          size: 18,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
  callbacks: {
    label: function (context: any) {
      const value = context.raw;
      return typeof value === "number"
        ? `Rating: ${value.toFixed(2)}`
        : `Rating: ${value}`;
    },
  },
},

    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: "Rata-Rata Rating",
        },
      },
      y: {
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
    <div className="w-full h-[400px]"> 
      <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
    </div>
  );
};

export default AverageRatingsByMajor;
