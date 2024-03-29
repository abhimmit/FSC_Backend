const nodemailer = require("nodemailer");
var sanitizeHtml = require('sanitize-html')

// async..await is not allowed in global scope, must use a wrapper
async function sendGmail(req , res ){
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  let data = req.body.data;
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
	service: process.env.SMTP_GMAIL_SERVER,
    auth: {
		user: process.env.MY_GMAIL_FROMADDRESS,
		pass: process.env.MY_GMAIL_PASSWORD
    }
	//port: 465,
    //secure: true, // true for 465, false for other ports like 587
	//tls: {
    //    // do not fail on invalid certs
    //    rejectUnauthorized: false
    //}
	});
	
	transporter.verify((err, success) => {
		if (err) {
			console.error(err);
		}else{
			// console.log('Your config is correct');
		};
	});
                                                    
	var mailOptions = {
		from: `<${process.env.MY_GMAIL_FROMADDRESS}>`, 
		to: process.env.MY_GMAIL_TOADDRESS,
		subject: sanitize(data.subject),
		text: sanitize(data.description), 
		html: `<h3>Van : ${ sanitize(data.name) }</h3> Email adres : ${ sanitize(data.email) } <br> Telefoon : 
				${ sanitize(data.telephone) } <br> <p> ${ sanitize(data.description) }</p>`, // html body 
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
    };
	
	function sanitize(input){
		return sanitizeHtml(input, {allowedTags: [ ],  allowedAttributes: {} });
		
	}
}

module.exports = sendGmail;
