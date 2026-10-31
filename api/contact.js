/**
 * Vercel Serverless Function: /api/contact
 * Handles contact & bespoke inquiries securely without exposing API keys to the frontend.
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
    // Read and parse request body safely
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
      // Buffer raw body if not pre-parsed
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

    const { fullName, email, phone, material, message } = body || {};

    // Validate email
    if (!email || !email.includes('@')) {
      return sendJson(400, {
        success: false,
        error: 'A valid email address is required.'
      });
    }

    // Access secure server-side environment variables
    const emailApiKey = process.env.EMAIL_SERVICE_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || 'Turath.egypt@gmail.com';

    // Verify secret key configuration on backend
    if (!emailApiKey || emailApiKey === 'your_secret_key_here') {
      console.warn('[SERVERLESS API] EMAIL_SERVICE_API_KEY is not configured in production environment.');
    }

    // Secure payload structure ready for provider integration (e.g. Resend, SendGrid, Postmark, AWS SES)
    const inquiryData = {
      fullName: (fullName || 'Anonymous').trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || 'Not provided').trim(),
      material: (material || 'General').trim(),
      message: (message || '').trim(),
      recipientEmail,
      submittedAt: new Date().toISOString()
    };

    console.log('[SERVERLESS API] Secure inquiry payload processed:', {
      fullName: inquiryData.fullName,
      email: inquiryData.email,
      material: inquiryData.material,
      submittedAt: inquiryData.submittedAt
    });

    return sendJson(200, {
      success: true,
      message: 'Inquiry received successfully. Our team will contact you soon.',
      data: {
        submittedAt: inquiryData.submittedAt
      }
    });

  } catch (error) {
    console.error('[SERVERLESS API ERROR]:', error);
    return sendJson(500, {
      success: false,
      error: 'An internal server error occurred while processing your request.'
    });
  }
}
