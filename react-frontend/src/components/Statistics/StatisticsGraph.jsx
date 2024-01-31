// StatisticsGraph.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';

const StatisticsGraph = ({ data }) => {
  const chartRef = useRef(null);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Destroy the existing chart instance before updating
    if (chartRef.current) {
      const chartInstance = chartRef.current.chartInstance;
      if (chartInstance) {
        chartInstance.destroy();
      }
    }

    // Set new chart data
    setChartData({
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.colors,
        },
      ],
    });
  }, [data]);

  return (
    <div>
      <Doughnut data={chartData} options={{ maintainAspectRatio: false }} ref={chartRef} />
    </div>
  );
};

export default StatisticsGraph;
