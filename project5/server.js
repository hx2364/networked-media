// Project 5: Travel Journal — static site served by Express
const express = require("express");
const app = express();
const port = 3002;

// Serve everything inside the public/ folder as static files
app.use(express.static("public"));

// Optional: a quick health-check route
app.get("/test", (req, res) => {
  res.send("Travel journal server is running.");
});

app.listen(port, () => {
  console.log(`Travel journal listening on port ${port}`);
});
