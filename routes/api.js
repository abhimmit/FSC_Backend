const express = require ('express');
const router = express.Router();

const sendGmail = require('./sendGmail.js');
const sendHotmail = require('./sendHotmail.js');



router.post('/sendmail' , function(req, res, next){

		if( process.env.EMAIL_TO_USE.toUpperCase() === 'GMAIL' ) {
			const response = sendGmail(req , res);
		}else{
			const response = sendHotmail(req , res);
		}
		
        
});

router.get('/*', function(req, res, next){
 
		return "link not found";
		next();
        
});

module.exports = router;