import nodeMailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
require("dotenv").config();

console.log(process.env.SENDGRID_API_KEY)

const options = {
	auth: {
		api_key: process.env.SENDGRID_API_KEY,
	},
};

const mailer = nodeMailer.createTransport(sgTransport(options));

export default mailer;
