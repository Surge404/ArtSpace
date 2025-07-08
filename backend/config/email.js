

// Real SMTP configuration for Brevo
// backend/config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // smtp-relay.brevo.com
  port: +process.env.SMTP_PORT,       // 587
  secure: false,                      // STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: { rejectUnauthorized: false }  // avoids self-signed cert issue on some networks
});


// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to ArtSpace!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to ArtSpace, ${name}!</h2>
        <p>Thank you for joining our creative community. Start exploring amazing gigs and connect with talented artists.</p>
        <a href="http://localhost:3000" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
      </div>
    `
  }),

  gigApplication: (data) => ({
    subject: `New Application for "${data.gigTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Gig Application</h2>
        <p>Hi ${data.clientName},</p>
        <p><strong>${data.artistName}</strong> has applied to your gig: <strong>"${data.gigTitle}"</strong></p>
        <p>Log in to your dashboard to review the application.</p>
        <a href="http://localhost:3000/dashboard" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Application</a>
      </div>
    `
  })
};

// Real email sending function
const sendEmail = async (to, templateName, templateData) => {
  try {
    const template = emailTemplates[templateName](templateData);
    
    const mailOptions = {
      from: 'tanmay.csemanit@gmail.com',
      to: to,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Real email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };
