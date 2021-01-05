import mailer from "@sendgrid/mail";
import path from "path";
import pug from "pug";
require("dotenv").config();

mailer.setApiKey(process.env.SENDGRID_API_KEY);

export { mailer };

export const EmailTemplate = (
	message: string,
	link: string,
	btnText: string
) => {
	const template = path.resolve("src", "services", "templates", "email.pug");
	const html = pug.compileFile(template, { pretty: true })({
		message,
		link,
		btnText,
	});

	return html;
};
