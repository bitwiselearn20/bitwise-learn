import { Facebook, X, Instagram, Linkedin } from "lucide-react";

const colors = {
  primary_Bg: "bg-[#121313]",
  secondary_Bg: "bg-[#1E1E1E]",
  primary_Hero: "bg-[#129274]",
  primary_Hero_Faded: "bg-[rgb(18, 146, 116, 0.24)]",
  secondary_Hero: "bg-[#64ACFF]",
  secondary_Hero_Faded: "bg-[rgb(100, 172, 255, 0.56)]",
  primary_Font: "text-[#FFFFFF]",
  secondary_Font: "text-[#B1AAA6]",
  special_Font: "text-[#64ACFF]",
  accent: "#B1AAA6",
  accent_Faded: "bg-[rgb(177, 170, 166, 0.41)]",
  primary_Icon: "white",
  secondary_Icon: "black",
  special_Icon: "#64ACFF",

  border: "border-t border-[#B1AAA6]",
};

export default function Footer() {
  return (
    <footer
      className={`${colors.secondary_Bg} ${colors.border} backdrop-blur-lg py-8 px-6 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info & Social Media */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <a href="#">
            <img
              src="a"
              alt="Bitwise Logo"
              className="h-10 mb-4 transition-transform hover:scale-105"
            />
          </a>
          <p className={`text-sm max-w-62.5 mb-4 ${colors.special_Font}`}>
            Learn, Code, Grow.
          </p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className={`transition-colors`}>
              <Facebook color="white" size={22} />
            </a>
            <a href="#" aria-label="X" className={`transition-colors`}>
              <X color="white" size={22} />
            </a>
            <a href="#" aria-label="Instagram" className={`transition-colors`}>
              <Instagram color="white" size={22} />
            </a>
            <a href="#" aria-label="LinkedIn" className={`transition-colors`}>
              <Linkedin color="white" size={22} />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center sm:text-left">
          <h4 className={`font-bold text-lg mb-4 ${colors.primary_Font}`}>
            Quick Links
          </h4>
          <ul className={`space-y-2 ${colors.secondary_Font}`}>
            {["Home", "About Us", "Groups", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
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
          <h4 className={`font-bold text-lg mb-4 ${colors.primary_Font}`}>
            Legal
          </h4>
          <ul className={`space-y-2 ${colors.secondary_Font}`}>
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
          <h4 className={`font-bold text-lg mb-4 ${colors.primary_Font}`}>
            Contact
          </h4>
          <ul className={`space-y-2 ${colors.secondary_Font}`}>
            <li>
              Email:{" "}
              <a
                href="mailto:info@Bitwise.com"
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
        className={`mt-8 pt-3 border-t ${colors.secondary_Bg} text-center text-sm ${colors.secondary_Font}`}
      >
        &copy; {new Date().getFullYear()} Bitwise Learn. All rights reserved.
      </div>
    </footer>
  );
}
