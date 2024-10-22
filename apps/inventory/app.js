const express = require('express');
const middleware = require('common-middleware');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));

app.use(middleware.notFound);

app.use(middleware.errorHandler);

module.exports = app;
