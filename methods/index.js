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
                        helperFunctions.main(customer.name, customer.phone, customer.email, customer.address, customer.oven, customer.notes).catch(console.error);
                        const updatedCustomer = {
                          chaseDate: moment().add(10, 'days').calendar()
                          // chaseDate: moment().format('L')
                      }
                          Customer.findByIdAndUpdate(customer._id, updatedCustomer, (err, updatedCustomer) => {
                            if(err) {
                              console.log(err);
                            } else {
                              console.log("Unable to update record");
                          }
                      });
                    }
                });
            }
        });
    
    },

    // async..await is not allowed in global scope, must use a wrapper
    async  main(name, phone, email, add, oven, notes) {
    
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "blackhawkoc1@gmail.com",
            pass: "blackOVEN@12"
        }
    });
    
    const mailOptions = {
        from: "wconstable@britishmuseum.org",
        to: "will_constable@msn.com",
        subject: "Testing",
        html: `<p>${name}</p>
                <p>${phone}</p>
                <p>${email}</p>
                <p>${add}</p>
                <p>${oven}</p>
                <p>${notes}</p>
        `
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
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

    j: schedule.scheduleJob({minute: 53}, function(){
        console.log('email sent');
        helperFunctions.sendReminder();
      })
}

module.exports = helperFunctions;