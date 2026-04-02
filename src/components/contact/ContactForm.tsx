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
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Thanks {formData.fullName.split(' ')[0]}!
          </h3>
          <p className="text-slate-600 text-lg">
            We've received your message and will get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Role Selector */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <p className="text-xs md:text-sm font-medium text-slate-700 mb-3">Who are you contacting us as?</p>
        <div className="inline-flex bg-slate-100 rounded-lg p-1 w-full sm:w-auto">
          <Button
            type="button"
            variant={userRole === 'client' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleRoleChange('client')}
            className={`gap-2 flex-1 sm:flex-initial ${userRole === 'client' ? 'bg-white text-slate-900 shadow-sm hover:bg-white' : ''}`}
          >
            <User className="w-4 h-4" />
            <span className="text-xs sm:text-sm">I'm a Client</span>
          </Button>
          <Button
            type="button"
            variant={userRole === 'agent' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleRoleChange('agent')}
            className={`gap-2 flex-1 sm:flex-initial ${userRole === 'agent' ? 'bg-white text-slate-900 shadow-sm hover:bg-white' : ''}`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-xs sm:text-sm">I'm an Agent</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={`mt-2 ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder={userRole === 'client' ? 'John Smith' : 'Jane Doe'}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Agency Name (Agents only) */}
        {userRole === 'agent' && (
          <div>
            <Label htmlFor="agencyName">
              Agency Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="agencyName"
              value={formData.agencyName}
              onChange={(e) => handleChange('agencyName', e.target.value)}
              className={`mt-2 ${errors.agencyName ? 'border-red-500' : ''}`}
              placeholder="Your Estate Agency Ltd."
              aria-invalid={!!errors.agencyName}
            />
            {errors.agencyName && (
              <p className="mt-1 text-sm text-red-600">{errors.agencyName}</p>
            )}
          </div>
        )}

        {/* Email and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div>
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
              placeholder={userRole === 'client' ? 'john@example.com' : 'jane@agency.co.uk'}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">
              Phone Number {userRole === 'agent' && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="mt-2"
              placeholder="07123 456789"
            />
          </div>
        </div>

        {/* Postcode */}
        <div>
          <Label htmlFor="postcode">
            {userRole === 'client' ? 'Postcode' : 'Coverage Postcode Area'}{' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="postcode"
            value={formData.postcode}
            onChange={(e) => handleChange('postcode', e.target.value)}
            className={`mt-2 ${errors.postcode ? 'border-red-500' : ''}`}
            placeholder={userRole === 'client' ? 'SW1A 1AA' : 'SW1, SW2, SW3'}
            aria-invalid={!!errors.postcode}
          />
          {errors.postcode && (
            <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <Label htmlFor="subject">
            Subject <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value || '')}>
            <SelectTrigger className={`w-full mt-2 ${errors.subject ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select a subject..." />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="message"
            rows={6}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={`mt-2 resize-none ${errors.message ? 'border-red-500' : ''}`}
            placeholder={
              userRole === 'client'
                ? 'Tell us about your property or what you need help with...'
                : 'Tell us about your agency and how we can help...'
            }
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-12 gap-2 ${
            userRole === 'client'
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-emerald-600 hover:bg-emerald-700'
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
