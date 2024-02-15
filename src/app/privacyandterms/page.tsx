import React, { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
	return (
		<div className="p-4 font-sans">
			<h1
				className="text-3xl font-bold mb-4"
				id="privacy-policy">
				Privacy Policy:
			</h1>
			<p className="text-gray-600 mb-4">Last Updated: 14 Feb. 2024</p>
			<p className="mb-4">
				Thank you for using our note-sharing website. This Privacy Policy explains how we collect, use, and protect your
				personal information. By using our website, you agree to the terms outlined in this policy.
			</p>
			<h2
				className="text-2xl font-bold mb-2"
				id="information-we-collect">
				Information We Collect:
			</h2>
			<h3
				className="text-xl font-bold mb-1"
				id="account-information">
				Account Information:
			</h3>
			<p className="mb-4">We collect information such as your name, email, and username when you create an account.</p>
			<h3
				className="text-xl font-bold mb-1"
				id="usage-data">
				Usage Data:
			</h3>
			<p className="mb-4">
				We may collect data on how you interact with our website, including the subjects, posts, questions, and answers
				you view or contribute to.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="device-information">
				Device Information:
			</h3>
			<p className="mb-4">
				We automatically collect information about your device, including IP address, browser type, and operating
				system.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="cookies">
				Cookies:
			</h3>
			<p className="mb-4">We do not use cookies on our website.</p>
			<h2
				className="text-2xl font-bold mb-2"
				id="how-we-use-your-information">
				How We Use Your Information:
			</h2>
			<h3
				className="text-xl font-bold mb-1"
				id="account-management">
				Account Management:
			</h3>
			<p className="mb-4">We use your account information to manage and personalize your user experience.</p>
			<h3
				className="text-xl font-bold mb-1"
				id="communication">
				Communication:
			</h3>
			<p className="mb-4">
				We may use your email to send important notifications related to your account or the service.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="analytics">
				Analytics:
			</h3>
			<p className="mb-4">
				We may analyze user behavior to improve our website&apos;s functionality and user experience.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="legal-compliance">
				Legal Compliance:
			</h3>
			<p className="mb-4">We may use your information to comply with legal obligations.</p>
			<h3
				className="text-xl font-bold mb-1"
				id="data-security">
				Data Security:
			</h3>
			<p className="mb-4">We take appropriate measures to secure your data and protect it from unauthorized access.</p>
			<h3
				className="text-xl font-bold mb-1"
				id="your-rights">
				Your Rights:
			</h3>
			<p className="mb-4">
				You have the right to access, correct, or delete your personal information. Please contact us for any inquiries
				regarding your data.
			</p>

			{/* Terms of Service */}
			<h1
				className="text-3xl font-bold mb-4"
				id="terms-of-service">
				Legal Disclaimer / Terms of Service:
			</h1>
			<p className="text-gray-600 mb-4">Last Updated: 12 Feb. 2024</p>
			<p className="mb-4">By using our note-sharing website, you agree to the following terms:</p>
			<h3
				className="text-xl font-bold mb-1"
				id="intellectual-property">
				Intellectual Property:
			</h3>
			<p className="mb-4">
				We do not claim ownership of any intellectual property uploaded by users. Users retain full rights to their
				documents and media.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="user-responsibility">
				User Responsibility:
			</h3>
			<p className="mb-4">
				Users are solely responsible for the content they upload. We do not take responsibility for the accuracy,
				legality, or appropriateness of user-generated content.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="prohibited-content">
				Prohibited Content:
			</h3>
			<p className="mb-4">
				Users are prohibited from uploading sensitive, harmful, or harassing content. Violation of this rule may result
				in a ban from the website.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="user-bans">
				User Bans:
			</h3>
			<p className="mb-4">
				We reserve the right to ban users who violate our terms of service or engage in inappropriate behavior on the
				platform.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="limitation-of-liability">
				Limitation of Liability:
			</h3>
			<p className="mb-4">
				We do not accept liability for any damages, direct or indirect, arising from the use of our website.
			</p>
			<h3
				className="text-xl font-bold mb-1"
				id="changes-to-terms">
				Changes to Terms:
			</h3>
			<p className="mb-4">
				We may update our terms of service from time to time. Users will be notified of any changes, and continued use
				of the website constitutes acceptance of the updated terms.
			</p>
		</div>
	);
};

export default Page;
