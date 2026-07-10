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
    description: 'Mon–Fri, 9am–6pm GMT',
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
  return (
    <div className="space-y-3 sm:space-y-4">
      {contactInfo.map((info, index) => {
        const Icon = info.icon;
        const content = (
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  {info.title}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-slate-900 mb-0.5 break-words">
                  {info.value}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600">{info.description}</p>
                {info.subDescription && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{info.subDescription}</p>
                )}
              </div>
            </div>
          </CardContent>
        );

        if (info.href) {
          return (
            <a key={index} href={info.href} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                {content}
              </Card>
            </a>
          );
        }

        return (
          <Card key={index}>
            {content}
          </Card>
        );
      })}
    </div>
  );
}
