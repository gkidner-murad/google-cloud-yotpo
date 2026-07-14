const { YotpoApiError } = require("../services/yotpoClient");
const { sendJson } = require("../utils/envelope");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message, stack: err.stack }));

  if (err instanceof YotpoApiError) {
    const statusCode = err.statusCode === 404 ? 404 : 502;
    const message = statusCode === 404 ? "Customer not found" : "Yotpo API request failed";
    return sendJson(res, statusCode, message);
  }

  sendJson(res, 500, "Internal server error");
}

module.exports = { errorHandler };
