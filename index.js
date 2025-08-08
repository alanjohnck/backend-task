const express = require('express');
const app = express();
const PORT = 3000;
const reportRoutes = require("./routes/report")
const activityRoutes = require("./routes/activity")
app.use(express.json());

// Routes
app.use("/report",reportRoutes);
app.use("/activity",activityRoutes);
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
