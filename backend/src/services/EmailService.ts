import nodeMailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
require("dotenv").config();

const options = {
	auth: {
		api_key: process.env.SENDGRID_API_KEY,
	},
};

const mailer = nodeMailer.createTransport(sgTransport(options));

export default mailer;