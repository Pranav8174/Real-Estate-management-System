import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="text-center">
        <div className="mb-8">
          <Home className="h-24 w-24 text-primary mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">
            If you think this is a mistake, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
