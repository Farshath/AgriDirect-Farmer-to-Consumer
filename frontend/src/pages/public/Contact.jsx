import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your message has been sent to our agri-support team! We will reply within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Direct Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174D32]">
          We’d Love to Hear From You
        </h1>
        <p className="text-sm text-[#4A5B50] leading-relaxed">
          Questions about farm verification, bulk ordering for restaurants, or crop quality? Reach out to our Pune hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#174D32]">Hub & Support Centers</h3>

            <div className="space-y-4 text-xs text-[#4A5B50]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F6F2] text-[#174D32] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#63A66B]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#174D32]">Headquarters</h4>
                  <p>AgriDirect Innovation Center, Shivaji Nagar, Pune, Maharashtra 411005</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F6F2] text-[#174D32] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#63A66B]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#174D32]">Toll-Free Helpline</h4>
                  <p>1800-200-4567 (Mon-Sat, 7am - 8pm)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F6F2] text-[#174D32] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#63A66B]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#174D32]">Email Correspondence</h4>
                  <p>support@agrimarket.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#174D32] text-white p-6 rounded-3xl space-y-2">
            <h4 className="font-bold text-sm text-[#E5B64B]">Farmer Emergency Helpline</h4>
            <p className="text-xs text-[#BAD5C1] leading-relaxed">
              Are you an enrolled farmer experiencing pickup delays or logistics issues? Call our field dispatch desk directly at +91 98220 01122.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#BAD5C1]/50 shadow-xs">
          <h3 className="text-xl font-bold text-[#174D32] mb-6">Send Us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anand Kulkarni"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="anand@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Inquiry regarding farm bulk orders or verification"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1.5">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we assist you today?..."
                className="w-full p-3.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={Send}
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

