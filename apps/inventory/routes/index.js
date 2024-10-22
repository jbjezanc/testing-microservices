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

router.use('/tickets', require('./ticket.routes'));
router.use('/reserved-tickets', require('./reserved-ticket.routes'));
router.use('/events', require('./event.routes'));

module.exports = router;
