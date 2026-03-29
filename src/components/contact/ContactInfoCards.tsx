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
    <div className="space-y-4">
      {contactInfo.map((info, index) => {
        const Icon = info.icon;
        const content = (
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {info.title}
                </h3>
                <p className="text-lg font-semibold text-slate-900 mb-1 break-words">
                  {info.value}
                </p>
                <p className="text-sm text-slate-600">{info.description}</p>
                {info.subDescription && (
                  <p className="text-xs text-slate-500 mt-1">{info.subDescription}</p>
                )}
              </div>
            </div>
          </CardContent>
        );

        if (info.href) {
          return (
            <a key={index} href={info.href}>
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
