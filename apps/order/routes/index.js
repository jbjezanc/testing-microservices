const express = require('express');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
    IP: req.ip,
    URL: req.originalUrl,
  });
});

router.use('/orders', require('./order.routes'));

module.exports = router;
