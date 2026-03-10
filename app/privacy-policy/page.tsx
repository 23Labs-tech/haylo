import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/haylo-logo.jpg" alt="Haylo Logo" className="h-10 w-auto mix-blend-multiply" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-500 mb-12">Last updated: March 2026</p>

                <div className="prose prose-purple max-w-none text-gray-600">
                    <p className="mb-6">Haylo respects your privacy and is committed to protecting the personal information of our customers and their clients. This Privacy Policy explains how we collect, use, store, and protect information when you use Haylo's services.</p>
                    <p className="mb-12">By using Haylo, you agree to the collection and use of information in accordance with this policy.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">Haylo collects only the information necessary to operate and improve our services.</p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information provided by businesses</h3>
                    <p className="mb-2">When businesses use Haylo, we may collect information such as:</p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>Business name</li>
                        <li>Contact details</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Business service information</li>
                        <li>Calendar or booking system integrations</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information collected during calls</h3>
                    <p className="mb-2">When Haylo interacts with callers on behalf of a business, we may collect:</p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>Caller name (if provided)</li>
                        <li>Phone number</li>
                        <li>Appointment details</li>
                        <li>Service enquiries</li>
                        <li>Call recordings or transcripts (where enabled)</li>
                    </ul>
                    <p className="mb-8">This information is collected solely to provide the service requested by the business and their customers.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. How We Use Information</h2>
                    <p className="mb-2">Information collected by Haylo is used to:</p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>Provide and operate the Haylo AI receptionist service</li>
                        <li>Respond to customer enquiries and bookings</li>
                        <li>Improve the quality and accuracy of our services</li>
                        <li>Provide call summaries and notifications to businesses</li>
                        <li>Maintain platform performance and security</li>
                    </ul>
                    <p className="mb-8">Haylo does not sell, rent, or trade personal data to third parties.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Data Protection and Security</h2>
                    <p className="mb-4">Haylo takes the protection of personal information seriously.</p>
                    <p className="mb-4">We implement appropriate technical and organisational safeguards to ensure information remains secure and protected from unauthorised access, disclosure, alteration, or destruction. These safeguards may include:</p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>Encrypted data transmission</li>
                        <li>Secure cloud infrastructure</li>
                        <li>Access controls and authentication</li>
                        <li>Ongoing system monitoring</li>
                    </ul>
                    <p className="mb-8">We continuously review and improve our security practices to maintain a high standard of data protection.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Data Storage</h2>
                    <p className="mb-4">Information collected through Haylo is stored securely using reputable cloud service providers. Data may be stored in secure servers located in Australia or other jurisdictions with strong data protection standards.</p>
                    <p className="mb-8">We retain information only for as long as necessary to provide the service or meet legal and operational requirements.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Third Party Integrations</h2>
                    <p className="mb-4">Haylo may integrate with third party systems such as booking platforms, CRM systems, or communication services.</p>
                    <p className="mb-4">When these integrations are used, information may be shared with those services strictly for the purpose of completing requested actions such as scheduling appointments or sending confirmations.</p>
                    <p className="mb-8">Haylo works with trusted providers that maintain strong security and privacy standards.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Caller Transparency</h2>
                    <p className="mb-8">When Haylo answers calls, it may inform callers that they are interacting with an automated assistant. Businesses using Haylo are responsible for ensuring their customers are aware of how calls are handled where required by law.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Access and Control of Information</h2>
                    <p className="mb-4">Businesses using Haylo maintain control of the data collected through their use of the service.</p>
                    <p className="mb-8">Customers may request access to, correction of, or deletion of their personal information by contacting the business they interacted with or by contacting Haylo directly.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Changes to This Privacy Policy</h2>
                    <p className="mb-4">Haylo may update this Privacy Policy from time to time to reflect improvements to our services or changes in legal requirements.</p>
                    <p className="mb-8">Updated policies will be published on our website with the revised effective date.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">9. Contact Us</h2>
                    <p className="mb-4">If you have any questions about this Privacy Policy or how your information is handled, please contact:</p>
                    <p className="font-medium text-gray-900">[SUPPORT EMAIL ADDRESS TO BE DECIDED]</p>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center">

                    <p className="text-sm mb-4">© Copyright 2026. Haylo All Rights Reserved.</p>
                    <Link href="/" className="hover:text-white transition">Return to Home</Link>
                </div>
            </footer>
        </div>
    );
}
