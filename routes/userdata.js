const   express 		= require("express"),
        router 		    = express.Router(),
        passport 		= require("passport"),
        {oauth} 	    = require('../configuration'),
        DataDeletionsHistory = require("../models/dataDeletionsHistory"),
        User 			= require("../models/user"),
        crypto          = require('crypto');

function base64decode(data) {
    while (data.length % 4 !== 0)
    {
        data += '=';
    }
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    return new Buffer(data, 'base64').toString('utf-8');
}
       
function parseSignedRequest(signedRequest, secret) {
    var encoded_data = signedRequest.split('.', 2);
    // decode the data
    var sig = encoded_data[0];
    var json = base64decode(encoded_data[1]);
    var data = JSON.parse(json);
    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
    throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
    }
    var expected_sig = crypto.createHmac('sha256', secret).update(encoded_data[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
    if (sig !== expected_sig) {
    throw Error('Invalid signature: ' + sig + '. Expected ' + expected_sig);
    }
    return data;
}
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

router.post("/userData/delete/facebookData", function(req, res){
    
    let signed_request = req.body.signed_request;
    let data = parseSignedRequest(signed_request,oauth.facebook.clientSecret);
    let user_id = data.user_id;
    
    User.remove({ "facebook.id" : user_id },async function(err) {
	    if (err) {
	        throw err;
	    }
	    else 
        {
            var newDeletion = new DataDeletionsHistory();
            newDeletion.completed = true;
            newDeletion.source = 'facebook';
            newDeletion.sourceId = user_id;
            newDeletion.date = Date.now();
            newDeletion.identifier = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyz');
            newDeletion.save(function(err,deletion){
                if(err){
                    throw err;
                }
                let url = 'https://scorpionclothing/deletion/' + String(deletion.identifier);
                let confirmation_code = String(deletion.identifier);
                res.send({ 'url': url, 'confirmation_code': confirmation_code });
            })
        }
	});
});

router.get("/deletion/:identifier", function(req, res){
    DataDeletionsHistory.find({"identifier" : req.params.identifier }, function(err,foundDeletion){
        if(err){
            res.redirect('back');
        }
        if(foundDeletion != null){
            res.render('dataDeletion',{ deletion: foundDeletion[0] });
        }else{
            res.redirect('back');
        }
    })
})

      
module.exports = router;