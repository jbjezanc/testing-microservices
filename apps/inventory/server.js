const app = require('./app');
const port = process.env.PORT || '3001';
const { sequelize } = require('../inventory/db/models');
const { OrderSubscriber } = require('./subscribers');

// Start DB
sequelize
  .sync()
  .then(() => {
    console.log('🗄️ Inventory database has been initialized');
  })
  .catch((e) => {
    console.error('Error initializing the inventory database:', e);
  });

// Start app
app.listen(port, () => {
  console.log(`🚀 Inventory microservice listening on port ${port}`);
});

// Start subscriber
const orderSubscriber = new OrderSubscriber();
orderSubscriber.start();
