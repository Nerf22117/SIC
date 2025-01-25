import nodemailer from "nodemailer";

console.log("ETHEREAL_HOST", process.env.ETHEREAL_HOST);
console.log("ETHEREAL_PORT", process.env.ETHEREAL_PORT);
console.log("ETHEREAL_USER", process.env.ETHEREAL_USER);
console.log("ETHEREAL_PASS", process.env.ETHEREAL_PASS);

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
