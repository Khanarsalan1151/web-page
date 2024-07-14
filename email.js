// Import the Nodemailer library
const nodemailer = require('nodemailer');


function SendEmail(email,username){
    let transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
    user: 'khanabdulmomin24@gmail.com',
    pass: 'xtjw ybtn brwg poku'
}
});

// Configure the mailoptions object
const mailOptions = {
  from: 'Noreply@gmail.com',
  to: `${email}`,
  subject: 'Change in password',
  text: `hey @${username}, your WanderLust password has been changed now!!!! `
};

// Send the email
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Error:', error);
  }
});
}


module.exports = SendEmail;
