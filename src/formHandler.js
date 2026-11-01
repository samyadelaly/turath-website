/**
 * Form Handler Utility for Turath
 * Intercepts form submissions and sends them securely to Vercel Serverless Functions (/api/contact)
 * without exposing API keys or sensitive credentials on the client.
 */

export async function submitInquiry(formData) {
  const endpoint = '/api/contact';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API Error ${response.status}] Request to ${endpoint} failed:`, errorText);

    let parsedMessage = null;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed && (parsed.error || parsed.message)) {
        parsedMessage = parsed.error || parsed.message;
      }
    } catch (e) {
      // response was not JSON (e.g. 404 HTML page from Vite dev server)
    }

    if (parsedMessage) {
      throw new Error(parsedMessage);
    } else if (response.status === 404) {
      throw new Error('Serverless endpoint /api/contact returned 404 Not Found. If testing locally, ensure Vercel dev is active or backend middleware is enabled.');
    } else if (response.status === 500) {
      throw new Error('Server error (500) while sending inquiry. Please check mail credentials or try again later.');
    } else {
      throw new Error(`Server returned HTTP ${response.status}: ${errorText.slice(0, 150)}`);
    }
  }

  const result = await response.json().catch(() => ({}));

  if (!result.success) {
    throw new Error(result.error || 'Failed to submit inquiry.');
  }

  return {
    success: true,
    message: result.message || 'Inquiry sent successfully! Our team will get back to you soon.'
  };
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

    const originalBtnText = submitButton ? submitButton.innerText : 'SUBMIT INQUIRY';

    if (errorElement) {
      errorElement.classList.add('hidden');
      errorElement.classList.remove('active');
      errorElement.style.display = 'none';
    }
    if (successElement) {
      successElement.classList.add('hidden');
      successElement.classList.remove('active');
      successElement.style.display = 'none';
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

      if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.classList.remove('active');
        errorElement.style.display = 'none';
      }
      if (successElement) {
        successElement.classList.remove('hidden');
        successElement.classList.add('active');
        successElement.style.display = 'block';
        if (response.message) {
          successElement.textContent = response.message;
        }
      }
    } catch (err) {
      console.error('[setupFormHandler] Form submission failed:', err);

      // Reset button state and display error feedback
      if (submitButton) {
        submitButton.innerText = 'ERROR — TRY AGAIN';
        submitButton.classList.remove('cursor-wait');
        submitButton.classList.add('bg-rose-900/60');
        setTimeout(() => {
          if (submitButton.innerText === 'ERROR — TRY AGAIN') {
            submitButton.innerText = originalBtnText;
            submitButton.classList.remove('bg-rose-900/60');
          }
        }, 4000);
      }

      if (successElement) {
        successElement.classList.add('hidden');
        successElement.classList.remove('active');
        successElement.style.display = 'none';
      }
      if (errorElement) {
        errorElement.classList.remove('hidden');
        errorElement.classList.add('active');
        errorElement.style.display = 'block';
        errorElement.textContent = err.message || 'Unable to send inquiry. Please try again.';
      } else {
        alert(err.message || 'Unable to send inquiry. Please try again.');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-70', 'cursor-wait');
      }
    }
  });
}
