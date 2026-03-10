'use client';

import React from 'react';
import { Users } from 'lucide-react';

export default function CustomersPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Network coming soon</h1>
            <p className="text-lg text-gray-500 max-w-md">
                View caller history, CRM integration, and loyalty data coming in the next update.
            </p>
        </div>
    );
}
