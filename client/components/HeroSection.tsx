import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <section className="relative h-[70vh] bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Find Your <span className="text-primary">Dream</span> Property
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the perfect home with our comprehensive real estate platform. 
            Buy, sell, or rent properties with confidence and ease.
          </p>
          <Card className="max-w-2xl mx-auto p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search by location, property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90">
                Search Properties
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}