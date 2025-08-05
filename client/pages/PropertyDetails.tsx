import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  seller: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'available' | 'sold' | 'pending';
  createdAt: string;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        setProperty(data.property);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return <div className="p-4">Loading property details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
          <p className="text-muted-foreground">{property.location}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-2xl font-bold">${property.price.toLocaleString()}</div>
          <p>{property.description}</p>
          <div>Area: {property.area} sqft</div>
          <div>Bedrooms: {property.bedrooms}</div>
          <div>Bathrooms: {property.bathrooms}</div>
          <div>Status: {property.status}</div>
          <div className="mt-4">
            <h3 className="font-semibold">Seller Info</h3>
            <p>{property.seller.name}</p>
            <p>{property.seller.email}</p>
            {property.seller.phone && (
              <p>
                <a href={`tel:${property.seller.phone}`} className="text-blue-600 underline">
                  {property.seller.phone}
                </a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
