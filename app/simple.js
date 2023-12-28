const promBundle = require("express-prom-bundle");
const app = require("express")();
const metricsMiddleware = promBundle({ includeMethod: true });

app.use(metricsMiddleware);
app.listen(7000);
