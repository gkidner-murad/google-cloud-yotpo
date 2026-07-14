class YotpoApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "YotpoApiError";
    this.statusCode = statusCode;
  }
}

async function getCustomerByEmail(email) {
  const url = new URL(`${process.env.YOTPO_API_BASE_URL}/customers`);
  url.searchParams.set("customer_email", email);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-GUID": process.env.YOTPO_GUID,
      "X-API-KEY": process.env.YOTPO_API_KEY,
    },
  });

  if (!response.ok) {
    throw new YotpoApiError(
      `Yotpo API responded with status ${response.status}`,
      response.status
    );
  }

  const { customer } = await response.json();
  return customer;
}

module.exports = { getCustomerByEmail, YotpoApiError };
