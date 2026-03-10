'use client';

import React, { useState, useEffect } from 'react';
import {
    Settings,
    MessageSquare,
    Building2,
    Clock,
    Save,
    Bot,
    User,
    Mail,
    Phone,
    Key,
    Smartphone,
    Download
} from 'lucide-react';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [importMode, setImportMode] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importData, setImportData] = useState({
        number: '',
        twilioAccountSid: '',
        twilioAuthToken: ''
    });

    const [formData, setFormData] = useState({
        vapiKey: '',
        assistantId: '',
        clinicName: '',
        location: '',
        botName: '',
        aiModel: 'openai|gpt-3.5-turbo',
        knowledgeBase: '',
        greeting: '',
        hours: '',
        adminEmail: '',
        adminPhone: '',
        customPrompt: ''
    });

    const [loading, setLoading] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [provisioningPhone, setProvisioningPhone] = useState(false);

    useEffect(() => {
        const fetchProfileAndPhone = async () => {
            try {
                // 0. Get user email from Supabase session to pre-fill admin email
                const { createClient } = await import('@/utils/supabase/client');
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                const userEmail = session?.user?.email || '';

                // If we have a user email, pre-fill adminEmail
                if (userEmail) {
                    setFormData(prev => ({ ...prev, adminEmail: prev.adminEmail || userEmail }));
                }

                // 1. Fetch user profile + settings from Supabase via our API
                const profileRes = await fetch('/api/vapi');
                if (profileRes.ok) {
                    const profile = await profileRes.json();

                    // If settings_json exists, parse it and populate the form
                    if (profile.settings_json) {
                        try {
                            const savedSettings = typeof profile.settings_json === 'string'
                                ? JSON.parse(profile.settings_json)
                                : profile.settings_json;
                            setFormData(prev => ({
                                ...prev,
                                ...savedSettings,
                                // Make sure adminEmail is set from session if not in settings
                                adminEmail: savedSettings.adminEmail || prev.adminEmail || userEmail
                            }));
                        } catch (e) {
                            console.error('Failed to parse settings_json');
                        }
                    }

                    // Also grab phone number from the profile directly
                    if (profile.vapi_phone_number) {
                        setPhoneNumber(profile.vapi_phone_number);
                    }
                }

                // 2. Also fetch phone number from the dedicated phone endpoint as fallback
                const phoneRes = await fetch('/api/vapi/phone');
                if (phoneRes.ok) {
                    const phoneData = await phoneRes.json();
                    if (phoneData.phoneNumber) {
                        setPhoneNumber(phoneData.phoneNumber);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch profile settings');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndPhone();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setSaved(false);
    };

    const handleImportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setImportData({
            ...importData,
            [e.target.name]: e.target.value
        });
    };

    const handleImportNumber = async (e: React.FormEvent) => {
        e.preventDefault();
        setImporting(true);

        try {
            const response = await fetch('/api/vapi/import-phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    provider: 'twilio',
                    ...importData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`Error: ${data.error}`);
            } else {
                setPhoneNumber(data.phoneNumber);
                setImportMode(false);
                alert('Phone number imported successfully!');
            }
        } catch (err) {
            console.error("Failed to import number:", err);
            alert("Network error. Please try again.");
        } finally {
            setImporting(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Send the new settings to our secure Next.js Backend API
            const response = await fetch('/api/vapi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    botName: formData.botName,
                    clinicName: formData.clinicName,
                    location: formData.location,
                    knowledgeBase: formData.knowledgeBase,
                    hours: formData.hours,
                    adminEmail: formData.adminEmail,
                    adminPhone: formData.adminPhone,
                    greeting: formData.greeting,
                    customPrompt: formData.customPrompt,
                    aiModel: formData.aiModel
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to save settings:', errorData.error);
                alert(`Error saving settings: ${errorData.error}`);
            } else {
                setSaved(true);
            }
        } catch (err) {
            console.error("Failed to call internal API:", err);
            alert("Network error. Please try again.");
        } finally {
            setSaving(false);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Loading your settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Haylo Settings</h1>
                <p className="text-gray-500 mt-1">Configure your med spa's details and AI receptionist.</p>
            </div>

            {/* Inbound Phone Number Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-bold text-gray-900">Inbound Phone Number</h2>
                    </div>
                </div>

                {phoneNumber ? (
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Dedicated AI Phone Number</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Your patients can call this number to speak directly with your AI Assistant.
                            </p>
                        </div>
                        <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100 font-mono text-green-700 font-bold text-lg">
                            {phoneNumber}
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        {!importMode ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Dedicated AI Phone Number</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        You do not have a phone number assigned yet. First save your settings to generate an assistant, then you can provision a new number or import an existing one.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setProvisioningPhone(true);
                                            try {
                                                const res = await fetch('/api/vapi/phone', { method: 'POST', body: JSON.stringify({ areaCode: '415' }) });
                                                const data = await res.json();
                                                if (data.error) {
                                                    alert(data.error);
                                                } else {
                                                    setPhoneNumber(data.phoneNumber);
                                                }
                                            } catch (e) {
                                                alert("Network error.");
                                            } finally {
                                                setProvisioningPhone(false);
                                            }
                                        }}
                                        disabled={provisioningPhone || saving}
                                        className="w-full whitespace-nowrap px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        <Smartphone className="w-4 h-4" />
                                        {provisioningPhone ? 'Provisioning...' : 'Get New Number'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImportMode(true)}
                                        className="w-full px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Import Existing
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-base font-bold text-gray-900">Import Existing Phone Number</h3>
                                    <button
                                        type="button"
                                        onClick={() => setImportMode(false)}
                                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <form onSubmit={handleImportNumber} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Phone Number to Import</label>
                                            <input
                                                type="text"
                                                name="number"
                                                value={importData.number}
                                                onChange={handleImportChange}
                                                placeholder="+1234567890"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-shadow outline-none text-gray-900 font-mono"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Twilio Account SID</label>
                                            <input
                                                type="text"
                                                name="twilioAccountSid"
                                                value={importData.twilioAccountSid}
                                                onChange={handleImportChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-shadow outline-none text-gray-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Twilio Auth Token</label>
                                            <input
                                                type="password"
                                                name="twilioAuthToken"
                                                value={importData.twilioAuthToken}
                                                onChange={handleImportChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-shadow outline-none text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={importing}
                                            className="w-full px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg shadow font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                        >
                                            {importing ? 'Importing...' : 'Import from Twilio'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Clinic Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-bold text-gray-900">Clinic Profile</h2>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Clinic Name</label>
                            <input
                                type="text"
                                name="clinicName"
                                value={formData.clinicName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Location / Branch</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Admin Email
                            </label>
                            <input
                                type="email"
                                name="adminEmail"
                                value={formData.adminEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                Admin Phone
                            </label>
                            <input
                                type="text"
                                name="adminPhone"
                                value={formData.adminPhone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {/* AI Receptionist Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
                        <Bot className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-gray-900">AI Receptionist Persona</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">AI Name</label>
                                <input
                                    type="text"
                                    name="botName"
                                    value={formData.botName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900"
                                />
                            </div>


                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">AI Model</label>
                                <select
                                    name="aiModel"
                                    value={formData.aiModel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900 bg-white"
                                >
                                    <option value="openai|gpt-3.5-turbo">GPT-3.5 Turbo (Fast, Cost-effective)</option>
                                    <option value="openai|gpt-4o">GPT-4o (State of the art intelligence)</option>
                                    <option value="openai|gpt-4">GPT-4 (Highly capable)</option>
                                    <option value="anthropic|claude-3-haiku-20240307">Claude 3 Haiku (Quick & concise)</option>
                                    <option value="anthropic|claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (Advanced nuances)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Select the underlying language model powering your AI Receptionist.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                Greeting Message
                            </label>
                            <input
                                type="text"
                                name="greeting"
                                value={formData.greeting}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900"
                            />
                            <p className="text-xs text-gray-500 mt-1">This is the first sentence the AI will say when answering a call.</p>
                        </div>
                    </div>
                </div>

                {/* Knowledge Base Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900">Clinic Knowledge Base</h2>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                Operating Hours
                            </label>
                            <textarea
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900 resize-none font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                Services & Rules
                            </label>
                            <textarea
                                name="knowledgeBase"
                                value={formData.knowledgeBase}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900 resize-none"
                            />
                            <p className="text-xs text-gray-500">Provide specific instructions, pricing, or rules the AI should know.</p>
                        </div>

                        <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-100">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                Specific Overrides / Custom System Prompt
                            </label>
                            <textarea
                                name="customPrompt"
                                value={formData.customPrompt}
                                onChange={handleChange}
                                rows={4}
                                placeholder="e.g. Never provide medical advice. Only push people to book a consultation."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900 resize-none font-mono text-sm bg-gray-50"
                            />
                            <p className="text-xs text-gray-500">Add any explicit rules that directly alter the underlying prompt engine.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`
                            flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all
                            ${saved ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}
                            ${saving ? 'opacity-70 cursor-wait' : 'transform hover:-translate-y-0.5'}
                        `}
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saved ? (
                            <User className="w-5 h-5" /> // Used user just as a placeholder check icon
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? 'Saving...' : saved ? 'Saved Successfully' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
