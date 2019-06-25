const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendGmail(req , res ){
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  let data = req.body.data;
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
	name: 'https://sendmail-tofsc.herokuapp.com',
    host: process.env.SMTP_GMAIL_SERVER,
    port: 465,
    secure: true, // true for 465, false for other ports like 587
    auth: {
      user: process.env.MY_GMAIL_EMAIL,
      pass: process.env.MY_GMAIL_PASSWORD
    },
	tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
  });
                                                    
	var mailOptions = {
		from: `<${process.env.MY_GMAIL_EMAIL}>`, 
		to: process.env.MY_GMAIL_EMAIL,
		subject: data.subject, 
		text: data.description, 
		html: `<h3><b>Van : ${ data.name }</b></h3> Email adres : ${data.email} <br> Telefoon : ${data.telephone} <br> <p> ${ data.description } </p>`, 
	};
	
	// send mail with defined transport object                                                  
	let valid = true;
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
			valid = false;
		};

		// console.log('Message sent: ' + info.response);
	}); 
	
	if(valid){
        return res.status(200).send({
            message: "Success"
        });
    }else{
        return res.status(500).send({
            message: "Failed"
        });
    }
}

module.exports = sendGmail;
