const nodemailer = require('nodemailer');

/*
email send karne ke liye ham transporter ka use karte ha matlab email ke liye bhi alag server hote ha jo google ke ha unhe SMDP server bolte ha jab bhi user ko email send karna hota ha toh transporter SMDP server se connect hokar server ko email send karne ke liye bolte ha or uske liye hame user ke cridentials cahiye hote ha jo ki transporter ke pass hote ha 
*/

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email

/*
ab ye send email ke andar ham 'to' me jisko email send karna ha usko , " subject " deteha , or "text " jo dena ha vo dete ha 
per jo bhi content hamko send karna ha vo content "HTML" me send karna padta ha 
*/
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name){
    const subject = "Welcome to our Backend Ledger!";
    const text = `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering with us! We're excited to have you on board.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail,subject,text,html);
}

async function sendTransactionEmail(userEmail, name, toAccount, amount){
    const subject = "Transaction Notification";
    const text = `Hello,\n\nA transaction has been made from account ${name} to account ${toAccount} for the amount of ${amount}.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello,</p><p>A transaction has been made from account <strong>${name}</strong> to account <strong>${toAccount}</strong> for the amount of <strong>${amount}</strong>.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, toAccount, amount){
    const subject = "Transaction Failure Notification";
    const text = `Hello,\n\nA transaction from account ${name} to account ${toAccount} for the amount of ${amount} has failed.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello,</p><p>A transaction from account <strong>${name}</strong> to account <strong>${toAccount}</strong> for the amount of <strong>${amount}</strong> has failed.</p><p>Best regards,<br>The Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};