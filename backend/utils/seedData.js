const axios = require("axios");
const Transaction = require("../models/Transaction");

// Fetch and seed data
const seedDatabase = async () => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get(process.env.THIRD_PARTY_API_URL);
    const data = response.data;

    if (!data || data.length === 0) {
      console.log("No data found in the third-party API.");
      return;
    }

    // Save the fetched data into the database
    for (const transaction of data) {
      await Transaction.updateOne(
        { id: transaction.id },
        { $set: transaction },
        { upsert: true }
      );
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error.message);
  }
};

module.exports = { seedDatabase };
