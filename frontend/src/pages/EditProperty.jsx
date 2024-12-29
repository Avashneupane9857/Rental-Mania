import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../config";
import { useNavigate, useParams } from "react-router-dom";

const EditProperty = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    roomCount: "",
    bathroomCount: "",
    guestCount: "",
    latitude: "",
    longitude: "",
    price: "",
    locationName: "",
    propertyName: "",
    images: null,
  });
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `${backendUrl}/property/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const property = response.data.property;
        setFormData({
          title: property.title,
          description: property.description,
          category: property.category,
          roomCount: property.roomCount.toString(),
          bathroomCount: property.bathroomCount.toString(),
          guestCount: property.guestCount.toString(),
          latitude: property.latitude.toString(),
          longitude: property.longitude.toString(),
          price: property.price.toString(),
          locationName: property.locationName,
          propertyName: property.propertyName,
          images: null,
        });
        setExistingImages(property.imageSrc);
      } catch (error) {
        console.error("Error fetching property:", error);
        alert("Error fetching property details");
      }
    };

    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: e.target.files,
    }));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add existing images that weren't removed
    formDataToSend.append("imagesToKeep", JSON.stringify(existingImages));

    // Add new images if any
    if (formData.images) {
      Array.from(formData.images).forEach((file) => {
        formDataToSend.append("images", file);
      });
    }

    try {
      const response = await axios.put(
        `${backendUrl}/property/${propertyId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Property updated successfully!");
        navigate("/hosting/listings");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert(error.response?.data?.msg || "Error updating property");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Property Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... other form fields ... */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Nepal ko BnB"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Welcome to your home away from home!"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Mansion"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rooms</label>
            <input
              type="number"
              name="roomCount"
              value={formData.roomCount}
              onChange={handleInputChange}
              min="1"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bathrooms</label>
            <input
              type="number"
              name="bathroomCount"
              value={formData.bathroomCount}
              onChange={handleInputChange}
              min="1"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Guests</label>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleInputChange}
              min="1"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="28.3949"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="84.1240"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Price per night
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="locationName"
            value={formData.locationName}
            onChange={handleInputChange}
            placeholder="Nepal, KTM"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Property Name
          </label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleInputChange}
            placeholder="Mansion for nepal people"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Existing Images */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Current Images
          </label>
          <div className="grid grid-cols-2 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(imageUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Add New Images
          </label>
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Select new images to add to your listing
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-[#f4656a] text-white py-2 px-4 rounded hover:bg-[#ff5A5F]"
        >
          Update Property Listing
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
