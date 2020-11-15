import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mailer from "./services/EmailService";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/invitation", (req, res) => {
	const data = req.body;
	mailer.sendMail({
			from: "no-reply@ibetyou.me",
			to: `${data.email}`,
			subject: `iBetYou Invitation`,
			html: `I invite you to bet me at <a href=https://ibetyou.me/accept-bet/${data.betAddress}></a> !`,
		}).then(() => {
			console.log("Email sent successfully.");
		}).catch(() => {
			console.log("Email was not sent.");
		});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server started at port: ${PORT}`);
});
