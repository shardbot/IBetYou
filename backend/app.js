const http = require("http");
const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const nodeMailer = require("nodemailer");

console.log(dotenv);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/invitation", (req, res) => {
	let data = req.body;
	let smtpTransport = nodeMailer.createTransport({
		service: process.env.EMAIL_SERVICE,
		port: 465,
		auth: {
			user: process.env.SENDER_EMAIL_ADDRESS,
			pass: process.env.SENDER_EMAIL_PASSWORD,
		},
	});
	let mailOptions = {
		from: process.env.SENDER_EMAIL_ADDRESS,
		to: data.email,
		subject: `${data.senderName} invites you to bet him!`,
		html: `
        <h3>Hello ${data.recipientName}! This is just a test.</h3>
        `,
	};
	smtpTransport.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.send("Failure");
		} else {
			res.send("Success");
		}
	});
	smtpTransport.close();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server started at port: ${PORT}`);
});
