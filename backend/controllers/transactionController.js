const { seedDatabase } = require("../utils/seedData");
const Transaction = require("../models/Transaction");

// Helper function to validate the month parameter
const validateMonth = (month) => {
  const parsedMonth = parseInt(month);
  return parsedMonth >= 1 && parsedMonth <= 12 ? parsedMonth : null;
};

// Controller to initialize the database
const initializeDatabase = async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ message: "Database initialized successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to initialize the database.",
      error: error.message,
    });
  }
};

// Fetch transactions with optional search and pagination
const getTransactions = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  try {
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const transactions = await Transaction.find(filter)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalTransactions = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: parseInt(page),
      totalTransactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
};

// Generate statistics (total sales, sold/not-sold items)
const getStatistics = async (req, res) => {
  const month = validateMonth(req.query.month);
  if (!month) {
    return res.status(400).json({ message: "Invalid or missing month." });
  }

  try {
    const totalSales = await Transaction.aggregate([
      {
        $match: {
          sold: true,
          $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      sold: true,
      $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      sold: false,
      $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
    });

    res.json({
      totalSales: totalSales[0]?.totalSales || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generating statistics.",
      error: error.message,
    });
  }
};

// Generate data for bar chart
const getBarChartData = async (req, res) => {
  const month = validateMonth(req.query.month);
  if (!month) {
    return res.status(400).json({ message: "Invalid or missing month." });
  }

  try {
    const barChartData = await Transaction.aggregate([
      {
        $match: {
          sold: true,
          $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "901+",
          output: {
            count: { $sum: 1 },
            averagePrice: { $avg: "$price" }, // Average price in the range
            firstDate: { $first: "$dateOfSale" }, // First date of sale in the range
          },
        },
      },
    ]);

    // Check if barChartData is empty
    if (!barChartData || barChartData.length === 0) {
      return res.status(404).json({ message: "No data found for the selected month." });
    }

    // Format the response to match the expected structure
    const formattedData = barChartData.map((bucket) => ({
      _id: bucket._id,
      count: bucket.count,
      averagePrice: bucket.averagePrice || 0,
      firstDate: bucket.firstDate || null,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generating bar chart data.",
      error: error.message,
    });
  }
};

// Generate data for pie chart
const getPieChartData = async (req, res) => {
  const month = validateMonth(req.query.month);
  if (!month) {
    return res.status(400).json({ message: "Invalid or missing month." });
  }

  try {
    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(pieChartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generating pie chart data.",
      error: error.message,
    });
  }
};

// Combine statistics, bar chart, and pie chart data
const getCombinedData = async (req, res) => {
  const month = validateMonth(req.query.month);
  if (!month) {
    return res.status(400).json({ message: "Invalid or missing month." });
  }

  try {
    const statistics = await Transaction.aggregate([
      {
        $match: {
          sold: true,
          $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$price" } } },
    ]);

    // const barChartData = await getBarChartData({ query: { month } }, { json: (data) => data });
    // const pieChartData = await getPieChartData({ query: { month } }, { json: (data) => data });

    const barChartData = await Transaction.aggregate([
      { query: { month } },
      { json: (data) => data },
    ]);
    const pieChartData = await Transaction.aggregate([
      { query: { month } },
      { json: (data) => data },
    ]);

    res.json({
      statistics,
      barChartData,
      pieChartData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generating combined data.",
      error: error.message,
    });
  }
};

module.exports = {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
};
