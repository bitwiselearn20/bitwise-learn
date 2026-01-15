import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import BitwiseImage from "@/app/images/BitwiseImage.png"
import { Colors } from "./Colors";

export default function Footer() {
  return (
    <footer
      className={`${Colors.background.primary} ${Colors.border.default} backdrop-blur-lg py-8 px-6 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info & Social Media */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <Link href="/">
            <img
              src={BitwiseImage.src}
              alt="Bitwise Logo"
              className="h-10 mb-4 transition-transform hover:scale-105"
            />
          </Link>
          <p className={`text-sm max-w-62.5 mb-4 ${Colors.text.special}`}>
            Learn, Code, Grow.
          </p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className={`transition-colors ${Colors.text.primary} hover:text-blue-600`}>
              <Facebook size={22} />
            </a>
            <a href="#" aria-label="X" className={`transition-colors ${Colors.text.primary} hover:text-gray-300`}>
              <Github size={22} />
            </a>
            <a href="#" aria-label="Instagram" className={`transition-colors ${Colors.text.primary} hover:text-yellow-400`}>
              <Instagram size={22} />
            </a>
            <a href="#" aria-label="LinkedIn" className={`transition-colors ${Colors.text.primary} hover:text-blue-400`}>
              <Linkedin size={22} />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center sm:text-left">
          <h4 className={`font-bold text-lg mb-4 ${Colors.text.primary}`}>
            Quick Links
          </h4>
          <ul className={`space-y-2 ${Colors.text.secondary}`}>
            {["Home", "About", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`${item === "Home" ? "/" : item.toLowerCase()}`}
                  className="hover:font-semibold transition-all duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div className="text-center sm:text-left">
          <h4 className={`font-bold text-lg mb-4 ${Colors.text.primary}`}>
            Legal
          </h4>
          <ul className={`space-y-2 ${Colors.text.secondary}`}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:font-semibold transition-all duration-200"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center sm:text-left">
          <h4 className={`font-bold text-lg mb-4 ${Colors.text.primary}`}>
            Contact
          </h4>
          <ul className={`space-y-2 ${Colors.text.secondary}`}>
            <li>
              Email:{" "}
              <a
                href="mailto:info@bitwise.com"
                className="hover:font-semibold transition-all duration-200"
              >
                info@Bitwise.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+919779935714"
                className="hover:font-semibold transition-all duration-200"
              >
                +91 9779935714
              </a>
            </li>
            <li>Address: #2147 Green St., Dhakoli</li>
          </ul>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div
        className={`mt-8 pt-3 border-t ${Colors.background.primary} text-center text-sm ${Colors.text.secondary}`}
      >
        &copy; {new Date().getFullYear()} Bitwise Learn. All rights reserved.
      </div>
    </footer>
  );
}
