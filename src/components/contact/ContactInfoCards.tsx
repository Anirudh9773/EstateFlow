import { useState, useEffect } from 'react';
import { Mail, Lock, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'hello@estateflow.co.uk',
    description: 'For general enquiries',
    href: 'mailto:hello@estateflow.co.uk',
  },
  {
    icon: Lock,
    title: 'Privacy & Legal',
    value: 'privacy@estateflow.co.uk',
    description: 'For data & legal matters',
    href: 'mailto:privacy@estateflow.co.uk',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '0800 123 4567',
    description: 'Mon–Fri, 9am–6pm GMT', // fallback
    href: 'tel:08001234567',
  },
  {
    icon: MapPin,
    title: 'Our Office',
    value: 'EstateFlow Ltd.',
    description: 'London, United Kingdom',
    subDescription: 'Serving 48 cities across the UK',
  },
];

export default function ContactInfoCards() {
  const [timezone, setTimezone] = useState('GMT');

  useEffect(() => {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        timeZoneName: 'short'
      }).formatToParts(new Date());
      const tzPart = parts.find(part => part.type === 'timeZoneName');
      if (tzPart) {
        setTimezone(tzPart.value);
      }
    } catch (e) {
      setTimezone('GMT/BST');
    }
  }, []);

  return (
    <div className="space-y-3 sm:space-y-4">
      {contactInfo.map((info, index) => {
        const Icon = info.icon;
        const displayDescription = info.title === 'Call Us' 
          ? `Mon–Fri, 9am–6pm ${timezone}` 
          : info.description;

        const content = (
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 h-5 text-gold" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[10px] font-bold text-gold uppercase tracking-wider mb-0.5">
                  {info.title}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-white mb-0.5 break-words">
                  {info.value}
                </p>
                <p className="text-[11px] sm:text-xs text-[#B8B5AE]">{displayDescription}</p>
                {info.subDescription && (
                  <p className="text-[10px] text-text-muted mt-0.5">{info.subDescription}</p>
                )}
              </div>
            </div>
          </CardContent>
        );

        if (info.href) {
          return (
            <a key={index} href={info.href} className="block group">
              <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl hover:border-gold/40 transition-all cursor-pointer">
                {content}
              </Card>
            </a>
          );
        }

        return (
          <Card key={index} className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl">
            {content}
          </Card>
        );
      })}
    </div>
  );
}
