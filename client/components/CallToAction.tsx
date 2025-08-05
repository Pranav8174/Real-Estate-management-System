import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of users who trust EstateHub for their real estate needs. 
          Sign up today and start your journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="min-w-[200px]">
              Join as Buyer
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="min-w-[200px] text-white border-white hover:bg-white hover:text-primary">
              Join as Seller
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}