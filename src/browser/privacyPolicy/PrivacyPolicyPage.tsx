import React from "react";
import {LandingLayout} from "../layout/SiteLayout";
import {PRODUCT_NAME} from "@nextutils/config";

const PrivacyPolicyPage = () => {
  const metaTitle = `Privacy Policy - ${PRODUCT_NAME}`;

  return (
    <LandingLayout title={metaTitle}>
      <div className="py-8 max-w-3xl">
        <h1 className="text-lg text-gray-900 mb-2">Privacy Policy</h1>
        <p className="mb-3 font-normal text-gray-500">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information when you use {PRODUCT_NAME} (the "Service").
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">1. Information we collect</h2>
        <p className="mb-3 font-normal text-gray-500">
          We may collect information you provide to us when using {PRODUCT_NAME}, such as preferences, search queries, and usage
          data.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">2. How we use information</h2>
        <p className="mb-3 font-normal text-gray-500">
          We may use collected information to operate, maintain, and improve the service, and to understand how users interact with it.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">3. Cookies and similar technologies</h2>
        <p className="mb-3 font-normal text-gray-500">
          We use cookies and similar technologies to run {PRODUCT_NAME}, remember your preferences, and analyze how visitors use the service.
          For users in GDPR/UK jurisdictions, we ask for your consent before placing non-essential cookies (including cookies used for advertising personalization or measurement).
          You can review and change your cookie choices at any time using your cookie settings.
          We may also use third-party advertising services, including Google AdSense, which may place cookies or use similar technologies to serve ads and measure ad performance.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">4. Sharing of information</h2>
        <p className="mb-3 font-normal text-gray-500">
          We may share information with vendors and service providers that help us run the service, including advertising partners such as Google that provide ad content through Google AdSense.
          These third parties may have their own cookies and privacy policies, and they may collect and process certain information to provide and improve their services.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">5. Data retention</h2>
        <p className="mb-3 font-normal text-gray-500">
          We retain information only as long as necessary for the purposes described in this policy, unless a longer retention period is required or permitted by law.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">6. Security</h2>
        <p className="mb-3 font-normal text-gray-500">
          We implement reasonable administrative, technical, and organizational safeguards designed to protect information. However, no method of transmission or storage is 100% secure.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">7. Your rights</h2>
        <ul className="list-disc pl-5">
          <li className="mb-3 font-normal text-gray-500">Request access to or deletion of your data where applicable.</li>
          <li className="mb-3 font-normal text-gray-500">Object to or restrict certain processing in accordance with applicable law.</li>
          <li className="mb-3 font-normal text-gray-500">Withdraw consent for non-essential cookies and cookie-based advertising personalization/measurement at any time, where applicable.</li>
        </ul>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">8. Contact</h2>
        <p className="mb-3 font-normal text-gray-500">
          If you have questions about this policy, please contact us via our GitHub issue tracker:{" "}
          <a className="link" href="https://github.com/mrbirddev/fontsensei/issues/new" target="_blank" rel="noreferrer">
            https://github.com/mrbirddev/fontsensei/issues/new
          </a>
        </p>

        <p className="mt-6 text-sm font-normal text-gray-500">
          Last updated: 29 April 2026
        </p>
      </div>
    </LandingLayout>
  );
};

export default PrivacyPolicyPage;

