import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b border-border bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">EstateHub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/featured-properties" className="text-foreground hover:text-primary transition-colors">Properties</Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden md:flex">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}