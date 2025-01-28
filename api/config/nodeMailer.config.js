import nodemailer from "nodemailer";

/**
 * Creates a transporter object using the default SMTP transport.
 * The transporter is configured to use Ethereal email service with the following settings:
 * - Host: Retrieved from environment variable ETHEREAL_HOST
 * - Port: Retrieved from environment variable ETHEREAL_PORT
 * - Authentication:
 *   - User: Retrieved from environment variable ETHEREAL_USER
 *   - Password: Retrieved from environment variable ETHEREAL_PASS
 *
 * @type {import('nodemailer').Transporter}
 */
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
