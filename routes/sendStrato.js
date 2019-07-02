const nodemailer = require("nodemailer");
var sanitizeHtml = require('sanitize-html')

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
		host: process.env.SMTP_STRATO_SERVER,
		auth: {
			user: process.env.MY_STRATO_FROMADDRESS,
			pass: process.env.MY_STRATO_PASSWORD,
		},
		tls: {
			ciphers:'SSLv3',
			rejectUnauthorized: false
		},
		secureConnection: false, // TLS requires secureConnection to be false
		
		port: 465, // 587 port for secure SMTP
	});
	
	transporter.verify((err, success) => {
		if (err) {
			console.error(err);
		}else{
			// console.log('Your config is correct');
		};
	});

	// setup e-mail data, even with unicode symbols
	var mailOptions = {
		from: `<${process.env.MY_STRATO_FROMADDRESS}>`, // sender address (who sends)
		to: process.env.MY_STRATO_TOADDRESS, // list of receivers (who receives)
		subject: sanitize(data.subject), // Subject line
		text: sanitize(data.description), // plaintext body
		
		html: `<h3>Van : ${ sanitize(data.name) }</h3> Email adres : ${ sanitize(data.email) } <br> Telefoon : 
		${ sanitize(data.telephone) } <br> <p> ${ sanitize(data.description) }</p>`, // html body
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
    };
	
	function sanitize(input){
		return sanitizeHtml(input, {allowedTags: [ ],  allowedAttributes: {} });
		
	}
}
module.exports = sendHotmail;
