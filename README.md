
# **ReconcileX Lite - Transaction Reconciliation System**

## **Project Overview**

ReconcileX Lite is a transaction reconciliation system built to handle the reconciliation of financial transactions in a reliable and efficient manner. The system ensures that transactions are not duplicated, helps identify discrepancies, and supports syncing with an external payment provider. It also implements retry-safe operations and offers APIs for querying and managing transaction data.

---

## **Technologies Used**

* **Node.js** - JavaScript runtime environment for building scalable backend services.
* **Express.js** - Web framework for building RESTful APIs.
* **Sequelize** - ORM for managing MySQL database interactions.
* **MySQL** - Relational database to store transaction data.
* **Redis** - In-memory data store for caching and handling duplicate transaction checks.
* **dotenv** - To manage environment variables.

---

## **Features**

* **Transaction Creation**: Create transactions with idempotency checks to avoid duplicates.
* **Transaction Fetching**: Retrieve all transactions or fetch specific ones using a unique reference.
* **Reconciliation Report**: Generate reconciliation reports based on transaction data, with detailed insights into discrepancies.
* **Retry-safe Operations**: Ensure operations are retry-safe using Redis for transaction state management.
* **Admin Routes**: Routes for admin users to view all transactions and manage mismatches.

---

## **Installation**

Follow these steps to get the project up and running locally:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/reconcilex.git
cd reconcilex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file at the root of the project with the following contents:

```
PORT=5000
DB_HOST=localhost
DB_USER=pass
DB_PASSWORD=yourpassword
DB_NAME=reconcilex
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Run the server

```bash
npm start
```

The server should now be running on `http://localhost:5000`.

---

## **API Usage**

### **1. Create Transaction**

* **Endpoint**: `POST /api/transactions`
* **Request Body**:

```json
{
  "id": "TXN123456",
  "amount": 100.0,
  "status": "success",
  "reference": "TXN123456789",
  "source": "PaymentGateway",
  "currency": "USD",
  "timestamp": "2025-05-06T14:30:00Z"
}
```

* **Response**:

```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "TXN123456",
    "amount": 100.0,
    "status": "success",
    "reference": "TXN123456789",
    "source": "PaymentGateway",
    "currency": "USD",
    "timestamp": "2025-05-06T14:30:00Z"
  }
}
```

### **2. Get All Transactions**

* **Endpoint**: `GET /api/transactions`
* **Response**:

```json
{
  "transactions": [
    {
      "id": "TXN123456",
      "amount": 100.0,
      "status": "success",
      "reference": "TXN123456789",
      "source": "PaymentGateway",
      "currency": "USD",
      "timestamp": "2025-05-06T14:30:00Z"
    }
  ]
}
```

### **3. Get Transaction by Reference**

* **Endpoint**: `GET /api/transactions/:reference`
* **Response**:

```json
{
  "message": "Transaction fetched from DB",
  "transaction": {
    "id": "TXN123456",
    "amount": 100.0,
    "status": "success",
    "reference": "TXN123456789",
    "source": "PaymentGateway",
    "currency": "USD",
    "timestamp": "2025-05-06T14:30:00Z"
  }
}
```

### **4. Generate Reconciliation Report**

* **Endpoint**: `GET /api/transactions/reconciliation/report`

* **Query Parameters** (Optional):

  * `startDate` (ISO format)
  * `endDate` (ISO format)
  * `status` (e.g., "success", "failed")

* **Response**:

```json
{
  "message": "Reconciliation report generated successfully",
  "report": {
    "totalTransactions": 5,
    "discrepancies": 1,
    "details": [
      {
        "id": "TXN123457",
        "reference": "TXN123456790",
        "amount": 150.0,
        "status": "failed",
        "timestamp": "2025-05-06T14:35:00Z"
      }
    ]
  }
}
```

---

## **Testing**

To test the API, use Postman or curl:

* **Create Transaction**: Send a `POST` request to `/api/transactions` with the appropriate JSON body.
* **Get All Transactions**: Send a `GET` request to `/api/transactions`.
* **Get Transaction by Reference**: Send a `GET` request to `/api/transactions/:reference`.
* **Generate Reconciliation Report**: Send a `GET` request to `/api/transactions/reconciliation/report`.

---

## **Contributing**

If you'd like to contribute, feel free to fork the repository and submit a pull request. Make sure to follow the project's code style and write tests for new features or bug fixes.

