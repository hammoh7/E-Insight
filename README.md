## E-Insight
### An assignment project that fetches transaction data from a third-party API and provides complete transaction data & monthly sales report through bar-graphs and pie-charts 

### Getting Started

1. Clone the project:
    ```
    git clone https://github.com/hammoh7/E-Insight.git
    ```
2. Installing node modules:
   ```
   cd frontend
   npm install
   ```
   ```
   cd backend
   npm install
   ```
3. Inserting API keys and URLs in env files. So firstly create .env file in both 'backend' and 'frontend' folder<br>
   Content for Backend .env file:-
   ```
   PORT=
   MONGO_URI=""
   THIRD_PARTY_API_URL=
   ```
   Content for Frontend .env file:-
   ```
   REACT_APP_API_BASE_URL=
   ```
4. Run both the frontend and backend for the application:
   ```
   cd backend
   npm start
   ```
   ```
   cd frontend
   npm start
   ```
