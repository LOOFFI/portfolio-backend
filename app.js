require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore   = require("connect-mongo")(session);
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const passport = require('./config/passport');

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();



    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(logger('dev'));

    app.locals.title = 'proj-portfolio';
    
    app.use(
      cors({
        credentials: true,
        origin: [process.env.FRONTENDPOINT]
      })
    );
    
    app.use(session({
      secret: "1234",
      saveUninitialized:true,
      resave: true,
      store: new MongoStore ({ mongooseConnection: mongoose.connection }),
    }));


const index = require('./routes/index');
const auth = require('./routes/auth');
const contactRoutes = require("./routes/contact.js");
app.use('/api', index);
app.use('/api', auth);
app.use('/api', contactRoutes);


// Uncomment this line for production
app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

module.exports = app;

