require('dotenv').config();

const express = require("express");
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const cron = require("node-cron");

const requireLogin = require("./middleware/auth.login.middleware.js");

const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://'+ process.env.MONGO_USER+ ':'+ process.env.MONGO_PASSWORD +'@cluster0-03npr.mongodb.net/stadium?retryWrites=true&w=majority', 
	{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected!");
});

// cron.schedule('* * * * *', () => {
// 	  console.log('Running cron every minutes');
// 	});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_COOKIE));

app.use(requireLogin.requireSignIn);

const SignRoute = require("./routes/auth.login.routes.js");
const TransactionRoute = require("./routes/transactions.routes.js");
const UserRoute = require("./routes/user.routes.js");
const OrderRoute = require("./routes/order.routes.js");

app.set('view engine', 'pug');
app.set("views", "./views");

app.get("/", (req, res) => {
	res.render("layouts/index");
});

app.use("/auth/", SignRoute);
app.use("/transaction/", TransactionRoute);
app.use("/user/", UserRoute);
app.use("/stadium/", OrderRoute);

const PORT = process.env.PORT || 3000;

// const PORT = 3000;

app.listen(PORT, ()=> {
	console.log(Date(), "\nListening on port : " + PORT);
})


//remind before 2 hours
