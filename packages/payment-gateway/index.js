const { calculateTaxes } = require('./utils/calculations');

async function chargeIt(paymentInfo) {
  console.log('Processing payment...');
  // Simulate a synchronous request to a payment gateway
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalCharge =
        paymentInfo.total +
        paymentInfo.total * calculateTaxes(paymentInfo.state);
      console.log(`Credit card charged ${totalCharge}. Payment complete.`);
      resolve(totalCharge);
    }, 2000);
  });
}

module.exports = { chargeIt };
