const express = require("express");
const yotpoClient = require("../services/yotpoClient");
const { sendJson } = require("../utils/envelope");

const router = express.Router();

router.post("/points-expiration", async (req, res) => {
  const { customer_email: customerEmail } = req.body || {};

  if (!customerEmail || typeof customerEmail !== "string") {
    return sendJson(res, 400, "customer_email is required");
  }

  const customer = await yotpoClient.getCustomerByEmail(customerEmail);

  sendJson(res, 200, "OK", {
    next_points_expire_on: customer.next_points_expire_on,
    next_points_expire_amount: customer.next_points_expire_amount,
  });
});

module.exports = router;
