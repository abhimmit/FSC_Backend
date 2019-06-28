const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
 async function sendHotmail(req , res){
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
	
	let data = req.body.data;
	
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	
	// Create the transporter with the required configuration for Outlook
	// change the user and pass !
	 var transporter = nodemailer.createTransport({
		service: process.env.SMTP_HOTMAIL_SERVER,
		auth: {
			type: 'login',
			user: process.env.MY_HOTMAIL_EMAIL,
			pass: process.env.MY_HOTMAIL_PASSWORD,
		}
		//tls: {
		//   ciphers:'SSLv3',
		//  rejectUnauthorized: false
		// },
		// secureConnection: false, // TLS requires secureConnection to be false
		
		// port: 587, // port for secure SMTP
	});
	
	transporter.verify((err, success) => {
		if (err) {
			console.error(err);
		}else{
			console.log('Your config is correct');
		};
		console.log('Your config is correct');
	});

	// setup e-mail data, even with unicode symbols
	var mailOptions = {
		from: `< ${ process.env.MY_HOTMAIL_EMAIL } >`, // sender address (who sends)
		to: process.env.MY_HOTMAIL_EMAIL, // list of receivers (who receives)
		subject: data.subject, // Subject line
		text: data.description, // plaintext body
		html: `<h3><b>Van : ${ data.name }</b></h3> Email adres : ${data.email} <br> Telefoon : ${data.telephone} <br> <p> ${ data.description } </p>`, // html body
	};
	// html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
	
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
module.exports = sendHotmail;
