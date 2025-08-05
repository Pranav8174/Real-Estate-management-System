import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, Plus, Loader2, AlertCircle, Upload, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    amenities: ""
  });
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmxznaplt';
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ShowCaseX';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Validate file count
    if (files.length > 10) {
      setError("You can upload a maximum of 10 images");
      return;
    }

    // Validate file types and sizes
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setError("Please select only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Each image must be less than 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) return;

    setSelectedImages(files);
    setError("");

    // Create preview URLs
    const previewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const removeImage = (index: number) => {
    if (!selectedImages) return;

    const filesArray = Array.from(selectedImages);
    filesArray.splice(index, 1);

    // Create new FileList
    const dt = new DataTransfer();
    filesArray.forEach(file => dt.items.add(file));
    setSelectedImages(dt.files);

    // Update preview
    const newPreview = [...imagePreview];
    URL.revokeObjectURL(newPreview[index]); // Clean up memory
    newPreview.splice(index, 1);
    setImagePreview(newPreview);
  };

 const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'properties');

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Cloudinary upload failed:", result);
      throw new Error(result.error?.message || 'Failed to upload image to Cloudinary');
    }

    return result.secure_url;
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error.message || error);
    throw new Error(error.message || 'An unexpected error occurred while uploading to Cloudinary');
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let imageUrls: string[] = [];

      // Upload images to Cloudinary if any are selected
      if (selectedImages && selectedImages.length > 0) {
        setUploadingImages(true);
        const uploadPromises = Array.from(selectedImages).map(file => uploadToCloudinary(file));
        imageUrls = await Promise.all(uploadPromises);
        setUploadingImages(false);
      }

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        area: parseFloat(formData.area),
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
        images: imageUrls
      };

      const response = await fetch('/api/seller/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create property');
      }

      // Clean up preview URLs
      imagePreview.forEach(url => URL.revokeObjectURL(url));

      navigate('/seller/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-primary">
              <Home className="h-8 w-8" />
              <span className="text-2xl font-bold">EstateHub</span>
            </Link>
            <span className="text-muted-foreground">/ Seller Dashboard / Add Property</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link to="/seller/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Plus className="h-6 w-6 mr-2" />
                Add New Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Beautiful Modern Villa"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="500000"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the property features, location benefits, and unique selling points..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleSelectChange('propertyType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      placeholder="3"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      placeholder="2"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sqft) *</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      placeholder="2500"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <Input
                    id="amenities"
                    name="amenities"
                    placeholder="Pool, Garage, Garden, AC (separate with commas)"
                    value={formData.amenities}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter amenities separated by commas
                  </p>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <Label>Property Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="images" className="cursor-pointer">
                          <div className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80">
                            <Upload className="h-4 w-4" />
                            <span>Choose images or drag and drop</span>
                          </div>
                        </Label>
                        <Input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-sm text-muted-foreground">
                          Upload up to 10 images (max 5MB each)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Images ({imagePreview.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <Badge
                              variant="secondary"
                              className="absolute bottom-1 left-1 text-xs bg-black/70 text-white"
                            >
                              {index + 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90" 
                    disabled={isLoading || uploadingImages}
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading Images...
                      </>
                    ) : isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Property...
                      </>
                    ) : (
                      'Create Property'
                    )}
                  </Button>
                  <Link to="/seller/dashboard">
                    <Button type="button" variant="outline" disabled={isLoading || uploadingImages}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}