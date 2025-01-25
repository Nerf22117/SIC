import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.ETHEREAL_HOST,
  port: process.env.ETHEREAL_PORT,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message");
    console.log(success);
  }
});

export { transporter };
