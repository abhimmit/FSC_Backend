const express = require ('express');
const router = express.Router();

const sendGmail = require('./sendGmail.js');
const sendHotmail = require('./sendHotmail.js');
const sendStrato = require('./sendStrato.js');



router.post('/sendmail' , function(req, res, next){
	
		const server = process.env.EMAIL_TO_USE.toUpperCase();
		let response = '';
		switch ( server ) {
			case 'GMAIL':
				response = sendGmail(req , res);
				break;
			case 'HOTMAIL':
				response = sendHotmail(req , res);
				break;
			case 'STRATO':
				response = sendStrato(req , res);
				break;
		}

        
});

router.get('/*', function(req, res, next){
 
		return "link not found";
		next();
        
});

module.exports = router;