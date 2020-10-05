const moment = require("moment");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const Customer = require("../models/customer");
const Booking = require("../models/booking");
const Reminder = require("../models/reminder");
const Archive = require("../models/archive");
const Nexmo = require("nexmo");

//Create helper function object
const helperFunctions = {
    //Send reminder function
    sendReminder(){
        //Find customer in bookings
        Booking.find((err, bookings) => {
            if(err) {
                console.log(err);
            } else {
                //Loop through each customer and compare chase date with todays date
                bookings.forEach(booking => {
                    //Set current date
                    let current = moment().format('L');
                    //If chase date matches current date send email reminder to chase
                    if(booking.chaseDate === current) {
                        helperFunctions.main(booking.name, booking.code, booking.phone, booking.address, booking.type, booking.details).catch(console.error);
                        //Once email has been sent, update cutomer chase date
                        // const newDate = moment().add(1, 'days');
                        // const formatted = moment(newDate).format("L");
                        const updatedBooking = {
                          chaseDate: moment().add(180, 'days').calendar()
                          
                      }
                          Booking.findByIdAndUpdate(booking._id, updatedBooking, (err, updatedBooking) => {
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

        // //Find customer in customers
        // Customer.find((err, customers) => {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         //Loop through each customer and compare chase date with todays date
        //         customers.forEach(customer => {
        //             //Set current date
        //             let current = moment().format('L');
        //             //If chase date matches current date send email reminder to chase
        //             if(customer.chaseDate === current) {
        //                 helperFunctions.main(customer.name, customer.code, customer.phone, customer.address, "-", customer.details).catch(console.error);
        //                 //Once email has been sent, update cutomer chase date
        //                 // const newDate = moment().add(1, 'days');
        //                 // const formatted = moment(newDate).format("L");
        //                 const updatedBooking = {
        //                   chaseDate: moment().add(180, 'days').calendar()
                          
        //               }
        //                   Customer.findByIdAndUpdate(customer._id, updatedBooking, (err, updatedCustomer) => {
        //                     if(err) {
        //                       console.log(err);
        //                     } else {
        //                       console.log("Record updated");
        //                   }
        //               });
        //             }
        //         });
        //     }
        // });


        //Find customer in Archives
        Archive.find((err, archives) => {
            if(err) {
                console.log(err);
            } else {
                //Loop through each customer and compare chase date with todays date
                archives.forEach(archive => {
                    //Set current date
                    let current = moment().format('L');
                    //If chase date matches current date send email reminder to chase
                    if(archive.chaseDate === current) {
                        helperFunctions.main(archive.name, archive.code, archive.phone, archive.address, archive.type, archive.details).catch(console.error);
                        //Once email has been sent, update cutomer chase date
                        // const newDate = moment().add(1, 'days');
                        // const formatted = moment(newDate).format("L");
                        const updatedBooking = {
                          chaseDate: moment().add(180, 'days').calendar()
                          
                      }
                          Archive.findByIdAndUpdate(archive._id, updatedBooking, (err, updatedArchive) => {
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

    //Send job reminder function
    sendJobReminder(){
      //Find customer
      Booking.find((err, bookings) => {
          if(err) {
              console.log(err);
          } else {
              //Loop through each customer and compare chase date with todays date
              bookings.forEach(booking => {
                  //Set current date
                  let current = moment().format('L');
                  //If chase date matches current date send email reminder to chase
                  if(booking.reminderDate === current) {
                    helperFunctions.reminderEmail(booking.name, booking.code, booking.phone, booking.address, booking.post, booking.type, booking.date, booking.time, booking.tech, booking.email, booking.details).catch(console.error);
                    //Add reminder to database
                    helperFunctions.addReminder(booking.name, booking.code, booking.phone, booking.address, booking.post, booking.type, booking.price, booking.time, booking.date, booking.tech, booking.color, booking.email, booking.details, booking.dateAdded, booking.chaseDate, booking.reminderDate);
                      const updatedBooking = {
                        reminderDate: null
                        
                    }
                        Booking.findByIdAndUpdate(booking._id, updatedBooking, (err, updatedBooking) => {
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

    //Method to send chase email
    // async..await is not allowed in global scope, must use a wrapper
    async  main(name, code, phone, add, post, type, details) {
    
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
                <p>Address: ${add}</p>
                <p>Post Code: ${post}</p>
                <p>Job Type: ${type}</p>
                <p>Job Details: ${details}</p>
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

  //Method to send job reminder email
  //Method to send chase email
    // async..await is not allowed in global scope, must use a wrapper
    async reminderEmail(name, code, phone, add, post, type, date, time, tech, email, details) {
    
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
        to: email === "" ? "enquiries@blackhawkovencleaning.co.uk" : email,
        subject: "You have an upcoming job",
        html: ` <p>The following job is due in the next 48 hours:</p>
                <p>Name: ${name}</p>
                <p>Country Code: ${code}</p>
                <p>Phone: ${phone}</p>
                <p>Address: ${add}</p>
                <p>Post Code: ${post}</p>
                <p>Job Type: ${type}</p>
                <p>Date: ${date}</p>
                <p>Time: ${time}</p>
                <p>Technician Assigned: ${tech}</p>
                <p>Job Details: ${details}</p>
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

  //Method to send booking SMS message
  sendSMS(details) {

const nexmo = new Nexmo({
  apiKey: process.env.SMSAPI,
  apiSecret: process.env.SMSSECRET,
});

const from = 'Blackhawk';
const to = `${details.code}${details.phone}`;
const text = `Thank you for using Blackhawk Oven Cleaning and Property Services, the details of your booking are below
Name: ${details.name}
Address: ${details.address}
Post Code: ${details.post}
Oven Type: ${details.type}
Price: £${details.price}
Time of booking: ${details.time}
Date of booking: ${details.date}
Kind regards`;

nexmo.message.sendSms(from, to, text);
  },

  //Method to send added to database SMS message
  sendCustomerSMS(details) {

    const nexmo = new Nexmo({
      apiKey: process.env.SMSAPI,
      apiSecret: process.env.SMSSECRET,
    });
    
    const from = 'Blackhawk';
    const to = `${details.code}${details.phone}`;
    const text = `Blackhawk Oven Cleaning are please to inform you that you are now registered in our database and we will remind you every six months for your oven cleaning. We have obtained your details as you have previously cleaned your oven through us.

Please ensure all your details are correct. If you need to update them please call us on 0345 257 8322 or email us at enquiries@blackhawkovencleaning.co.uk

Name: ${details.name}
Address: ${details.address}
Post Code ${details.post}
Phone: 0${details.phone}
    
Kind regards`;
    
    nexmo.message.sendSms(from, to, text);
      },

//Method to add reminder to database
addReminder(name, code, phone, add, post, type, price, time, date, tech, color, email, details, added, chase, reminder) {
  //CREATE NEW REMINDER
  //Create new reminder object
  let newReminder = {
      name: name,
      code: code,
      phone: phone,
      address: add,
      post: post,
      type: type,
      price: price,
      time: time,
      date: date,
      tech: tech,
      color: color,
      email: email,
      details: details,
      dateAdded: added,
      chaseDate: chase,
      reminderDate: reminder
      // chaseDate: "08/12/2020"
      // chaseDate: moment().format('L')
  }

  //Create new database entry
  Reminder.create(newReminder, (err, newlyCreatedReminder) => {
      if(err) {
          console.log(err);
      } else {
          console.log(newlyCreatedReminder);
      }
  });
},

//Method to add archive to database
addArchive(name, code, phone, add, post, type, price, time, date, tech, color, email, details, added, chase, reminder) {
    //CREATE NEW ARCHIVE
    //Create new archive object
    let newArchive = {
        name: name,
        code: code,
        phone: phone,
        address: add,
        post: post,
        type: type,
        price: price,
        time: time,
        date: date,
        tech: tech,
        color: color,
        email: email,
        details: details,
        dateAdded: added,
        chaseDate: chase,
        reminderDate: reminder
        // chaseDate: "08/12/2020"
        // chaseDate: moment().format('L')
    }
  
    //Create new database entry
    Archive.create(newArchive, (err, newlyCreatedArchive) => {
        if(err) {
            console.log(err);
        } else {
            console.log(newlyCreatedArchive);
        }
    });
  }

}

module.exports = helperFunctions;