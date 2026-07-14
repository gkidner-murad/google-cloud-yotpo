const { sendJson } = require("../utils/envelope");

function requireApiKey(req, res, next) {
  const providedKey = req.headers["x-api-key"];

  if (!providedKey || providedKey !== process.env.PROXY_API_KEY) {
    return sendJson(res, 403, "API key not provided or invalid");
  }

  next();
}

module.exports = { requireApiKey };
