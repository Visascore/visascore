import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onAdminLogin?: () => void;
}

export function Footer({ onAdminLogin }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 backdrop-blur border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visa Score</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered visa guidance platform helping people navigate UK immigration with confidence and precision.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Support
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-medium">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  AI Visa Assistant
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  CV Optimizer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Eligibility Checker
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Progress Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Action Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Visa Routes */}
          <div className="space-y-4">
            <h4 className="font-medium">Visa Routes</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Global Talent Visa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Skilled Worker Visa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Student Visa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Ancestry Visa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  All Visa Routes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Admin */}
          <div className="space-y-4">
            <h4 className="font-medium">Legal & Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <p>© {currentYear} Visa Score. All rights reserved.</p>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>London, UK</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Social Links */}
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                LinkedIn
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Twitter
              </Button>
            </div>

            {/* Admin Login Link */}
            {onAdminLogin && (
              <div className="flex items-center">
                <Separator orientation="vertical" className="h-6 mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAdminLogin}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> Visa Score provides general information and guidance only. 
            We are not regulated immigration advisers. For complex cases or official advice, 
            please consult with a qualified immigration lawyer or OISC-registered adviser.
          </p>
        </div>
      </div>
    </footer>
  );
}