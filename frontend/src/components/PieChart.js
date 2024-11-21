import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { fetchPieChartData } from "../services/api";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const PieChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({});
  const prevMonthRef = useRef();

  useEffect(() => {

    if (!selectedMonth) {
      console.log("Selected month is null, skipping API call");
      return;
    }

    const loadChartData = async () => {
      try {
        const data = await fetchPieChartData(selectedMonth);

        if (!Array.isArray(data) || data.length === 0) {
          console.error("Received data is not in the expected format or is empty.");
          return;
        }

        const labels = data.map(item => item._id); 
        const values = data.map(item => item.count); 
        const prices = data.map(item => item.price); 

        setChartData({
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch pie chart data:", error);
      }
    };

    loadChartData();
    prevMonthRef.current = selectedMonth;
  }, [selectedMonth]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Product Distribution for {selectedMonth}
      </h2>
      {chartData.labels && chartData.labels.length > 0 ? (
        <div style={{ width: '300px', height: '300px' }}> 
          <Pie
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.label || '';
                      const value = tooltipItem.raw || 0;
                      const index = tooltipItem.dataIndex;
                      const price = chartData.datasets[0].data[index].price; 
                      const totalPrice = (value * price).toFixed(2); 
                      return `${label}: ${value} (Total Price: $${totalPrice})`; 
                    },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-gray-500">
          No data available for the selected month.
        </p>
      )}
    </div>
  );
};

export default PieChart;