'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Settings,
    MessageSquare,
    Building2,
    Clock,
    Save,
    Bot,
    Check,
    Mail,
    Phone,
    Smartphone,
    Download,
    Volume2,
    AlertCircle,
    PlayCircle,
    StopCircle,
    Loader2,
    Trash2,
    Edit3,
    PhoneOff
} from 'lucide-react';
import { toast } from 'sonner';
import { VOICE_OPTIONS } from '@/constants/voices';
import { AI_MODELS } from '@/constants/models';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [areaCode, setAreaCode] = useState('02');

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
        customPrompt: '',
        voiceId: 'XB0fDUnXU5powFXDhCwa'
    });


    const [loading, setLoading] = useState(true);
    const [hasAssistant, setHasAssistant] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
    const [previewLoadingId, setPreviewLoadingId] = useState<string | null>(null);
    const [provisioningPhone, setProvisioningPhone] = useState(false);
    const [deletingPhone, setDeletingPhone] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [savedTwilioSid, setSavedTwilioSid] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Helper: Apply profile data to form state (used on initial load and after session refresh retry)
    const applyProfileData = (profile: any, userEmail: string) => {
        // Detect first-time user (no settings_json and no vapi_assistant_id)
        if (!profile.settings_json && !profile.vapi_assistant_id) {
            setIsFirstTime(true);
        }

        if (profile.vapi_assistant_id) {
            setHasAssistant(true);
        }

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
                    adminEmail: savedSettings.adminEmail || prev.adminEmail || userEmail,
                    voiceId: savedSettings.voiceId || prev.voiceId
                }));
            } catch (e) {
                console.error('Failed to parse settings_json');
            }
        }

        // Also grab phone number from the profile directly
        if (profile.vapi_phone_number) {
            setPhoneNumber(profile.vapi_phone_number);
        }
    };

    useEffect(() => {
        const fetchProfileAndPhone = async () => {
            try {
                // 0. Get user email from Supabase session to pre-fill admin email
                const { createClient } = await import('@/utils/supabase/client');
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                const userEmail = session?.user?.email || '';

                // If no session at all, redirect to login immediately
                if (!session) {
                    console.warn('No active session found, redirecting to login...');
                    window.location.href = '/login';
                    return;
                }

                // If we have a user email, pre-fill adminEmail
                if (userEmail) {
                    setFormData(prev => ({ ...prev, adminEmail: prev.adminEmail || userEmail }));
                }

                // 1. Fetch user profile + settings from Supabase via our API
                const profileRes = await fetch('/api/vapi');

                // Handle expired session - try to refresh, then redirect if still failing
                if (profileRes.status === 401) {
                    console.warn('API returned 401, attempting session refresh...');
                    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
                    if (refreshError || !refreshData.session) {
                        console.error('Session refresh failed, redirecting to login');
                        toast.error('Session expired. Please log in again.');
                        window.location.href = '/login';
                        return;
                    }
                    // Retry the fetch after refresh
                    const retryRes = await fetch('/api/vapi');
                    if (retryRes.status === 401) {
                        console.error('Still unauthorized after refresh, redirecting to login');
                        toast.error('Session expired. Please log in again.');
                        window.location.href = '/login';
                        return;
                    }
                    if (retryRes.ok) {
                        const profile = await retryRes.json();
                        applyProfileData(profile, userEmail);
                    }
                } else if (profileRes.ok) {
                    const profile = await profileRes.json();
                    applyProfileData(profile, userEmail);
                }

                // 2. Also fetch phone number from the dedicated phone endpoint as fallback
                const phoneRes = await fetch('/api/vapi/phone');
                if (phoneRes.ok) {
                    const phoneData = await phoneRes.json();
                    if (phoneData.phoneNumber) {
                        setPhoneNumber(phoneData.phoneNumber);
                    }
                    if (phoneData.twilioAccountSid) {
                        setSavedTwilioSid(phoneData.twilioAccountSid);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch profile settings:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndPhone();
    }, []);

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setSaved(false);
        // Clear error for this field as user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleVoicePreview = useCallback(async (voiceId: string) => {
        if (previewingVoiceId === voiceId || previewLoadingId === voiceId) {
            audioRef.current?.pause();
            audioRef.current = null;
            setPreviewingVoiceId(null);
            setPreviewLoadingId(null);
            return;
        }
        audioRef.current?.pause();
        audioRef.current = null;
        setPreviewingVoiceId(null);
        setPreviewLoadingId(voiceId);
        try {
            const audio = new Audio(`/api/voice-preview?voiceId=${voiceId}`);
            audioRef.current = audio;
            audio.onended = () => {
                setPreviewingVoiceId(null);
            };
            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                console.error('Audio error code:', audio.error?.code, 'message:', audio.error?.message);
                setPreviewingVoiceId(null);
                setPreviewLoadingId(null);
                toast.error('Failed to play voice preview.');
            };
            audio.onloadstart = () => {
                setPreviewLoadingId(null);
                setPreviewingVoiceId(voiceId);
            };
            await audio.play().catch(err => {
                console.error('Play error:', err);
                toast.error('Failed to play audio.');
                setPreviewLoadingId(null);
                setPreviewingVoiceId(null);
            });
        } catch (err) {
            console.error('Preview error:', err);
            setPreviewLoadingId(null);
            setPreviewingVoiceId(null);
            toast.error('Network error loading voice preview.');
        }
    }, [previewingVoiceId, previewLoadingId]);

    const handleImportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setImportData({
            ...importData,
            [e.target.name]: e.target.value
        });
    };

    const handleImportNumber = async (e: React.FormEvent): Promise<boolean> => {
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
                toast.error(`Error: ${data.error}`);
                return false;
            } else {
                setPhoneNumber(data.phoneNumber);
                if (data.twilioAccountSid) {
                    setSavedTwilioSid(data.twilioAccountSid);
                }
                toast.success('Phone number imported successfully!');
                return true;
            }
        } catch (err) {
            console.error("Failed to import number:", err);
            toast.error("Network error. Please try again.");
            return false;
        } finally {
            setImporting(false);
        }
    };

    const handleGetNewNumber = async (e: React.FormEvent) => {
        e.preventDefault();
        setProvisioningPhone(true);

        try {
            const response = await fetch('/api/vapi/phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    areaCode: areaCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(`Error: ${data.error}`);
            } else {
                setPhoneNumber(data.phoneNumber);
                toast.success(`Phone number ${data.phoneNumber} provisioned successfully!`);
            }
        } catch (err) {
            console.error("Failed to get new number:", err);
            toast.error("Network error. Please try again.");
        } finally {
            setProvisioningPhone(false);
        }
    };

    const handleDeleteNumber = async () => {
        setDeletingPhone(true);
        try {
            const response = await fetch('/api/vapi/phone', {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(`Error: ${data.error}`);
            } else {
                setPhoneNumber(null);
                setSavedTwilioSid(null);
                setShowDeleteConfirm(false);
                setImportData({ number: '', twilioAccountSid: '', twilioAuthToken: '' });
                toast.success('Phone number deleted successfully.');
            }
        } catch (err) {
            console.error('Failed to delete number:', err);
            toast.error('Network error. Please try again.');
        } finally {
            setDeletingPhone(false);
        }
    };

    const handleStartEdit = () => {
        setEditingPhone(true);
        // Pre-fill saved Twilio SID so user doesn't have to re-enter it
        setImportData({
            number: '',
            twilioAccountSid: savedTwilioSid || '',
            twilioAuthToken: ''
        });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const requiredFields = ['clinicName', 'location', 'botName', 'greeting', 'hours', 'knowledgeBase', 'adminEmail', 'adminPhone'];

        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData] || (formData[field as keyof typeof formData] as string).trim() === '') {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSaving(true);

        // 45-second timeout so the button never gets permanently stuck
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000);

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
                    aiModel: formData.aiModel,
                    voiceId: formData.voiceId
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                // Session expired - redirect to login
                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    window.location.href = '/login';
                    return;
                }
                // Handle both JSON and non-JSON error responses (e.g. Vercel timeout HTML page)
                let errorMessage = `Server error (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    // Response wasn't JSON (e.g., Vercel timeout returns HTML)
                    const text = await response.text();
                    console.error('Non-JSON error response:', text.substring(0, 200));
                    if (response.status === 504) {
                        errorMessage = 'Request timed out. Please try again.';
                    }
                }
                console.error('Failed to save settings:', errorMessage);
                toast.error(`Error saving settings: ${errorMessage}`);
            } else {
                setSaved(true);
                setIsFirstTime(false);
                setHasAssistant(true);
                toast.success('Settings saved successfully!');
            }
        } catch (err: any) {
            console.error("Failed to call internal API:", err);
            if (err?.name === 'AbortError') {
                toast.error("Save request timed out. Please try again.");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            clearTimeout(timeout);
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
                <p className="text-gray-500 mt-1">Configure your clinic's details and AI receptionist.</p>
            </div>

            {/* First-time user banner */}
            {isFirstTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900">Welcome to Haylo!</h3>
                        <p className="text-sm text-blue-800 mt-1">
                            Complete your clinic profile below to activate your AI receptionist. Once saved, your AI assistant will be ready to answer calls.
                        </p>
                    </div>
                </div>
            )}

            {/* Inbound Phone Number Section — always visible */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-bold text-gray-900">Inbound Phone Number</h2>
                    </div>
                    {phoneNumber && (
                        <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Connected</span>
                    )}
                </div>

                {!hasAssistant ? (
                    /* No assistant yet — prompt user to save settings first */
                    <div className="p-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-amber-900">Save your settings first</p>
                                <p className="text-sm text-amber-800 mt-1">
                                    Fill in your clinic profile and AI receptionist details below and click <strong>Save Settings</strong>. Once your AI assistant is created, you can import your Twilio phone number here.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : phoneNumber && !editingPhone ? (
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Dedicated AI Phone Number</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Your patients can call this number to speak directly with your AI Assistant.
                                </p>
                                {savedTwilioSid && (
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <Smartphone className="w-3 h-3" />
                                        Connected via Twilio &middot; Account: {savedTwilioSid.substring(0, 8)}...{savedTwilioSid.slice(-4)}
                                    </p>
                                )}
                            </div>
                            <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100 font-mono text-green-700 font-bold text-lg">
                                {phoneNumber}
                            </div>
                        </div>

                        {/* Edit & Delete Buttons */}
                        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleStartEdit}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Change Number
                            </button>
                            {!showDeleteConfirm ? (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Number
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                                    <PhoneOff className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-red-700 font-medium">Are you sure?</span>
                                    <button
                                        type="button"
                                        onClick={handleDeleteNumber}
                                        disabled={deletingPhone}
                                        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {deletingPhone ? 'Deleting...' : 'Yes, Delete'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-3 py-1 text-sm font-medium text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        {editingPhone && phoneNumber && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Replacing current number: <span className="font-mono">{phoneNumber}</span></p>
                                    <p className="text-xs text-amber-700 mt-1">The old number will be removed from your AI assistant when you import the new one.</p>
                                </div>
                            </div>
                        )}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-base font-bold text-gray-900 mb-3">
                                {editingPhone ? 'Import New Phone Number from Twilio' : 'Import Phone Number from Twilio'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                To connect a phone number, you'll need a Twilio account with a number already purchased. Enter your Twilio credentials below to connect it to your AI receptionist.
                            </p>

                            <form onSubmit={(e) => { handleImportNumber(e).then((success) => { if (success) setEditingPhone(false); }); }} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone Number to Import</label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={importData.number}
                                            onChange={handleImportChange}
                                            placeholder="+61XXXXXXXXX"
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

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={importing}
                                        className="flex-1 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg shadow font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {importing ? 'Importing...' : editingPhone ? 'Replace Number' : 'Import from Twilio'}
                                    </button>
                                    {editingPhone && (
                                        <button
                                            type="button"
                                            onClick={() => setEditingPhone(false)}
                                            className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
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
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 ${errors.clinicName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            {errors.clinicName && <p className="text-xs text-red-600">{errors.clinicName}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Clinic Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. 123 Collins St, Melbourne VIC"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            {errors.location && <p className="text-xs text-red-600">{errors.location}</p>}
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
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 ${errors.adminEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            {errors.adminEmail && <p className="text-xs text-red-600">{errors.adminEmail}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                Admin Phone (for call transfers)
                            </label>
                            <input
                                type="text"
                                name="adminPhone"
                                value={formData.adminPhone}
                                onChange={handleChange}
                                placeholder="e.g. +61298765432"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 ${errors.adminPhone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            {errors.adminPhone && <p className="text-xs text-red-600">{errors.adminPhone}</p>}
                            {!errors.adminPhone && <p className="text-xs text-gray-500">The AI will offer this number when a caller needs to speak to a human.</p>}
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
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 ${errors.botName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                                />
                                {errors.botName && <p className="text-xs text-red-600">{errors.botName}</p>}
                            </div>


                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">AI Model</label>
                                <select
                                    name="aiModel"
                                    value={formData.aiModel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900 bg-white"
                                >
                                    {AI_MODELS.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.label} ({model.description})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Select the underlying language model powering your AI Receptionist.</p>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4 text-gray-400" />
                                    Voice
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {VOICE_OPTIONS.map((voice) => (
                                        <button
                                            key={voice.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, voiceId: voice.id })}
                                            className={`p-3 rounded-lg border-2 transition-all text-center relative ${
                                                formData.voiceId === voice.id
                                                    ? 'border-purple-600 bg-purple-50'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <p className="font-semibold text-sm text-gray-900">{voice.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{voice.accent}</p>
                                            <p className="text-xs text-gray-400">{voice.gender}</p>
                                            <div className="mt-2 flex justify-center">
                                                <PlayCircle className="w-4 h-4 text-gray-300 cursor-not-allowed" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Select the voice for your AI receptionist. Default is Charlotte (Australian female).</p>
                                <p className="text-xs text-amber-600 mt-2">💬 Voice previews are available in production. In development, you can still select your preferred voice.</p>
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
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 ${errors.greeting ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            {errors.greeting && <p className="text-xs text-red-600">{errors.greeting}</p>}
                            {!errors.greeting && <p className="text-xs text-gray-500 mt-1">This is the first sentence the AI will say when answering a call.</p>}
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
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 resize-none font-mono text-sm ${errors.hours ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            {errors.hours && <p className="text-xs text-red-600">{errors.hours}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                Services & Pricing
                            </label>
                            <textarea
                                name="knowledgeBase"
                                value={formData.knowledgeBase}
                                onChange={handleChange}
                                rows={4}
                                placeholder="e.g. Physiotherapy consult $120, 45 min. Cancellation: 24h notice required."
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 resize-none ${errors.knowledgeBase ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                            />
                            {errors.knowledgeBase && <p className="text-xs text-red-600">{errors.knowledgeBase}</p>}
                            {!errors.knowledgeBase && <p className="text-xs text-gray-500">List all services, pricing, and important policies. The AI will reference this when answering calls.</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-100">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                Advanced Instructions
                            </label>
                            <textarea
                                name="customPrompt"
                                value={formData.customPrompt}
                                onChange={handleChange}
                                rows={4}
                                placeholder="e.g. Never book appointments for new patients, ask them to call back."
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-shadow outline-none text-gray-900 resize-none font-mono text-sm ${errors.customPrompt ? 'border-red-500 focus:ring-red-500 bg-white' : 'border-gray-300 focus:ring-purple-500 bg-gray-50'}`}
                            />
                            {errors.customPrompt && <p className="text-xs text-red-600">{errors.customPrompt}</p>}
                            {!errors.customPrompt && <p className="text-xs text-gray-500">Override AI behavior with specific rules — e.g., emergency handling, booking restrictions, tone preferences.</p>}
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
                            <Check className="w-5 h-5" />
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
