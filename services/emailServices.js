const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.TEST_VER}/verify/${verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your PayFlow Account",
    text: `Click the link below to verify your account:\n\n${verificationLink}`,
  };
  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to PayFlow",
    text: `Hello ${name},\n\nYour account has been verified successfully!\nEnjoy secure transactions.\n\nBest,\nPayFlow Team`,
  };
  await transporter.sendMail(mailOptions);
};
const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${process.env.TEST_VER}/reset/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your PayFlow Password",
    text: `Click the link below to reset your password:\n\n${resetLink}`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
};
