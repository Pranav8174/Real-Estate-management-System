import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Home,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  Calendar,
  LogOut,
  Upload,
  Image,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  status: "available" | "sold" | "pending";
  images?: string[];
  createdAt: string;
}

export default function SellerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState<{
    show: boolean;
    propertyId: string | null;
  }>({ show: false, propertyId: null });
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { user, logout, token } = useAuth();

  const CLOUDINARY_CLOUD_NAME = "dmxznaplt";
  const CLOUDINARY_UPLOAD_PRESET = "ShowCaseX";

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/seller/properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/seller/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p._id !== propertyId));
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "properties");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !uploadModal.propertyId) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(selectedFiles).map((file) => uploadToCloudinary(file));
      const imageUrls = await Promise.all(uploadPromises);

      const response = await fetch(`/api/seller/properties/${uploadModal.propertyId}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ images: imageUrls }),
      });

      if (response.ok) {
        const updatedProperty = await response.json();
        setProperties(properties.map((p) => (p._id === uploadModal.propertyId ? updatedProperty.property : p)));
        setUploadModal({ show: false, propertyId: null });
        setSelectedFiles(null);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (propertyId: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/seller/properties/${propertyId}/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        const updatedProperty = await response.json();
        setProperties(properties.map((p) => (p._id === propertyId ? updatedProperty.property : p)));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              <span className="text-muted-foreground">/ Seller Dashboard</span>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {properties.filter(p => p.status === 'available').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {properties.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {properties.filter(p => p.status === 'sold').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
          <Link to="/seller/add-property">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </Link>
        </div>

        {/* Properties List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first property to the platform
              </p>
              <Link to="/seller/add-property">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Property Images */}
                    {property.images && property.images.length > 0 ? (
                      <div className="relative">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        {property.images.length > 1 && (
                          <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                            +{property.images.length - 1} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    
                    <div className="text-2xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{property.propertyType}</span>
                      <span>{property.area} sqft</span>
                    </div>
                    
                    {property.bedrooms && property.bathrooms && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUploadModal({ show: true, propertyId: property._id })}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteProperty(property._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      {uploadModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Images</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setUploadModal({ show: false, propertyId: null });
                  setSelectedFiles(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Images */}
            {uploadModal.propertyId && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Current Images:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {properties
                    .find(p => p._id === uploadModal.propertyId)
                    ?.images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Property ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteImage(uploadModal.propertyId!, image)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Images (Max 10 images)
                </label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="cursor-pointer"
                />
              </div>

              {selectedFiles && selectedFiles.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedFiles.length} file(s) selected
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={handleImageUpload}
                  disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
                  className="flex-1"
                >
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setUploadModal({ show: false, propertyId: null });
                    setSelectedFiles(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}