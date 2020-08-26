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
                        helperFunctions.main(customer.name,customer.code, customer.phone, customer.email, customer.address, customer.oven, customer.notes).catch(console.error);
                        //Once email has been sent, update cutomer chase date
                        const newDate = moment().add(1, 'days');
                        const formatted = moment(newDate).format("L");
                        const updatedCustomer = {
                          // chaseDate: moment().add(180, 'days').calendar()
                          // chaseDate: moment().format('L')
                          chaseDate: formatted
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
    async  main(name, code, phone, email, add, oven, notes) {
    
    //Email configurtion
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        }
    });
    
    const mailOptions = {
        from: "blackhawkoc1@gmail.com",
        to: "enquiries@blackhawkovencleaning.co.uk",
        subject: "Client Chase Reminder",
        html: ` <p>The following client is due to be contacted:</p>
                <p>Name: ${name}</p>
                <p>Country Code: ${code}</p>
                <p>Phone: ${phone}</p>
                <p>Email: ${email}</p>
                <p>Address: ${add}</p>
                <p>Oven Type: ${oven}</p>
                <p>Notes: ${notes}</p>
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
const to = `${details.code}${details.phone}`;
const text = `Hi, we have booked your job in with the following details. Please let us know if anything needs changing.
Name: ${details.name}
Email: ${details.email}
Address: ${details.address}
Oven Type: ${details.oven}
Price: ${details.price}
Time of booking: ${details.time}
Date of booking: ${details.date}`;

nexmo.message.sendSms(from, to, text);
  },

}

module.exports = helperFunctions;