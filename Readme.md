# Company Activity Reporting API

A RESTful API built with Node.js and Express for managing and reporting company activity data. Track companies, teams, members, and their daily activities with comprehensive reporting features.

## 📁 Project Structure

```
backend-task/
├── data/
│   └── data.js              # Sample company data
├── routes/
│   └── report.js            # API route handlers
├── index.js                   # Main application file
├── package.json             # Project dependencies and scripts
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/alanjohnck/backend-task.git
   cd backend-task
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
http://localhost:3000/
```

### Endpoints

| Method | Endpoint                    | Description                   | Query Parameters       |
| ------ | --------------------------- | ----------------------------- | ---------------------- |
| GET    | `report/overview`           | Overview statistics           | `startDate`, `endDate` |
| GET    | `report/company/:companyId` | Company-specific report       | `startDate`, `endDate` |
| GET    | `report/member/:memberId`   | Member activity report        | `startDate`, `endDate` |
| POST   | `/activity/add-activity`    | Add new activity for a member | -                      |

### Sample API Responses

#### 1. Overview Report

**Request:**

```bash
GET /report/overview
```

**Response:**

```json
{
  "totalCompanies": 2,
  "totalTeams": 3,
  "totalMembers": 5,
  "totalActivities": 11,
  "totalHours": 34,
  "topActivityTypes": [
    {
      "type": "coding",
      "totalHours": 11
    },
    {
      "type": "meeting",
      "totalHours": 9
    },
    {
      "type": "content",
      "totalHours": 7
    },
    {
      "type": "design",
      "totalHours": 4
    },
    {
      "type": "seo",
      "totalHours": 2
    },
    {
      "type": "review",
      "totalHours": 1
    }
  ]
}
```

#### 2. Company Report

**Request:**

```bash
GET /report/company/comp_1
```

**Response:**

```json
{
  "companyId": "comp_1",
  "companyName": "Alpha Inc",
  "teams": [
    {
      "teamId": "team_1",
      "teamName": "Engineering",
      "totalMembers": 2,
      "totalHours": 17,
      "activityBreakdown": [
        {
          "type": "coding",
          "totalHours": 11
        },
        {
          "type": "meeting",
          "totalHours": 5
        },
        {
          "type": "review",
          "totalHours": 1
        }
      ],
      "uniqueTags": [
        "feature",
        "frontend",
        "planning",
        "code",
        "bugfix",
        "sync"
      ]
    },
    {
      "teamId": "team_2",
      "teamName": "Design",
      "totalMembers": 1,
      "totalHours": 6,
      "activityBreakdown": [
        {
          "type": "design",
          "totalHours": 4
        },
        {
          "type": "meeting",
          "totalHours": 2
        }
      ],
      "uniqueTags": ["ui", "figma", "handoff"]
    }
  ]
}
```

#### 3. Member Report

**Request:**

```bash
GET /report/member/mem_1
```

**Response:**

```json
{
  "memberId": "mem_1",
  "name": "Alice",
  "totalHours": 8,
  "dailyBreakdown": [
    {
      "date": "2024-03-01",
      "activities": ["coding"],
      "hours": 5
    },
    {
      "date": "2024-03-02",
      "activities": ["meeting"],
      "hours": 2
    },
    {
      "date": "2024-03-03",
      "activities": ["review"],
      "hours": 1
    }
  ]
}
```

#### 4. Date Filtering

**Request:**

```bash
GET /report/overview?startDate=2024-03-02&endDate=2024-03-03
```

**Response:**

```json
{
  "totalCompanies": 2,
  "totalTeams": 3,
  "totalMembers": 5,
  "totalActivities": 7,
  "totalHours": 16,
  "topActivityTypes": [
    {
      "type": "meeting",
      "totalHours": 9
    },
    {
      "type": "design",
      "totalHours": 4
    },
    {
      "type": "seo",
      "totalHours": 2
    },
    {
      "type": "review",
      "totalHours": 1
    }
  ]
}
```

#### 5. Add New Activity (POST)

**Request:**

```bash
POST /activity/add-activity
Content-Type: application/json

{
  "memberId": "mem_1",
  "date": "2024-03-04",
  "type": "coding",
  "hours": 3,
  "tags": ["bugfix", "backend"]
}
```

**Response:**

```json
{
  "message": "Activity added successfully",
  "activity": {
    "date": "2024-03-04",
    "type": "coding",
    "hours": 3,
    "tags": ["bugfix", "backend"]
  },
  "member": {
    "memberId": "mem_1",
    "name": "Alice",
    "teamName": "Engineering",
    "companyName": "Alpha Inc"
  }
}
```

## 🧪 Testing the API

### Using curl:

```bash
# Get overview
curl http://localhost:3000/report/overview

# Get company report
curl http://localhost:3000/report/company/comp_1

# Get member report
curl http://localhost:3000/report/member/mem_1

# Get filtered overview
curl "http://localhost:3000/report/overview?startDate=2024-03-01&endDate=2024-03-02"

### Add New Activity
POST http://localhost:3000/activity/add-activity
Content-Type: application/json

{
  "memberId": "mem_1",
  "date": "2024-03-04",
  "type": "coding",
  "hours": 3,
  "tags": ["bugfix", "backend"]
}

#test
GET http://localhost:3000/activity/company/comp_1
```

### Using Postman:

1. Import the base URL: `http://localhost:3000/report`
2. Test each endpoint with the provided paths
3. Add query parameters for date filtering

```

```
