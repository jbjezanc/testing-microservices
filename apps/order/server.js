const app = require('./app');
const port = process.env.PORT || '3002';
const { sequelize } = require('../order/db/models');
const inventorySubscriber = require('./subscribers/inventory.subscriber');

// Start DB
sequelize
  .sync()
  .then(() => {
    console.log('🗄️ Order database has been initialized');
  })
  .catch((e) => {
    console.error('Error initializing the order database:', e);
  });

// Start app
app.listen(port, () => {
  console.log(`🚀 Order microservice listening on port ${port}`);
});

// Start subscriber
inventorySubscriber.start();
