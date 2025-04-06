
import { Link } from "react-router-dom";
import { BookOpen, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-playbook-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-playbook-primary" />
              <span className="font-heading text-2xl font-extrabold text-playbook-primary">
                PlayBook
              </span>
            </div>
            <p className="text-sm text-playbook-text">
              The ultimate social platform for youth athletes in basketball and volleyball.
              Train better. Play together. Grow stronger.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-playbook-primary hover:text-playbook-accent" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-playbook-primary hover:text-playbook-accent" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-playbook-primary hover:text-playbook-accent" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-playbook-primary hover:text-playbook-accent" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="hover:text-playbook-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-playbook-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/teams" className="hover:text-playbook-primary transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/workouts" className="hover:text-playbook-primary transition-colors">
                  Workouts
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-playbook-primary transition-colors">
                  Matchmaking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-playbook-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-playbook-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-playbook-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-playbook-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-playbook-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-playbook-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-playbook-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-playbook-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-playbook-neutral text-sm text-center">
          <p>&copy; {new Date().getFullYear()} PlayBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
