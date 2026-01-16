
import React, { useState } from 'react';

const faqs = [
  {
    q: "How accurate is the verification?",
    a: "Our model maintains a 98.4% success rate across benchmark datasets including FaceForensics++. However, we always provide a confidence level because digital analysis is probabilistic, not absolute."
  },
  {
    q: "Can this detection be wrong?",
    a: "Yes. Factors like low resolution, heavy compression, or poor lighting can introduce noise that affects analysis. This is why we provide a 'User Recommendation' to help you contextually verify sources."
  },
  {
    q: "What should I do if a result is uncertain?",
    a: "Uncertain results often occur with high-quality content or older low-fidelity video. We recommend cross-referencing with our Ground Truth engine or looking for official press releases from the subject."
  }
];

const FAQSection: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-20 animate-reveal" style={{ animationDelay: '2600ms' }}>
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Trust & Transparency</h3>
          <h2 className="text-3xl font-bold tracking-tight">Common Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`border rounded-2xl transition-all duration-300 ${active === idx ? 'bg-white/[0.02] border-white/10 shadow-lg' : 'border-white/5 hover:border-white/10'}`}
            >
              <button 
                onClick={() => setActive(active === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-semibold transition-colors ${active === idx ? 'text-white' : 'text-white/40'}`}>{faq.q}</span>
                <svg className={`w-4 h-4 transition-transform ${active === idx ? 'rotate-180 text-white' : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`accordion-content ${active === idx ? 'open' : ''}`}>
                <div className="accordion-inner px-6 pb-6 text-sm text-white/40 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
