const moment = require("moment");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const Customer = require("../models/customer");
const Nexmo = require("nexmo");

//Create helper function object
const helperFunctions = {
    //Send reminder function
    sendReminder(){
        //Find customer
        Customer.find((err, customers) => {
            if(err) {
                console.log(err);
            } else {
                //Loop through each customer and compare chase date with todays date
                customers.forEach(customer => {
                    //Set current date
                    let current = moment().format('L');
                    //If chase date matches current date send email reminder to chase
                    if(customer.chaseDate === current) {
                        helperFunctions.main(customer.name, customer.phone, customer.email, customer.address, customer.oven, customer.notes).catch(console.error);
                        //Once email has been sent, update cutomer chase date
                        const updatedCustomer = {
                          chaseDate: moment().add(180, 'days').calendar()
                          // chaseDate: moment().format('L')
                      }
                          Customer.findByIdAndUpdate(customer._id, updatedCustomer, (err, updatedCustomer) => {
                            if(err) {
                              console.log(err);
                            } else {
                              console.log("Record updated");
                          }
                      });
                    }
                });
            }
        });
    
    },

    //Method to send email
    // async..await is not allowed in global scope, must use a wrapper
    async  main(name, phone, email, add, oven, notes) {
    
    //Email configurtion
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        }
    });
    
    const mailOptions = {
        from: "wconstable@britishmuseum.org",
        to: "will_constable@msn.com",
        subject: "Client Chase Reminder",
        html: ` <p>The following client is due to be contacted:</p>
                <p>${name}</p>
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

  //Method to send SMS message
  sendSMS(details) {

const nexmo = new Nexmo({
  apiKey: process.env.SMSAPI,
  apiSecret: process.env.SMSSECRET,
});

const from = 'Blackhawk';
const to = '447970058852';
const text = `Hi, you have been added to Blackhawk Oven Cleanings database. Please check your details below and let us know if anything needs updating. /n
Name: ${details.name}
Email: ${details.email}
Address: ${details.address}
Oven Type: ${details.oven}`;

nexmo.message.sendSms(from, to, text);
  },

}

module.exports = helperFunctions;