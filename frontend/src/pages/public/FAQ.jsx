import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How fresh is the produce when delivered?',
      a: 'Unlike supermarkets where produce spends 5 to 10 days in refrigerated trucks and wholesale mandis, AgriDirect items are harvested specifically after your order is confirmed. In most cases, crops arrive at your door within 24 hours of being picked.',
    },
    {
      q: 'How does AgriDirect verify that a farmer is truly organic?',
      a: 'We require valid documentation such as APEDA certification, Participatory Guarantee System (PGS) records, or government soil health cards. Our field verification officers also inspect land records before an account is approved to publish live products.',
    },
    {
      q: 'What payment options do you support?',
      a: 'We currently support Cash on Delivery (COD) as our primary method so you can physically inspect the freshness of your harvest before paying. Online UPI and Card payment modules are architected and will be integrated soon.',
    },
    {
      q: 'What is the delivery fee structure?',
      a: 'Orders of ₹500 and above qualify for completely free delivery! For smaller orders below ₹500, a nominal delivery convenience fee of ₹40 is applied to cover eco-friendly transport packaging.',
    },
    {
      q: 'Can I track my order status in real time?',
      a: 'Yes! Once you place an order, you can visit "My Orders" or click "Track Order" to view real-time status transitions: Pending -> Confirmed -> Processing -> Ready for Delivery -> Shipped -> Delivered.',
    },
    {
      q: 'How do farmers receive their earnings?',
      a: 'Farmers receive the complete price listed on the marketplace. Upon delivery confirmation, earnings are credited to the farmer profile dashboard and disbursed directly to their registered bank account on a transparent weekly schedule.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Common Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174D32]">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#4A5B50] max-w-lg mx-auto leading-relaxed">
          Everything you need to know about purchasing directly from local farmers and agricultural standards.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#174D32] hover:bg-[#F0F6F2] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#63A66B] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs text-[#4A5B50] leading-relaxed border-t border-[#BAD5C1]/20">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions */}
      <div className="p-6 rounded-3xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-center space-y-3">
        <h3 className="font-bold text-base text-[#174D32]">Still have questions?</h3>
        <p className="text-xs text-[#4A5B50]">
          Our agricultural support team and agronomists are available to assist you.
        </p>
        <Link to="/contact">
          <Button variant="primary" size="sm">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FAQ;

