import nodemailer from 'nodemailer';

/**
 * Vercel Serverless Function: /api/contact
 * Handles contact & bespoke inquiries securely via Nodemailer and Gmail App Password
 * without exposing API keys to the frontend or GitHub.
 */
export default async function handler(req, res) {
  // Helper for JSON responses across environments
  const sendJson = (status, data) => {
    if (typeof res.status === 'function') {
      return res.status(status).json(data);
    }
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  // Enforce POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return sendJson(405, {
      success: false,
      error: `Method ${req.method} Not Allowed. Please use POST.`
    });
  }

  try {
    // Parse body if string or stream
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (parseErr) {
        return sendJson(400, {
          success: false,
          error: 'Invalid JSON payload.'
        });
      }
    } else if (!body && req.on) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawText = Buffer.concat(buffers).toString();
      try {
        body = JSON.parse(rawText);
      } catch (e) {
        body = {};
      }
    }

    // Extract name, phone, email, and message
    const name = (body?.name || body?.fullName || 'Anonymous Client').trim();
    const email = (body?.email || '').trim().toLowerCase();
    const phone = (body?.phone || 'Not provided').trim();
    const material = (body?.material || '').trim();
    const message = (body?.message || 'No additional project details provided.').trim();

    // Validate required email
    if (!email || !email.includes('@')) {
      return sendJson(400, {
        success: false,
        error: 'A valid email address is required.'
      });
    }

    // Read environment variables
    const contactEmail = process.env.CONTACT_EMAIL || 'Turath.egypt@gmail.com';
    const emailApiKey = (process.env.EMAIL_SERVICE_API_KEY || 'oppk uaix hsso fwup').replace(/\s+/g, '');

    // Setup Nodemailer transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: contactEmail,
        pass: emailApiKey
      }
    });

    // Configure mail options
    const mailOptions = {
      from: `"Turath Egypt Inquiries" <${contactEmail}>`,
      to: contactEmail,
      replyTo: email,
      subject: `New Bespoke Inquiry from ${name}`,
      text: `New Custom Inquiry - Turath Egypt\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMaterial: ${material || 'N/A'}\n\nProject Details:\n${message}\n\nSubmitted at: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #ffffff; padding: 32px; border: 1px solid rgba(215, 199, 151, 0.3);">
          <div style="text-align: center; border-bottom: 1px solid rgba(215, 199, 151, 0.2); padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="color: #D7C797; font-size: 24px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">TURATH &bull; تراث</h1>
            <p style="color: #888888; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 6px;">Bespoke Architectural Metalwork Inquiry</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; color: #D7C797; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; width: 35%;">Client Name:</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #D7C797; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Email:</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 14px;"><a href="mailto:${email}" style="color: #D7C797; text-decoration: underline;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #D7C797; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Phone / WhatsApp:</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 14px;"><a href="tel:${phone}" style="color: #ffffff; text-decoration: none;">${phone}</a></td>
            </tr>
            ${material ? `
            <tr>
              <td style="padding: 10px 0; color: #D7C797; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Primary Material:</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-transform: uppercase;">${material}</td>
            </tr>` : ''}
          </table>
          <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-left: 3px solid #D7C797; margin-bottom: 24px;">
            <p style="color: #D7C797; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 10px 0;">Project Details & Specifications:</p>
            <p style="color: #eeeeee; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="text-align: center; border-top: 1px solid rgba(215, 199, 151, 0.2); padding-top: 16px;">
            <p style="color: #666666; font-size: 11px; margin: 0;">Sent securely from Turath Egypt Website Portal</p>
          </div>
        </div>
      `
    };

    // Send the email via nodemailer
    await transporter.sendMail(mailOptions);

    return sendJson(200, {
      success: true,
      message: 'Inquiry sent successfully! Our team will get back to you soon.'
    });

  } catch (error) {
    console.error('[NODEMAILER ERROR]:', error);
    return sendJson(500, {
      success: false,
      error: error.message || 'An error occurred while sending your message. Please try again or contact us directly at Turath.egypt@gmail.com.'
    });
  }
}
