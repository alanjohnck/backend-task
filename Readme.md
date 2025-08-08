# Backend Task - Company Activity Reporting API

A Node.js Express API for managing and reporting company activity data including companies, teams, members, and their activities.

## 📁 Project Structure

```
backend-task/
├── data/
│   └── data.js              # Sample company data
├── routes/
│   └── report.js            # API route handlers
├── index.js                   # Main application file
├── package.json             # Project dependencies and scripts
└── README.md               # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory:**

   ```bash
   git clone https://github.com/alanjohnck/backend-task.git
   cd backend-task
   ```

2. **Initialize npm (if package.json doesn't exist):**

   ```bash
   npm init -y
   ```

3. **Install dependencies:**

   ```bash
   npm install express
   npm install --save-dev nodemon
   ```

4. **Create the main application file (app.js):**

   ```bash
   # This file should be created as shown below
   ```

5. **Update package.json scripts:**
   ```bash
   npm pkg set scripts.start="node app.js"
   npm pkg set scripts.dev="nodemon app.js"
   ```

### Running the Application

1. **Development mode (with auto-restart):**

   ```bash
   npm run dev
   ```

2. **Production mode:**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Base URL: `http://localhost:3000/report`

| Method | Endpoint              | Description                                 |
| ------ | --------------------- | ------------------------------------------- |
| GET    | `/overview`           | Get overall statistics across all companies |
| GET    | `/company/:companyId` | Get detailed report for a specific company  |
| GET    | `/member/:memberId`   | Get detailed report for a specific member   |

### Example Requests

```bash
# Get overview
curl http://localhost:3000/report/overview

# Get company report
curl http://localhost:3000/report/company/comp_1

# Get member report
curl http://localhost:3000/report/member/mem_1
```

## 🛠️ Development

### Project Dependencies

- **express**: Web framework for Node.js
- **nodemon**: Development tool for auto-restarting the server

## 📝 Notes

- The application uses in-memory data storage
- All data is defined in `data/data.js`
