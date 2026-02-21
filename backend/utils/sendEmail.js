import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1) Create a transporter
    // For free Gmail SMTP:
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS, // This should be an App Password, not your regular password
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: `Council Support <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html, // Optional: for HTML emails
    };

    // 3) Actually send the email
    console.log(`Attempting to send email to: ${options.email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
};

export default sendEmail;
