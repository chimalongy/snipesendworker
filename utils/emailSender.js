import nodemailer from 'nodemailer';

export async function sendEmail(email, smtpConfig, senderName, newTaskBody, taskSubject) {
  console.log("Sending to: " + email + "\nFrom: " + smtpConfig.auth.user);

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.auth.user,
      pass: smtpConfig.auth.pass
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"${senderName}" <${smtpConfig.auth.user}>`, // ✅ Correctly formatted
      to: email,
      subject: taskSubject,
      text: newTaskBody
    });

    console.log(`✅ Email sent to ${email}, Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
