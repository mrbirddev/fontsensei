import React from "react";
import {LandingLayout} from "../layout/SiteLayout";
import {PRODUCT_NAME} from "@nextutils/config";

const TermsPage = () => {
  const metaTitle = `Terms of Service - ${PRODUCT_NAME}`;

  return (
    <LandingLayout title={metaTitle}>
      <div className="py-8 max-w-3xl">
        <h1 className="text-lg text-gray-900 mb-2">Terms of Service</h1>
        <p className="mb-3 font-normal text-gray-500">
          These Terms of Service govern your use of {PRODUCT_NAME} (the "Service"). By accessing or using the Service, you agree to these Terms.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">1. Acceptance of the terms</h2>
        <p className="mb-3 font-normal text-gray-500">
          By accessing or using {PRODUCT_NAME}, you agree to these Terms of Service.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">2. Use of the service</h2>
        <p className="mb-3 font-normal text-gray-500">
          You agree to use the service only for lawful purposes and in a way that does not violate any applicable law or regulation.
        </p>
        <p className="mb-3 font-normal text-gray-500">
          Advertising. The Service may display advertisements provided by third-party providers, including Google AdSense.
          Third-party advertisers may use cookies or similar technologies to deliver and measure ads.
          For details about cookies and third-party advertising, please see our Privacy Policy.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">3. Intellectual property</h2>
        <p className="mb-3 font-normal text-gray-500">
          The service and its original content (excluding your data) are owned by {PRODUCT_NAME} and are protected by applicable intellectual property laws.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">4. Disclaimers</h2>
        <p className="mb-3 font-normal text-gray-500">
          The service is provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, to the fullest extent permitted by law.
          If the Service includes content or advertising from third parties, we do not control those providers and are not responsible for their actions or policies.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">5. Limitation of liability</h2>
        <p className="mb-3 font-normal text-gray-500">
          To the fullest extent permitted by law, {PRODUCT_NAME} will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">6. Termination</h2>
        <p className="mb-3 font-normal text-gray-500">
          We may suspend or terminate your access if you violate these Terms or if we are required to do so for legal or security reasons.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">7. Governing law</h2>
        <p className="mb-3 font-normal text-gray-500">
          These terms are governed by the laws of the jurisdiction where {PRODUCT_NAME} is operated, without regard to conflict of law principles.
        </p>

        <h2 className="mb-3 font-bold tracking-tight text-gray-900">8. Contact</h2>
        <p className="mb-3 font-normal text-gray-500">
          For questions about these Terms, please contact us via our GitHub issue tracker:{" "}
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

export default TermsPage;

