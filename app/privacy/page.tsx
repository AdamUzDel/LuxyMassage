export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, 
          update your profile, or contact us for support.
        </p>

        <h3>Personal Information</h3>
        <ul>
          <li>Name and contact information</li>
          <li>Profile information and photos</li>
          <li>Payment information</li>
          <li>Communications with us and other users</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li>Device information and IP address</li>
          <li>Usage data and analytics</li>
          <li>Location information (with permission)</li>
          <li>Cookies and similar technologies</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and improve our services</li>
          <li>Process transactions and send notifications</li>
          <li>Communicate with you about our services</li>
          <li>Ensure safety and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share your information in the following circumstances:
        </p>
        <ul>
          <li>With your consent</li>
          <li>With service providers who assist our operations</li>
          <li>For legal compliance or safety reasons</li>
          <li>In connection with a business transfer</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your information against unauthorized access, 
          alteration, disclosure, or destruction.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and update your information</li>
          <li>Delete your account</li>
          <li>Opt out of marketing communications</li>
          <li>Request data portability</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at privacy@luxydirectory.com
        </p>
      </div>
    </div>
  )
}
