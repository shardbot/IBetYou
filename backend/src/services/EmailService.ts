import nodeMailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import path from "path";
import pug from "pug";
require("dotenv").config();

const options = {
	auth: {
		api_key: process.env.SENDGRID_API_KEY,
	},
};

export const mailer = nodeMailer.createTransport(sgTransport(options));

export const EmailTemplate = (message: string, link: string, btnText: string) => {
	const template = path.resolve("src", "services", "templates", "email.pug");
	const html = pug.compileFile(template, { pretty: true })({
		message,
		link,
		btnText
	})

	return html;
}
