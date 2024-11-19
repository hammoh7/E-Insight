const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transaction');
const { seedDatabase } = require('./utils/seedData'); // Import seedData function
const Transaction = require('./models/Transaction'); // Import your Transaction model

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', transactionRoutes);

// Seed the database only if it's empty
const seedOnFirstRun = async () => {
    const count = await Transaction.countDocuments(); // Count documents in the 'transactions' collection
    if (count === 0) { // If the collection is empty, seed data
        console.log('Seeding data...');
        await seedDatabase(); // This will seed the data from the API
    } else {
        console.log('Data already seeded.');
    }
};

seedOnFirstRun(); // Call this function to check and seed data

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
