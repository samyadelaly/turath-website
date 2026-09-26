import React, { useState, useEffect } from 'react';
import { InquiryFormData } from './types';
import { SiteContent, getStoredSiteContent, sanitizeFacebookUrl, sanitizeInstagramUrl } from './siteContentStorage';
import { trackContact } from './metaPixel';
import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  MessageCircle,
  Facebook,
  Instagram 
} from 'lucide-react';

interface ContactSectionProps {
  initialData?: Partial<InquiryFormData>;
  content?: SiteContent;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialData, content }) => {
  const activeContent = content || getStoredSiteContent();
  const contact = activeContent.contact;

  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    mobile: '',
    email: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [lastSubmission, setLastSubmission] = useState<InquiryFormData | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        notes: initialData.notes || prev.notes,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLastSubmission(formData);
    setSubmitted(true);

    trackContact({
      method: 'email_form',
      productName: formData.productName || 'Architectural Brass & Copper Consultation',
      category: formData.productCategory || 'Custom Inquiry',
    });

    const subject = encodeURIComponent(`Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Full Name: ${formData.name}\n` +
      `Mobile Number: ${formData.mobile}\n` +
      `Email Address: ${formData.email}\n` +
      (formData.productName ? `Inquired Item: ${formData.productName} (${formData.productCategory || ''})\n` : '') +
      `\nProject Notes & Requirements:\n${formData.notes}\n\n` +
      `--\nSent via Turath Handcrafted Brass Website`
    );

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  const getWhatsAppLink = () => {
    const cleanNumber = contact.whatsapp.replace(/[^0-9]/g, '');
    if (!lastSubmission) return `https://wa.me/${cleanNumber}`;
    const text = encodeURIComponent(
      `Hello Turath Egypt,\n\nI just submitted an inquiry on your website:\n` +
      `*Name:* ${lastSubmission.name}\n` +
      `*Mobile:* ${lastSubmission.mobile}\n` +
      `*Email:* ${lastSubmission.email}\n` +
      (lastSubmission.productName ? `*Piece:* ${lastSubmission.productName}\n` : '') +
      `*Notes:* ${lastSubmission.notes}`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  return (
    <section id="contact-section" className="pt-10 sm:pt-14 lg:pt-16 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-[#000000]">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6]">
            {contact.title}
          </h2>

          <p className="text-sm sm:text-base text-[#d4c59d]">
            {contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#000000] border-2 border-[#d4c59d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4c59d] font-bold">
                  Egyptian Workshop & Showroom
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#f5f0e6] mb-1">
                  Turath
                </h3>
                <p className="text-xs text-[#d4c59d] uppercase tracking-wider font-semibold">
                  Crafting Timeless Brass Excellence from Egypt.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4 pt-2 border-t border-[#d4c59d]/20 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#9e9174] block uppercase font-bold tracking-wider">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-[#f5f0e6] hover:text-[#d4c59d] transition-colors font-medium"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#9e9174] block uppercase font-bold tracking-wider">
                      Mobile Number
                    </span>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                      className="text-[#f5f0e6] hover:text-[#d4c59d] transition-colors font-medium tracking-wide"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#9e9174] block uppercase font-bold tracking-wider">
                      Workshop & Studio
                    </span>
                    <p className="text-[#f5f0e6]">
                      {contact.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#9e9174] block uppercase font-bold tracking-wider">
                      Artisan Working Hours
                    </span>
                    <p className="text-[#f5f0e6]">
                      {contact.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Connect in solid color with NO border frame */}
              <div className="pt-2 border-t border-[#d4c59d]/20 space-y-2.5">
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Turath%20Egypt%2C%20I%20would%20like%20to%20inquire%20about%20your%20brass%20products`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Chat ({contact.whatsapp})</span>
                </a>

                {/* Facebook & Instagram buttons with identical gold brass styling */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={sanitizeFacebookUrl(contact.facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow"
                    title="Facebook - Turath Egypt"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={sanitizeInstagramUrl(contact.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow"
                    title="Instagram - Turath Egypt"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#000000] border-2 border-[#d4c59d] rounded-2xl p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="py-8 text-center space-y-6 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#d4c59d] text-[#000000] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="font-serif-luxury text-2xl font-bold text-[#f5f0e6]">
                      Inquiry Ready to Dispatch
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9e9174] leading-relaxed">
                      Thank you, <strong className="text-[#f5f0e6]">{lastSubmission?.name}</strong>. Your inquiry has been prepared for <strong className="text-[#d4c59d]">turath.egypt@gmail.com</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#000000] border border-[#d4c59d]/40 max-w-md mx-auto text-xs text-left space-y-1.5 text-[#d4c59d]">
                    <div><strong className="text-[#f5f0e6]">Name:</strong> {lastSubmission?.name}</div>
                    <div><strong className="text-[#f5f0e6]">Mobile:</strong> {lastSubmission?.mobile}</div>
                    <div><strong className="text-[#f5f0e6]">Email:</strong> {lastSubmission?.email}</div>
                    <div><strong className="text-[#f5f0e6]">Notes:</strong> {lastSubmission?.notes}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackContact({
                          method: 'whatsapp',
                          productName: lastSubmission?.productName || 'Architectural Brass & Copper Consultation',
                          category: lastSubmission?.productCategory || 'Custom Inquiry',
                        });
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Forward via WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-[#d4c59d]/30 pb-4 mb-2">
                    <h3 className="font-serif-luxury text-xl font-bold text-[#f5f0e6]">
                      Direct Inquiry Form
                    </h3>
                    <p className="text-xs text-[#9e9174]">
                      Please fill out the form below. Clicking send will open your email to dispatch directly to <strong className="text-[#d4c59d]">turath.egypt@gmail.com</strong>.
                    </p>
                  </div>

                  {formData.productName && (
                    <div className="p-3 rounded-lg bg-[#000000] border border-[#d4c59d] text-xs text-[#d4c59d] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#f5f0e6] block">Selected Piece for Inquiry:</span>
                        <span>{formData.productName} ({formData.productCategory})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, productName: undefined, productCategory: undefined })}
                        className="px-2 py-1 text-[10px] uppercase font-bold bg-[#d4c59d] text-[#000000] rounded"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tariq Al-Mansoor / Sarah Jenkins"
                      className="w-full bg-[#000000] text-[#f5f0e6] border border-[#d4c59d]/50 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#d4c59d] placeholder-[#666]"
                    />
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                        Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="+20 101 677 1010"
                        className="w-full bg-[#000000] text-[#f5f0e6] border border-[#d4c59d]/50 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#d4c59d] placeholder-[#666]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full bg-[#000000] text-[#f5f0e6] border border-[#d4c59d]/50 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#d4c59d] placeholder-[#666]"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                      Notes / Project Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Please specify dimensions, quantity, finishes (antique, polished gold, patina), or custom drawing description..."
                      className="w-full bg-[#000000] text-[#f5f0e6] border border-[#d4c59d]/50 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#d4c59d] placeholder-[#666]"
                    />
                  </div>

                  {/* Solid Logo Gold Submit button with NO border frame */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] active:scale-[0.99] transition-all shadow flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email to turath.egypt@gmail.com</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
