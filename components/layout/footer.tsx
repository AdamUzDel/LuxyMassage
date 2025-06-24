import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-xl">LuxyMassage</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting you with verified professional escorts worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/browse" className="block hover:text-primary transition-colors">
                Browse Escorts
              </Link>
              <Link href="/categories" className="block hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/register" className="block hover:text-primary transition-colors">
                Join as Advertiser
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/safety" className="block hover:text-primary transition-colors">
                Safety Guidelines
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="block hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LuxyMassage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
