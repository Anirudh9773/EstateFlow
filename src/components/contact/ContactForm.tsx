'use client';

import { useState, FormEvent } from 'react';
import { User, Building2, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContactFormProps {
  userRole: 'client' | 'agent';
  setUserRole: (role: 'client' | 'agent') => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  agencyName: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm({ userRole, setUserRole }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    postcode: '',
    agencyName: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const clientSubjects = [
    'I want to submit a property',
    'I need help finding an agent',
    'I have a question about the platform',
    'Other',
  ];

  const agentSubjects = [
    'I want to join as an agent',
    'I have a question about pricing',
    'I need help with my account',
    'I want to report an issue',
    'Other',
  ];

  const subjects = userRole === 'client' ? clientSubjects : agentSubjects;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (userRole === 'client' && !formData.postcode.trim()) {
      newErrors.postcode = 'Please enter your postcode';
    }

    if (userRole === 'agent') {
      if (!formData.agencyName.trim()) {
        newErrors.agencyName = 'Please enter your agency name';
      }
      if (!formData.postcode.trim()) {
        newErrors.postcode = 'Please enter your coverage postcode area';
      }
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please enter at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        postcode: '',
        agencyName: '',
        subject: '',
        message: '',
      });
    }, 5000);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (role: 'client' | 'agent') => {
    setUserRole(role);
    // Reset form when switching roles
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      postcode: '',
      agencyName: '',
      subject: '',
      message: '',
    });
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 border border-gold/20 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-white mb-3">
            Thanks {formData.fullName.split(' ')[0]}!
          </h3>
          <p className="text-text-secondary text-base">
            We&apos;ve received your message and will get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl p-5 sm:p-8">
      {/* Role Selector */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2.5">Who are you contacting us as?</p>
        <div className="inline-flex bg-[#14141E] border border-white/10 rounded-xl p-1 w-full sm:w-auto">
          <Button
            type="button"
            variant={userRole === 'client' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleRoleChange('client')}
            className={`gap-2 flex-1 sm:flex-initial rounded-lg cursor-pointer transition-all ${userRole === 'client' ? 'bg-gold text-[#0d0d14] font-bold shadow-md hover:bg-gold/90' : 'text-[#B8B5AE] hover:text-white hover:bg-white/5'}`}
          >
            <User className="w-4 h-4" />
            <span className="text-xs sm:text-sm">I&apos;m a Client</span>
          </Button>
          <Button
            type="button"
            variant={userRole === 'agent' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleRoleChange('agent')}
            className={`gap-2 flex-1 sm:flex-initial rounded-lg cursor-pointer transition-all ${userRole === 'agent' ? 'bg-gold text-[#0d0d14] font-bold shadow-md hover:bg-gold/90' : 'text-[#B8B5AE] hover:text-white hover:bg-white/5'}`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-xs sm:text-sm">I&apos;m an Agent</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`h-11 mt-1.5 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold rounded-xl ${errors.fullName ? 'border-red-400' : ''}`}
              placeholder={userRole === 'client' ? 'John Smith' : 'Jane Doe'}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`h-11 mt-1.5 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold rounded-xl ${errors.email ? 'border-red-400' : ''}`}
              placeholder={userRole === 'client' ? 'john@example.com' : 'jane@agency.co.uk'}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Row 2: Phone and Postcode (Client) OR Phone and Agency Name (Agent) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Phone Number {userRole === 'agent' && <span className="text-red-400">*</span>}
            </Label>
            <Input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="h-11 mt-1.5 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold rounded-xl"
              placeholder="07123 456789"
            />
          </div>

          {userRole === 'agent' ? (
            <div>
              <Label htmlFor="agencyName" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Agency Name <span className="text-red-400">*</span>
              </Label>
              <Input
                type="text"
                id="agencyName"
                value={formData.agencyName}
                onChange={(e) => handleChange('agencyName', e.target.value)}
                className={`h-11 mt-1.5 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold rounded-xl ${errors.agencyName ? 'border-red-400' : ''}`}
                placeholder="Your Estate Agency Ltd."
                aria-invalid={!!errors.agencyName}
              />
              {errors.agencyName && (
                <p className="mt-1 text-xs text-red-400">{errors.agencyName}</p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="postcode" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Postcode <span className="text-red-400">*</span>
              </Label>
              <Input
                type="text"
                id="postcode"
                value={formData.postcode}
                onChange={(e) => handleChange('postcode', e.target.value)}
                className={`h-11 mt-1.5 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold rounded-xl ${errors.postcode ? 'border-red-400' : ''}`}
                placeholder="SW1A 1AA"
                aria-invalid={!!errors.postcode}
              />
              {errors.postcode && (
                <p className="mt-1 text-xs text-red-400">{errors.postcode}</p>
              )}
            </div>
          )}
        </div>

        {/* Row 3: Subject (Client, full-width) OR Postcode and Subject (Agent, grid-cols-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userRole === 'agent' && (
            <div>
              <Label htmlFor="postcode" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Coverage Postcode Area <span className="text-red-400">*</span>
              </Label>
              <Input
                type="text"
                id="postcode"
                value={formData.postcode}
                onChange={(e) => handleChange('postcode', e.target.value)}
                className={`h-11 mt-1.5 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold rounded-xl ${errors.postcode ? 'border-red-400' : ''}`}
                placeholder="SW1, SW2, SW3"
                aria-invalid={!!errors.postcode}
              />
              {errors.postcode && (
                <p className="mt-1 text-xs text-red-400">{errors.postcode}</p>
              )}
            </div>
          )}

          <div className={userRole === 'agent' ? "" : "sm:col-span-2"}>
            <Label htmlFor="subject" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Subject <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value || '')}>
              <SelectTrigger className={`h-11 mt-1.5 bg-[#1E1E28] border-white/15 text-white focus:border-gold rounded-xl w-full ${errors.subject ? 'border-red-400' : ''}`}>
                <SelectValue placeholder="Select a subject..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E28] border-white/15 text-white">
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
            )}
          </div>
        </div>

        {/* Row 4: Message */}
        <div>
          <Label htmlFor="message" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Message <span className="text-red-400">*</span>
          </Label>
          <Textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={`mt-1.5 resize-none bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold rounded-xl ${errors.message ? 'border-red-400' : ''}`}
            placeholder={
              userRole === 'client'
                ? 'Tell us about your property or what you need help with...'
                : 'Tell us about your agency and how we can help...'
            }
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-400">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 gap-2 bg-gold hover:bg-gold/90 text-[#0d0d14] font-bold rounded-xl shadow-lg cursor-pointer transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0d0d14] border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
