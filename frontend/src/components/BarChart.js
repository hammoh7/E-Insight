import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { fetchBarChartData } from "../services/api";
import { Chart, registerables } from "chart.js";

// Register all necessary components
Chart.register(...registerables);

const BarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({});
  const [prices, setPrices] = useState([]); // State to hold prices
  const [dates, setDates] = useState([]); // State to hold dates
  const prevMonthRef = useRef();

  useEffect(() => {
    console.log("BarChart component mounted or updated");
    console.log("Previous month:", prevMonthRef.current);
    console.log("Current month:", selectedMonth);

    if (!selectedMonth) {
      console.log("Selected month is null, skipping API call");
      return;
    }

    const loadChartData = async () => {
      try {
        const data = await fetchBarChartData(selectedMonth);
        console.log("Bar chart data received:", data);
    
        if (!Array.isArray(data) || data.length === 0) {
          console.error("Received data is not in the expected format or is empty.");
          return;
        }
    
        const labels = [
          "0-100",
          "101-200",
          "201-300",
          "301-400",
          "401-500",
          "501-600",
          "601-700",
          "701-800",
          "801-900",
          "901+",
        ];
    
        const rangeMapping = labels.map(() => ({
          prices: [],
          dates: [],
        }));
    
        const getRangeIndex = (price) => {
          if (price <= 100) return 0;
          if (price <= 200) return 1;
          if (price <= 300) return 2;
          if (price <= 400) return 3;
          if (price <= 500) return 4;
          if (price <= 600) return 5;
          if (price <= 700) return 6;
          if (price <= 800) return 7;
          if (price <= 900) return 8;
          return 9; // 901+
        };
    
        const rangeCounts = new Array(labels.length).fill(0);
        data.forEach((item) => {
          const index = getRangeIndex(item.averagePrice);
          rangeCounts[index]++;
          if (item.averagePrice !== undefined) {
            rangeMapping[index].prices.push(item.averagePrice.toFixed(2));
          }
          if (item.firstDate) {
            rangeMapping[index].dates.push(new Date(item.firstDate).toLocaleDateString());
          }
        });
    
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Items Sold",
              data: rangeCounts,
              backgroundColor: "#36A2EB",
              hoverBackgroundColor: "#36A2AC",
            },
          ],
        });
    
        setPrices(rangeMapping.map((range) => range.prices));
        setDates(rangeMapping.map((range) => range.dates));
      } catch (error) {
        console.error("Failed to fetch bar chart data:", error);
      }
    };    

    loadChartData();
    prevMonthRef.current = selectedMonth;
  }, [selectedMonth]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Sales Statistics for {selectedMonth}
      </h2>
      {chartData.labels && chartData.labels.length > 0 ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: "top" },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const index = tooltipItem.dataIndex;
                    const price = prices[index] || "Not available";
                    const date = dates[index] || "Not available";
                    return `Price: $${price} on ${date}`; // Show price and date on hover
                  },
                  title: () => "", // Remove the title (starting range)
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Price Ranges",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Items Sold",
                },
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      ) : (
        <p className="text-gray-500">
          No data available for the selected month.
        </p>
      )}
    </div>
  );
};

export default BarChart;
