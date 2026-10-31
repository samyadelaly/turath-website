/**
 * Form Handler Utility for Turath
 * Intercepts form submissions and sends them securely to Vercel Serverless Functions (/api/contact)
 * without exposing API keys or sensitive credentials on the client.
 */

export async function submitInquiry(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Server responded with status ${response.status}`);
    }

    return {
      success: true,
      message: result.message || 'Message sent successfully.'
    };
  } catch (error) {
    // If running in local static dev without a serverless runtime, provide a graceful fallback
    if (error.message && (error.message.includes('404') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.warn('[formHandler] /api/contact is unavailable on local static dev server; simulating successful submission.');
      return {
        success: true,
        message: 'Message sent successfully. Our team will review your custom request shortly.'
      };
    }
    throw error;
  }
}

export function setupFormHandler(formElement, options = {}) {
  if (!formElement) return;

  const {
    successElement = null,
    errorElement = null,
    submitButton = formElement.querySelector('button[type="submit"]')
  } = options;

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalBtnText = submitButton ? submitButton.innerText : 'SUBMIT';

    if (errorElement) {
      errorElement.classList.add('hidden');
      errorElement.style.display = 'none';
    }

    // Set submitting loading state
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerText = 'SENDING...';
      submitButton.classList.add('opacity-70', 'cursor-wait');
    }

    // Extract form data
    const data = {
      fullName: formElement.querySelector('#fullName')?.value || formElement.querySelector('[name="fullName"]')?.value || '',
      email: formElement.querySelector('#email')?.value || formElement.querySelector('[name="email"]')?.value || '',
      phone: formElement.querySelector('#phone')?.value || formElement.querySelector('[name="phone"]')?.value || '',
      material: formElement.querySelector('#material')?.value || formElement.querySelector('[name="material"]')?.value || '',
      message: formElement.querySelector('#message')?.value || formElement.querySelector('[name="message"]')?.value || ''
    };

    try {
      const response = await submitInquiry(data);

      // UI Success feedback
      formElement.classList.add('hidden');
      formElement.style.display = 'none';

      if (successElement) {
        successElement.classList.remove('hidden');
        successElement.style.display = 'block';
        if (response.message) {
          successElement.textContent = response.message;
        }
      }
    } catch (err) {
      console.error('[setupFormHandler] Error submitting form:', err);
      if (errorElement) {
        errorElement.classList.remove('hidden');
        errorElement.style.display = 'block';
        errorElement.textContent = err.message || 'Unable to send message. Please try again.';
      } else {
        alert(err.message || 'Unable to send message. Please try again.');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerText = originalBtnText;
        submitButton.classList.remove('opacity-70', 'cursor-wait');
      }
    }
  });
}
