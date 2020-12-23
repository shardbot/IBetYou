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

  const judgeParam = data.judgeType && `&type=${data.judgeType}`;

  const html =
    data.type === "counter-bettor"
      ? `I invite you to bet me at <a href="https://ibetyou.me/accept-bet?address=${data.betAddress}">Link</a>`
      : `I invite you to be a judge at <a href="https://ibetyou.me/judge?address=${data.betAddress}${judgeParam}">Link</a>`;

  mailer
    .sendMail({
      from: "no-reply@ibetyou.me",
      to: `${data.email}`,
      subject: `IBetYou Invitation`,
      html: html,
    })
    .then(() => {
      console.log("Email sent successfully.");
      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(400);
      console.log("Email was not sent.");
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
