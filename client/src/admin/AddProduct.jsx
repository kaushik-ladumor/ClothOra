import React, { useState } from "react";
import { Upload, X, Camera, Loader2 } from "lucide-react";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    sizes: "",
    colors: "",
    category: "men",
    stock: 1,
    imageUrl: "",
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [colorImages, setColorImages] = useState({});
  const [colorImagePreviews, setColorImagePreviews] = useState({});
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingColors, setUploadingColors] = useState({});
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Title is required";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (!product.price || Number(product.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!product.sizes.trim())
      newErrors.sizes = "At least one size is required";
    if (!product.colors.trim())
      newErrors.colors = "At least one color is required";
    if (!mainImageFile && !product.imageUrl.trim()) 
      newErrors.image = "Main image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle main image file selection
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      setProduct(prev => ({ ...prev, imageUrl: "" })); // Clear URL input
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  // Handle color-specific image uploads
  const handleColorImageChange = (colorName, file) => {
    if (file) {
      setColorImages(prev => ({ ...prev, [colorName]: file }));
      const previewUrl = URL.createObjectURL(file);
      setColorImagePreviews(prev => ({ ...prev, [colorName]: previewUrl }));
    }
  };

  // Upload single image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:8080/admin/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    return result.imageUrl;
  };

  // Upload main image
  const uploadMainImage = async () => {
    if (!mainImageFile) return product.imageUrl;
    
    setUploadingMain(true);
    try {
      const imageUrl = await uploadImage(mainImageFile);
      setProduct(prev => ({ ...prev, imageUrl }));
      return imageUrl;
    } catch (error) {
      console.error('Error uploading main image:', error);
      throw error;
    } finally {
      setUploadingMain(false);
    }
  };

  // Upload color images
  const uploadColorImages = async () => {
    const uploadedImages = {};
    const colorNames = Object.keys(colorImages);
    
    for (const colorName of colorNames) {
      setUploadingColors(prev => ({ ...prev, [colorName]: true }));
      try {
        const imageUrl = await uploadImage(colorImages[colorName]);
        uploadedImages[colorName.toLowerCase()] = imageUrl;
      } catch (error) {
        console.error(`Error uploading image for ${colorName}:`, error);
      } finally {
        setUploadingColors(prev => ({ ...prev, [colorName]: false }));
      }
    }
    
    return uploadedImages;
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview("");
    setProduct(prev => ({ ...prev, imageUrl: "" }));
  };

  const removeColorImage = (colorName) => {
    setColorImages(prev => {
      const updated = { ...prev };
      delete updated[colorName];
      return updated;
    });
    setColorImagePreviews(prev => {
      const updated = { ...prev };
      delete updated[colorName];
      return updated;
    });
  };

  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      price: "",
      sizes: "",
      colors: "",
      category: "men",
      stock: 1,
      imageUrl: "",
    });
    setMainImageFile(null);
    setMainImagePreview("");
    setColorImages({});
    setColorImagePreviews({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Upload images first
      let finalImageUrl = product.imageUrl;
      if (mainImageFile) {
        finalImageUrl = await uploadMainImage();
      }

      const uploadedColorImages = await uploadColorImages();

      // Prepare form data for product creation
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('sizes', product.sizes);
      formData.append('colors', product.colors);
      formData.append('category', product.category);
      formData.append('stock', product.stock);
      
      if (finalImageUrl) {
        formData.append('imageUrl', finalImageUrl);
      }

      // Add main image file if exists
      if (mainImageFile) {
        formData.append('mainImage', mainImageFile);
      }

      // Add color images
      Object.entries(colorImages).forEach(([colorName, file]) => {
        formData.append('colorImages', file, `${colorName}_${file.name}`);
      });

      const res = await fetch("http://localhost:8080/admin/addproduct", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      console.log("Product added:", result);
      setSubmitSuccess(true);
      resetForm();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding product:", err);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to add product. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = product.colors
    .split(",")
    .map(c => c.trim())
    .filter(c => c);

  return (
    <div className="min-h-screen bg-[#2B2B2B] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#D4D4D4]">
          Add New Product
        </h1>

        <div className="bg-[#383838] rounded-xl shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Status Messages */}
            {submitSuccess && (
              <div className="p-4 bg-green-900/50 border border-green-600 text-green-200 rounded-lg mb-4">
                Product added successfully!
              </div>
            )}

            {errors.submit && (
              <div className="p-4 bg-red-900/50 border border-red-600 text-red-200 rounded-lg mb-4">
                {errors.submit}
              </div>
            )}

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#D4D4D4] mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="name"
                  placeholder="Product Title"
                  value={product.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg bg-[#2B2B2B] border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4] ${
                    errors.name ? "border-red-500" : "border-[#444]"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Price Field */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-[#D4D4D4] mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]">
                    $
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-4 py-2 rounded-lg bg-[#2B2B2B] border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4] ${
                      errors.price ? "border-red-500" : "border-[#444]"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-400">{errors.price}</p>
                )}
              </div>

              {/* Sizes Field */}
              <div>
                <label htmlFor="sizes" className="block text-sm font-medium text-[#D4D4D4] mb-1">
                  Sizes (comma separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sizes"
                  name="sizes"
                  placeholder="S, M, L, XL"
                  value={product.sizes}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg bg-[#2B2B2B] border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4] ${
                    errors.sizes ? "border-red-500" : "border-[#444]"
                  }`}
                />
                {errors.sizes && (
                  <p className="mt-1 text-sm text-red-400">{errors.sizes}</p>
                )}
              </div>

              {/* Colors Field */}
              <div>
                <label htmlFor="colors" className="block text-sm font-medium text-[#D4D4D4] mb-1">
                  Colors (comma separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="colors"
                  name="colors"
                  placeholder="Red, Blue, Green"
                  value={product.colors}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg bg-[#2B2B2B] border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4] ${
                    errors.colors ? "border-red-500" : "border-[#444]"
                  }`}
                />
                {errors.colors && (
                  <p className="mt-1 text-sm text-red-400">{errors.colors}</p>
                )}
              </div>

              {/* Stock Field */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-[#D4D4D4] mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Stock Quantity"
                  min="1"
                  value={product.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#2B2B2B] border border-[#444] focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4]"
                />
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#D4D4D4] mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#2B2B2B] border border-[#444] focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4]"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#D4D4D4] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Product description..."
                rows="4"
                value={product.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg bg-[#2B2B2B] border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4] ${
                  errors.description ? "border-red-500" : "border-[#444]"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[#D4D4D4] mb-1">
                Main Image <span className="text-red-500">*</span>
              </label>
              
              {/* Image Upload or URL Input */}
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#444] rounded-lg cursor-pointer bg-[#2B2B2B] hover:bg-[#363636] transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-[#B3B3B3]" />
                      <p className="mb-2 text-sm text-[#B3B3B3]">
                        <span className="font-semibold">Click to upload</span> main image
                      </p>
                      <p className="text-xs text-[#888]">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleMainImageChange}
                    />
                  </label>
                </div>

                {/* OR separator */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-[#444]"></div>
                  <span className="px-3 text-[#B3B3B3] text-sm">OR</span>
                  <div className="flex-1 border-t border-[#444]"></div>
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={product.imageUrl}
                  onChange={handleChange}
                  disabled={!!mainImageFile}
                  className={`w-full px-4 py-2 rounded-lg bg-[#2B2B2B] border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-[#D4D4D4] ${
                    errors.image ? "border-red-500" : "border-[#444]"
                  } ${mainImageFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>

              {errors.image && (
                <p className="mt-1 text-sm text-red-400">{errors.image}</p>
              )}

              {/* Image Preview */}
              {(mainImagePreview || product.imageUrl) && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={mainImagePreview || product.imageUrl}
                    alt="Main product preview"
                    className="w-32 h-32 object-cover rounded-lg border border-[#444]"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=Invalid+Image";
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {uploadingMain && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Color-specific Images */}
            {colors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#D4D4D4] flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Images by Color (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colors.map((color, i) => {
                    const colorKey = color.toLowerCase();
                    const isUploading = uploadingColors[color];
                    
                    return (
                      <div key={i} className="bg-[#2B2B2B] p-4 rounded-lg border border-[#444]">
                        <label className="block text-sm font-medium text-[#D4D4D4] mb-2 capitalize">
                          {color} Image
                        </label>
                        
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#555] rounded-lg cursor-pointer bg-[#383838] hover:bg-[#404040] transition">
                          <div className="flex flex-col items-center justify-center py-2">
                            <Upload className="w-6 h-6 mb-1 text-[#B3B3B3]" />
                            <p className="text-xs text-[#B3B3B3]">Upload {color} image</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleColorImageChange(color, e.target.files[0])}
                          />
                        </label>

                        {colorImagePreviews[color] && (
                          <div className="mt-3 relative inline-block">
                            <img
                              src={colorImagePreviews[color]}
                              alt={`${color} preview`}
                              className="w-20 h-20 object-cover rounded border border-[#555]"
                            />
                            <button
                              type="button"
                              onClick={() => removeColorImage(color)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {isUploading && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || uploadingMain || Object.values(uploadingColors).some(Boolean)}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                  isSubmitting || uploadingMain || Object.values(uploadingColors).some(Boolean)
                    ? "bg-yellow-600/70 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#383838]"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Processing...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;