import { Link } from "react-router-dom";
import { Home, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">EstateHub</span>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              Your trusted partner in real estate. We help you find the perfect property 
              and make your real estate dreams come true.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@estatehub.com</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/properties" className="hover:text-primary transition-colors">Browse Properties</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">Buy Property</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sell Property</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rent Property</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Property Management</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 mt-12 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2024 EstateHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}