import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Search, MapPin, Bed, Bath, Maximize, LogOut, Phone, Mail, Image, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  amenities: string[];
  images?: string[];
  seller: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'available' | 'sold' | 'pending';
  createdAt: string;
}

export default function BuyerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [imageModal, setImageModal] = useState<{ show: boolean; images: string[]; currentIndex: number }>({
    show: false,
    images: [],
    currentIndex: 0
  });
  const [imageHover, setImageHover] = useState<{ [key: string]: number }>({});
  const { user, logout, token } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, priceRange, propertyType]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (priceRange) {
      filtered = filtered.filter(property => {
        switch (priceRange) {
          case 'under-500k': return property.price < 500000;
          case '500k-1m': return property.price >= 500000 && property.price < 1000000;
          case '1m-2m': return property.price >= 1000000 && property.price < 2000000;
          case 'over-2m': return property.price >= 2000000;
          default: return true;
        }
      });
    }
    if (propertyType) {
      filtered = filtered.filter(property => property.propertyType === propertyType);
    }
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange("");
    setPropertyType("");
  };

  const handleImageClick = (images: string[], index: number = 0) => {
    setImageModal({ show: true, images, currentIndex: index });
  };

  const nextImage = () => {
    setImageModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setImageModal(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  const handleImageHover = (propertyId: string, imageIndex: number) => {
    setImageHover(prev => ({ ...prev, [propertyId]: imageIndex }));
  };

  // Razorpay payment handler
  const handleBuyNow = async (property: Property) => {
  await loadRazorpayScript();

  // 1. Create order from backend
  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      amount: property.price * 100, // amount in paise
      currency: 'INR'
    })
  });

  if (!res.ok) {
    alert('Failed to initiate payment. Please try again.');
    return;
  }

  const order = await res.json();

  // 2. Open Razorpay checkout with order id
  const options = {
    key: "rzp_test_MgZsxGDWZ2gI81", // Use env or fallback
    amount: property.price * 100,
    currency: "INR",
    name: "EstateHub",
    description: `Buy ${property.title}`,
    image: "https://estatehub.com/logo.png",
    order_id: order.id, // <-- Use order id from backend
    handler: function (response: any) {
      alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      // Optionally, confirm purchase with backend here
    },
    method: {
      upi: true,  // This may show UPI if supported
    },
    prefill: {
      name: user?.name || "",
      email: user?.email || "",
    },
    theme: {
      color: "#6366f1",
    },
  };
  // @ts-ignore
  const rzp = new window.Razorpay(options);
  rzp.open();
};

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-primary">
                <Home className="h-8 w-8" />
                <span className="text-2xl font-bold">EstateHub</span>
              </Link>
              <span className="text-muted-foreground">/ Buyer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Properties</h1>
          <p className="text-muted-foreground">
            Discover your dream property from our extensive collection
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500k">Under $500K</SelectItem>
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="over-2m">Over $2M</SelectItem>
                </SelectContent>
              </Select>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading properties...</div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clearing filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProperties.length} of {properties.length} properties
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property._id} className="hover:shadow-lg transition-shadow group overflow-hidden">
                  {/* Property Images Section */}
                  <div className="relative h-48 overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <>
                        <img 
                          src={property.images[imageHover[property._id] || 0]} 
                          alt={property.title}
                          className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                          onClick={() => handleImageClick(property.images!, imageHover[property._id] || 0)}
                        />
                        {/* Image Navigation Dots */}
                        {property.images.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {property.images.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  (imageHover[property._id] || 0) === index 
                                    ? 'bg-white' 
                                    : 'bg-white/50'
                                }`}
                                onMouseEnter={() => handleImageHover(property._id, index)}
                              />
                            ))}
                          </div>
                        )}
                        {/* Image Count Badge */}
                        {property.images.length > 1 && (
                          <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                            {property.images.length} photos
                          </Badge>
                        )}
                        {/* Property Type Badge */}
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 left-2 bg-white/90 text-gray-800 capitalize"
                        >
                          {property.propertyType}
                        </Badge>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No images available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-1">{property.title}</CardTitle>
                        <div className="flex items-center text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{property.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-primary">
                        ${property.price.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {property.description}
                      </p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          {property.bedrooms && (
                            <div className="flex items-center">
                              <Bed className="h-3 w-3 mr-1" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <Bath className="h-3 w-3 mr-1" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Maximize className="h-3 w-3 mr-1" />
                            <span>{property.area} sqft</span>
                          </div>
                        </div>
                      </div>
                      {property.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {property.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{property.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="border-t pt-4">
                        <div className="text-sm text-muted-foreground mb-3">
                          <span className="font-medium">Seller:</span> {property.seller.name}
                        </div>
                        <div className="flex space-x-2">
                          <Link to={`/property/${property._id}`} className="flex-1">
                            <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                              View Details
                            </Button>
                          </Link>
                          {property.seller.phone && (
                            <a href={`tel:${property.seller.phone}`} className="flex-1">
                              <Button size="sm" variant="outline" className="flex items-center w-full">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            </a>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => handleBuyNow(property)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Image Modal */}
      {imageModal.show && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setImageModal({ show: false, images: [], currentIndex: 0 })}
            >
              <X className="h-6 w-6" />
            </Button>
            {/* Previous Button */}
            {imageModal.images.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}
            {/* Image */}
            <img
              src={imageModal.images[imageModal.currentIndex]}
              alt="Property"
              className="max-w-full max-h-full object-contain"
            />
            {/* Next Button */}
            {imageModal.images.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
            {/* Image Counter */}
            {imageModal.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                {imageModal.currentIndex + 1} of {imageModal.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}