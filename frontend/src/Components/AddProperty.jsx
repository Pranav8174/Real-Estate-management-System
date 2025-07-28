import React, { useState } from 'react';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description:"",
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Please upload an image.");
  
    try {
      const imageData = new FormData();
      imageData.append("file", formData.image);
      imageData.append("upload_preset", "property_uploads"); 
  
      const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dz5ozjmjc/image/upload", {
        method: "POST",
        body: imageData,
      });
  
      if (!uploadRes.ok) throw new Error("Image upload failed");
  
      const uploadData = await uploadRes.json();
      console.log("Cloudinary Upload Response:", uploadData);
      const imageUrl = uploadData.secure_url; 
  
      const propertyData = {
        title: formData.title,
        location: formData.location,
        price: formData.price,
        description:formData.description,
        image:imageUrl, 
      };
  
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/data/addProperty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });
  
      if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);
  
      alert("Property added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload image or add property.");
    }
  };
  
  return (
    <div style={{width:'100vw'}}>
      <h1 style={{textAlign:'center'}}>Add Property Details</h1>
    <form onSubmit={handleSubmit} className="property-form">
      <input
        type="text"
        name="title"
        placeholder="Property Title"
        value={formData.title}
        onChange={handleChange}
        className="input-title"
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Property Description"
        value={formData.description}
        onChange={handleChange}
        className="input-description"
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="input-location"
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="input-price"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="input-image"
        required
      />
      <button type="submit" className="submit-button">
        Add Property
      </button>
    </form>
    </div>
  );
};

export default AddProperty;
