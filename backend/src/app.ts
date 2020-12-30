import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { mailer, EmailTemplate } from "./services/EmailService";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/invitation", (req, res) => {
	const data = req.body;
	const judgeParam = data.judgeType && `&type=${data.judgeType}`;
	let link,
		msg,
		btnText = null;

	if (data.type === "counter-bettor") {
		link = `https://ibetyou.me/accept-bet?address=${data.betAddress}`;
		msg = "I invite you to bet me!";
		btnText = "Accept the Bet";
	} else {
		link = `https://ibetyou.me/judge?address=${data.betAddress}${judgeParam}`;
		msg = "I invite you to be a judge!";
		btnText = "Accept to be a judge";
	}
	mailer
		.send({
			from: "no-reply@ibetyou.me",
			to: `${data.email}`,
			subject: `IBetYou Invitation`,
			html: EmailTemplate(msg, link, btnText),
		})
		.then(
			() => {
				res.sendStatus(200);
				console.log("Email sent successfully.");
			},
			(error) => {
				res.sendStatus(400);
				console.error(error);
				if (error.response) {
					console.error(error.response.body);
				}
			}
		);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server started at port: ${PORT}`);
});
