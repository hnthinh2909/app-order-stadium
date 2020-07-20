require('dotenv').config();

const nodemailer = require('nodemailer');
const express = require("express");
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const Transaction = require("./models/transaction.models.js");

const cron = require("node-cron");
const moment = require("moment-timezone");


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


cron.schedule('*/59 * * * *', async () => {
	let trans = await Transaction.find({});
	const time = moment.tz("Asia/Ho_Chi_Minh");
	let hour = time.hour();
	let date = moment().date();
	let month = moment().month();
	
	trans.map( tran => {
		let hourTran = (tran.time.from).slice(0,2);
		let dateTran = tran.date.day;
		let monthTran = tran.date.month;

		if(parseInt(monthTran) === month) {
			if(parseInt(dateTran) === date) {
				if((parseInt(hourTran) - hour >= 1) && (parseInt(hourTran) - hour <= 3)) {
					var transporter = nodemailer.createTransport({
					  host: 'smtp.gmail.com',
					  port: 465,
					  secure:true,
					  auth: {
					    user: process.env.GOOGLE_USER,
					    pass: process.env.GOOGLE_PWD
					  }
					});

					var mailOptions = {
					  from: 'app-order-stadium@gmail.com',
					  to: tran.email,
					  subject: 'Remind Time Into Stadium',
					  text: 'This is email is auto, don\'t reply!',
					  html: '<p>Stadium\'s ordered will begin in :<b>' + tran.time.from + '</b><p>'
					};
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						    console.log(error);
						  } else {
						    console.log('Email sent: ' + info.response);
						}
					});
				} else {
					console.log("No one order in next 2 hours!")
				}
			} else {
				console.log("No one order in today!")
			}
		} else {
			console.log("No one order in this month!")
		}
	})
	console.log('Running cron every minutes');
});


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


// change transactions, add order/:id, index transaction

