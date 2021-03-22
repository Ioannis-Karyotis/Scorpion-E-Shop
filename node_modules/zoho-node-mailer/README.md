####Zoho Node Mailer 


#####**Requirements**

1. Node.js v6 and above.


##### **Uses**

Step 1: Install zoho-node-mailer using below command

```bash
$ npm install zoho-node-mailer --save
```

Step 2: Setup your Zoho Transport, with your email and password.

```bash
const Emailer = require('zoho-node-mailer');

const credentials = {
    username: 'xyz@domain.com',
	password: 'password'
}
Emailer.UseZohoSMTPTransport(credentials)

var mailOptions = {
    from: 'xyz@domain.com',
    to: 'abc@gmail.com',
    subject: 'Hello, world',
    body: '<h1>This is body</h1>',
    bodyType: 'html'
};
var result = new Emailer.Email(mailOptions)

result.send(function(res){
    console.log(" response : ", res );
})
```