const moment = require("moment");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const Customer = require("../models/customer");
const Nexmo = require("nexmo");

const helperFunctions = {
    sendReminder(){
        Customer.find((err, customers) => {
            if(err) {
                console.log(err);
            } else {
                customers.forEach(customer => {
                    let current = moment().format('L');
                    if(customer.chaseDate === current) {
                        console.log(customer.name);
                        helperFunctions.main().catch(console.error);
                    }
                });
            }
        });
    
    },

    // async..await is not allowed in global scope, must use a wrapper
    async  main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      // auth: {
      //   user: testAccount.user, // generated ethereal user
      //   pass: testAccount.pass, // generated ethereal password
      // },
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Test" <test@testing.com>', // sender address
      to: "will_constable@msn.com", // list of receivers
      subject: "Testing", // Subject line
      text: "Just testing", // plain text body
      html: "<b>I hope you get this</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  },

  sendSMS() {
    const nexmo = new Nexmo({
        apiKey: '0256bab1',
        apiSecret: '4xvBkdjN6MCynbN2',
      });
      
      const from = 'Will';
      const to = '447970058852';
      const text = 'Testing';

      nexmo.message.sendSms(from, to, text);
  },

    j: schedule.scheduleJob({minute: 31}, function(){
        console.log('email sent');
        helperFunctions.sendReminder();
      })
}

module.exports = helperFunctions;