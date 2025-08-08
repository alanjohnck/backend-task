const express = require('express');
const app = express();
const PORT = 3000;
const reportRouters = require("./routes/report")
app.use(express.json());

// Routes
app.use("/report",reportRouters);
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
