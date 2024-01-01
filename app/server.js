const express = require("express");
const { register } = require("prom-client");
const prometheus = require("prom-client");

const app = express();

const requestCounter = new prometheus.Counter({
  name: "app_requests_total",
  help: "Total number of requests to the application",
});

// Define predefined labels for the histogram
const requestDuration = new prometheus.Histogram({
  name: "app_request_duration_seconds",
  help: "Duration of requests to the application",
  labelNames: ["method", "status"], // Define the labels upfront
  buckets: [0.1, 0.5, 1, 2, 5],
});

const randomguage = new prometheus.Gauge({
  name: "test_gauge_with_random_values",
  help: "Example of a gauge",
  labelNames: ["code"],
});

app.use((req, res, next) => {
  requestCounter.inc();

  const startTime = new Date();

  res.on("finish", () => {
    const duration = new Date() - startTime;
    // Use predefined labels when calling observe
    requestDuration.observe(
      { method: req.method, status: res.statusCode },
      duration / 1000
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.send("Hello, Prometheus!");
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", prometheus.register.contentType);
    const metrics = await prometheus.register.metrics();
    res.end(metrics);
  } catch (error) {
    console.error("Error generating metrics:", error);
    res.status(500).send("Internal Server Error");
  }
});

//app.get("/metrics", (req, res) => {
//res.set("Content-Type", prometheus.register.contentType);
//res.end(prometheus.register.metrics());
//});

const port = 7000;
app.listen(port, () => {
  guage_operator();
  console.log(`Server listening on http://localhost:${port}`);
});

async function guage_operator() {
  setInterval(async () => {
    randomguage.set(Math.random());
    await register.metrics();
  }, 10000);
}
