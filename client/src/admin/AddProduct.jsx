import React, { useState, useEffect } from "react";
import { Upload, X, Camera, Loader2, CheckCircle, AlertCircle, FileImage } from "lucide-react";

// Notification Toast Component
const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show, onClose]);

  if (!notification.show) return null;

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-md w-full transition-all duration-300 ${
      notification.show ? 'animate-fade-in-up' : 'animate-fade-out-up'
    }`}>
      <div className={`p-4 rounded-lg shadow-lg border-l-4 flex items-start ${
        notification.type === 'success' 
          ? 'bg-[#2B2B2B] border-green-500 text-[#FFFFFF]' 
          : 'bg-[#2B2B2B] border-red-500 text-[#FFFFFF]'
      }`}>
        <div className="flex-shrink-0 pt-0.5">
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className="font-medium">{notification.message}</p>
          <p className="text-sm text-[#B3B3B3] mt-1">
            {notification.type === 'success' ? 'Product has been added successfully' : 'Please check your inputs'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:bg-[#FFFFFF]/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Form Input Component
const FormInput = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  prefix,
  min,
  step,
  className = ""
}) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-[#2B2B2B] mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] text-sm font-medium">
          {prefix}
        </span>
      )}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        step={step}
        className={`w-full ${prefix ? 'pl-8' : 'px-3'} py-2 text-sm rounded-lg border transition-all duration-200 focus:outline-none ${
          error 
            ? "border-red-500 focus:ring-1 focus:ring-red-500 bg-[#FFFFFF]" 
            : "border-[#D4D4D4] focus:border-[#2B2B2B] focus:ring-1 focus:ring-[#2B2B2B] bg-[#FFFFFF]"
        }`}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-start">
        <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// Form Textarea Component
const FormTextarea = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  rows = 4,
  className = ""
}) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-[#2B2B2B] mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200 focus:outline-none resize-none ${
        error 
          ? "border-red-500 focus:ring-1 focus:ring-red-500 bg-[#FFFFFF]" 
          : "border-[#D4D4D4] focus:border-[#2B2B2B] focus:ring-1 focus:ring-[#2B2B2B] bg-[#FFFFFF]"
      }`}
    />
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-start">
        <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// Form Select Component
const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  className = ""
}) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-[#2B2B2B] mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4D4D4] focus:border-[#2B2B2B] focus:ring-1 focus:ring-[#2B2B2B] bg-[#FFFFFF] transition-all duration-200 focus:outline-none"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Image Upload Component
const ImageUpload = ({ 
  label, 
  onImageChange, 
  preview, 
  onRemove, 
  error, 
  isUploading,
  required = false
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-[#2B2B2B]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Upload Area */}
      <div className="space-y-2">
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#D4D4D4] rounded-xl cursor-pointer bg-[#FFFFFF] hover:bg-[#F5F5F5] transition-colors duration-200 group">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="p-3 bg-[#F0F0F0] rounded-full mb-3 group-hover:bg-[#E0E0E0] transition-colors">
              <Upload className="w-5 h-5 text-[#B3B3B3]" />
            </div>
            <p className="mb-1 text-sm font-medium text-[#2B2B2B] text-center">
              Click to upload image
            </p>
            <p className="text-xs text-[#B3B3B3]">PNG, JPG, JPEG up to 5MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onImageChange}
          />
        </label>
        {error && (
          <p className="text-xs text-red-500 flex items-start">
            <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex items-center justify-center">
        {preview ? (
          <div className="relative group w-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border border-[#D4D4D4]"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x400?text=Invalid+Image";
              }}
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow"
            >
              <X className="w-3 h-3" />
            </button>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-[#D4D4D4] rounded-xl flex items-center justify-center bg-[#F5F5F5]">
            <div className="text-center p-4">
              <FileImage className="w-8 h-8 text-[#B3B3B3] mx-auto mb-2" />
              <p className="text-xs text-[#B3B3B3] font-medium">Image preview will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Color Image Upload Component
const ColorImageUpload = ({ 
  color, 
  onImageChange, 
  preview, 
  onRemove, 
  isUploading 
}) => (
  <div className="bg-[#F5F5F5] p-3 rounded-lg border border-[#D4D4D4]">
    <label className="block text-xs font-medium text-[#2B2B2B] mb-2 capitalize">
      {color} Variant
    </label>
    
    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#D4D4D4] rounded-lg cursor-pointer bg-[#FFFFFF] hover:bg-[#F5F5F5] transition-colors duration-200 group">
      <div className="flex flex-col items-center justify-center py-2">
        <div className="p-2 bg-[#F0F0F0] rounded-full mb-1 group-hover:bg-[#E0E0E0] transition-colors">
          <Upload className="w-4 h-4 text-[#B3B3B3]" />
        </div>
        <p className="text-xs font-medium text-[#B3B3B3]">Upload {color} image</p>
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => onImageChange(color, e.target.files[0])}
      />
    </label>

    {preview && (
      <div className="mt-2 relative group">
        <img
          src={preview}
          alt={`${color} preview`}
          className="w-full h-24 object-cover rounded-lg border border-[#D4D4D4]"
        />
        <button
          type="button"
          onClick={() => onRemove(color)}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <X className="w-2 h-2" />
        </button>
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          </div>
        )}
      </div>
    )}
  </div>
);

// Section Header Component
const SectionHeader = ({ title }) => (
  <h2 className="text-xl font-bold text-[#2B2B2B] mb-4 flex items-center">
    <div className="w-1 h-6 bg-[#2B2B2B] rounded-full mr-3"></div>
    {title}
  </h2>
);

// Main AddProduct Component
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
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Auto-hide notifications
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  const validate = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (!product.price || Number(product.price) <= 0) newErrors.price = "Valid price is required";
    if (!product.sizes.trim()) newErrors.sizes = "At least one size is required";
    if (!product.colors.trim()) newErrors.colors = "At least one color is required";
    if (!mainImageFile && !product.imageUrl.trim()) newErrors.image = "Main image is required";

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

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image size must be less than 5MB');
        return;
      }
      setMainImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      setProduct(prev => ({ ...prev, imageUrl: "" }));
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  const handleColorImageChange = (colorName, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image size must be less than 5MB');
        return;
      }
      setColorImages(prev => ({ ...prev, [colorName]: file }));
      const previewUrl = URL.createObjectURL(file);
      setColorImagePreviews(prev => ({ ...prev, [colorName]: previewUrl }));
    }
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
    setErrors({});
    showNotification('success', 'Form has been reset');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showNotification('error', 'Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('success', 'Product added successfully!');
      resetForm();
    } catch (err) {
      console.error("Error adding product:", err);
      showNotification('error', 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = product.colors
    .split(",")
    .map(c => c.trim())
    .filter(c => c);

  const categoryOptions = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-6 lg:p-8">
      <NotificationToast 
        notification={notification} 
        onClose={() => setNotification({ show: false, type: '', message: '' })} 
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2B2B2B] mb-2">
            Add New Product
          </h1>
          <p className="text-sm text-[#B3B3B3] max-w-2xl mx-auto">
            Create and manage your store inventory with ease
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#FFFFFF] rounded-xl shadow-md overflow-hidden">
          <div className="p-4 md:p-6 lg:p-8">
            <form onSubmit={handleSubmit}>
              {/* Product Information Section */}
              <div className="mb-8">
                <SectionHeader title="Product Information" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormInput
                    label="Product Name"
                    name="name"
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    className="md:col-span-2"
                  />

                  <FormInput
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={product.price}
                    onChange={handleChange}
                    error={errors.price}
                    required
                    prefix="$"
                    min="0"
                    step="0.01"
                  />

                  <FormInput
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    placeholder="Enter stock quantity"
                    value={product.stock}
                    onChange={handleChange}
                    min="1"
                  />

                  <FormSelect
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categoryOptions}
                  />

                  <FormInput
                    label="Available Sizes"
                    name="sizes"
                    placeholder="e.g., S, M, L, XL, XXL"
                    value={product.sizes}
                    onChange={handleChange}
                    error={errors.sizes}
                    required
                  />

                  <FormInput
                    label="Available Colors"
                    name="colors"
                    placeholder="e.g., Red, Blue, Green, Black"
                    value={product.colors}
                    onChange={handleChange}
                    error={errors.colors}
                    required
                  />

                  <FormTextarea
                    label="Product Description"
                    name="description"
                    placeholder="Describe your product in detail..."
                    value={product.description}
                    onChange={handleChange}
                    error={errors.description}
                    required
                    className="md:col-span-2"
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="mb-8">
                <SectionHeader title="Product Images" />

                {/* Main Image */}
                <div className="mb-6">
                  <ImageUpload
                    label="Main Product Image"
                    onImageChange={handleMainImageChange}
                    preview={mainImagePreview || product.imageUrl}
                    onRemove={removeMainImage}
                    error={errors.image}
                    isUploading={uploadingMain}
                    required
                  />
                </div>

                {/* Color Images */}
                {colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#2B2B2B] mb-3 flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Images by Color (Optional)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {colors.map((color, i) => (
                        <ColorImageUpload
                          key={i}
                          color={color}
                          onImageChange={handleColorImageChange}
                          preview={colorImagePreviews[color]}
                          onRemove={removeColorImage}
                          isUploading={uploadingColors[color]}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#D4D4D4]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 text-sm font-medium text-[#2B2B2B] bg-[#D4D4D4] hover:bg-[#B3B3B3] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#B3B3B3]"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingMain || Object.values(uploadingColors).some(Boolean)}
                  className={`flex-1 py-2 px-6 text-sm font-medium rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 ${
                    isSubmitting || uploadingMain || Object.values(uploadingColors).some(Boolean)
                      ? "bg-[#B3B3B3] cursor-not-allowed"
                      : "bg-[#2B2B2B] hover:bg-[#1A1A1A] focus:ring-[#B3B3B3] shadow-sm"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
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
    </div>
  );
}

export default AddProduct;