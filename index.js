const express    = require('express');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mongoose   = require('mongoose');

const app        = express();
const config     = require('./config/config');
const router     = require('./config/routes');

mongoose.connect(config.db);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', router);

app.listen(config.port, () => console.log(`WooooHoooo on port ${config.port}`));
