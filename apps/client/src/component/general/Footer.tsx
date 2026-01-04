export default function Footer() {
  return (
    <footer className="w-full bg-[#0F1011] border-t border-white/10 mt-15">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left */}
        <div className="flex items-center gap-3 text-sm text-secondary-font">
          <span className="text-primary-font font-medium">
            Bitwise Learn
          </span>

          <span className="h-4 w-px bg-white/20" />

          <span className="opacity-80">
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm text-secondary-font">
          <a
            href="/privacy-policy"
            className="hover:text-primary-font transition-colors"
          >
            Privacy Policy
          </a>
          <span className="h-4 w-px bg-white/20" />
          <a
            href="/terms"
            className="hover:text-primary-font transition-colors"
          >
            Terms of Service
          </a>
        </div>

      </div>
    </footer>
  );
}
