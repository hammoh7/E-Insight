import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log("API Base URL:", API_BASE_URL);

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

// Transactions
export const fetchTransactions = async (month, searchText = "", page = 1) => {
  try {
    if (!month) {
      throw new Error("Month is required to fetch transactions");
    }
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
      params: { month, search: searchText, page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    throw error; 
  }
};

// Statistics
export const fetchStatistics = async (monthName) => {
  try {
    if (!monthName) {
      throw new Error("Month is required to fetch statistics");
    }

    const monthMap = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const month = monthMap[monthName];
    if (!month) {
      throw new Error("Invalid month name");
    }

    const response = await axios.get(`${API_BASE_URL}/statistics`, {
      params: { month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
    throw error;
  }
};

// Bar Chart data
export const fetchBarChartData = async (monthName) => {
  try {
    if (!monthName) {
      throw new Error("Month is required to fetch bar chart data");
    }

    const monthMap = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const month = monthMap[monthName];
    if (!month) {
      throw new Error("Invalid month name");
    }

    const response = await axios.get(`${API_BASE_URL}/bar-chart`, {
      params: { month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bar chart data:", error.message);
    throw error;
  }
};  
