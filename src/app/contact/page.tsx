import { Metadata } from 'next';
import ContactPage from '@/components/contact/ContactPage';

export const metadata: Metadata = {
  title: 'Contact Us | EstateFlow - Get in Touch',
  description: 'Contact EstateFlow for property matching services, agent enquiries, or general support. We respond within 24 hours.',
};

export default function Contact() {
  return <ContactPage />;
}
