const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys.js');
sgMail.setApiKey(keys.SENDGRID_API_KEY);

module.exports = {
  send : (subject,msg,address)=>{
    const message = {
      to: address,
      from: 'FinancialAdvisor@SavingSalmon.com',
      subject: subject,
      text: msg,
      html: '<p>'+msg+'</p><br><p>Please do not reply to this email.</p>',
    };
    sgMail.send(message);
  }
}
