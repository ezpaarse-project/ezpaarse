'use strict';

const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.resolve(`${__dirname}/_build/html`)));

app.listen(8000, () => {
  /* eslint-disable-next-line */
  console.log('Server listening on http://localhost:8000/');
});