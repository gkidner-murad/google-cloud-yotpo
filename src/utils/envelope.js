const { version } = require("../../package.json");

function sendJson(res, statusCode, message, data = null) {
  res.status(statusCode).json({ apiVersion: version, message, data });
}

module.exports = { sendJson };
