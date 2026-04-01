'use client';

import { CheckCircle2, X } from 'lucide-react';
import type { FormEvent } from 'react';

import type { DemoFormData, FormStatus } from './types';

type DemoModalProps = {
  isOpen: boolean;
  demoForm: DemoFormData;
  demoStatus: FormStatus;
  onClose: () => void;
  onDemoFormChange: (field: keyof DemoFormData, value: string) => void;
  onSubmitDemoForm: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function DemoModal({
  isOpen,
  demoForm,
  demoStatus,
  onClose,
  onDemoFormChange,
  onSubmitDemoForm,
}: DemoModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 md:p-10 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition">
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-[28px] font-bold text-[#1e1e1e] mb-3">Book a Demo</h3>
        <p className="text-[16px] text-gray-500 mb-8">Enter your details and our team will get in touch to show you how Haylo can automate your clinic.</p>

        {demoStatus === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-[24px] font-bold text-gray-900 mb-2">Request Submitted!</h4>
            <p className="text-[16px] text-gray-600 mb-8">We&apos;ve received your details and will be in touch shortly.</p>
            <button onClick={onClose} className="bg-[#a824fa] text-white w-full py-4 rounded-xl font-bold hover:bg-[#911fdb] transition">Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmitDemoForm} className="space-y-5">
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">Full Name *</label>
              <input required type="text" value={demoForm.fullName} onChange={(e) => onDemoFormChange('fullName', e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="Jane Doe" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[15px] font-medium text-gray-700 mb-2">Mobile *</label>
                <input required type="tel" value={demoForm.mobile} onChange={(e) => onDemoFormChange('mobile', e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="+61 400 000 000" />
              </div>
              <div>
                <label className="block text-[15px] font-medium text-gray-700 mb-2">Email *</label>
                <input required type="email" value={demoForm.email} onChange={(e) => onDemoFormChange('email', e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="jane@clinic.com" />
              </div>
            </div>
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">Company / Clinic Name</label>
              <input type="text" value={demoForm.company} onChange={(e) => onDemoFormChange('company', e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="Radiance MedSpa" />
            </div>
            <div className="pt-4">
              <button disabled={demoStatus === 'submitting'} type="submit" className="w-full bg-[#a824fa] hover:bg-[#911fdb] text-white py-4 rounded-xl font-bold transition flex items-center justify-center text-[16px] disabled:opacity-70">{demoStatus === 'submitting' ? 'Submitting...' : 'Request Demo'}</button>
            </div>
            {demoStatus === 'error' && <p className="text-red-500 text-sm text-center">There was an error submitting. Please try again.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
