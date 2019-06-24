const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendMail =  async function(data){
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  
  
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 465,
    secure: true, // true for 465, false for other ports like 587
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD
    }
  });
                                                    
	var mailOptions = {
		from: `Farida's Stress Counseling <${data.email}>`, 
		to: process.env.MY_EMAIL,
		subject: data.subject, 
		text: data.description, 
		html: `<h3><b>Van : ${ data.name }</b></h3> Email adres : ${data.email} <br> Telefoon : ${data.telephone} <br> <p> ${ data.description } </p>`, 
	};
	
	// send mail with defined transport object                                                  
	await transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
	});
}

module.exports = sendMail;
