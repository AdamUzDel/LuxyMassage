export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <h1>Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>What Are Cookies</h2>
        <p>
          Cookies are small text files that are stored on your device when you visit our website. 
          They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
        </p>

        <h2>Types of Cookies We Use</h2>

        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly. They enable core functionality 
          such as security, network management, and accessibility.
        </p>

        <h3>Performance Cookies</h3>
        <p>
          These cookies collect information about how you use our website, such as which pages you visit most often. 
          This data helps us improve our website&apos;s performance.
        </p>

        <h3>Functionality Cookies</h3>
        <p>
          These cookies allow our website to remember choices you make and provide enhanced features. 
          They may be set by us or by third-party providers.
        </p>

        <h3>Targeting Cookies</h3>
        <p>
          These cookies are used to deliver advertisements that are relevant to you and your interests. 
          They also help limit the number of times you see an advertisement.
        </p>

        <h2>Managing Cookies</h2>
        <p>
          You can control and manage cookies in various ways. Please note that removing or blocking cookies 
          may impact your user experience and parts of our website may no longer be fully accessible.
        </p>

        <h3>Browser Settings</h3>
        <p>
          Most web browsers allow you to manage cookies through their settings. You can usually find these 
          settings in the &quot;Options&quot; or &quot;Preferences&quot; menu of your browser.
        </p>

        <h3>Third-Party Tools</h3>
        <p>
          You can also use third-party tools and opt-out mechanisms provided by advertising networks to 
          control targeted advertising cookies.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our use of cookies, please contact us at cookies@luxydirectory.com
        </p>
      </div>
    </div>
  )
}
