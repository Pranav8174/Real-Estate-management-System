import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";

const featuredProperties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    price: 1250000,
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    tag: "Luxury"
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    price: 890000,
    location: "Manhattan, NY",
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    tag: "Featured"
  },
  {
    id: 3,
    title: "Cozy Family Home",
    price: 445000,
    location: "Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    tag: "Hot Deal"
  }
];

export default function FeaturedProperties() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show Header only on property routes
  const showHeader =
    location.pathname.startsWith("/properties") ||
    location.pathname.startsWith("/property") || location.pathname.startsWith("/featured-properties");

  // Show popup for both actions
  const handleViewDetails = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowPopup(true);
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handlePopupYes = () => {
    setShowPopup(false);
    navigate("/login");
  };

  const handlePopupNo = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-background">      {showHeader && <Header />}
    <section className="py-20 bg-secondary/30">
     
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked properties that offer the best value and location
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {property.tag}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">{property.location}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{property.title}</h3>
                <div className="text-2xl font-bold text-primary mb-4">
                  ${property.price.toLocaleString()}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} sqft</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={handleViewDetails}
                >
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/properties" onClick={handleViewAll}>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View All Properties
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-lg font-semibold mb-2 text-primary">Sorry, you have to login first!</h3>
              <p className="text-muted-foreground mb-4">Do you want to go to the login page?</p>
              <div className="flex justify-center gap-4 mt-4">
                <Button onClick={handlePopupYes} className="bg-primary text-white">Yes</Button>
                <Button onClick={handlePopupNo} variant="outline">No</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}