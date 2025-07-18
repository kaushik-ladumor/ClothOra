import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Plus,
  Save,
  Eye,
  AlertCircle,
  Check,
  ImageIcon,
  Palette,
  Package,
  DollarSign,
  Tag,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sizes: [],
    colors: [],
    category: "",
    stock: 1,
    imageUrl: "",
  });

  const [priceDisplay, setPriceDisplay] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [colorImages, setColorImages] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [colorImagePreviews, setColorImagePreviews] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentColorInput, setCurrentColorInput] = useState("");
  const [currentSizeInput, setCurrentSizeInput] = useState("");
  const [errors, setErrors] = useState({});

  const mainImageRef = useRef(null);
  const colorImageRefs = useRef({});

  const categories = ["men", "women", "kids"];
  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "All"];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "At least one size is required";
    }

    if (formData.colors.length === 0) {
      newErrors.colors = "At least one color is required";
    }

    if (!mainImage) {
      newErrors.mainImage = "Main image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9.]/g, "");

    setFormData((prev) => ({
      ...prev,
      price: cleanValue,
    }));

    if (cleanValue) {
      const numValue = parseFloat(cleanValue);
      if (!isNaN(numValue)) {
        setPriceDisplay(`₹${numValue.toLocaleString("en-IN")}`);
      } else {
        setPriceDisplay(cleanValue);
      }
    } else {
      setPriceDisplay("");
    }

    if (errors.price) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };

  const handleMainImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          mainImage: "Image size should be less than 1MB",
        }));
        return;
      }
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setMainImagePreview(e.target.result);
      reader.readAsDataURL(file);

      if (errors.mainImage) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.mainImage;
          return newErrors;
        });
      }
    }
  };

  const handleColorImageSelect = (color, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          colorImages: "Image size should be less than 1MB",
        }));
        return;
      }
      setColorImages((prev) => ({
        ...prev,
        [color]: file,
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setColorImagePreviews((prev) => ({
          ...prev,
          [color]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addColor = () => {
    if (!currentColorInput.trim()) {
      setErrors((prev) => ({
        ...prev,
        colorInput: "Please enter a color",
      }));
      return;
    }

    if (formData.colors.includes(currentColorInput.trim().toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        colorInput: "Color already added",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, currentColorInput.trim().toLowerCase()],
    }));
    setCurrentColorInput("");
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.colorInput;
      delete newErrors.colors;
      return newErrors;
    });
  };

  const removeColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color !== colorToRemove),
    }));
    setColorImages((prev) => {
      const newImages = { ...prev };
      delete newImages[colorToRemove];
      return newImages;
    });
    setColorImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[colorToRemove];
      return newPreviews;
    });
  };

  const addSize = () => {
    if (!currentSizeInput.trim()) {
      setErrors((prev) => ({
        ...prev,
        sizeInput: "Please enter a size",
      }));
      return;
    }

    if (formData.sizes.includes(currentSizeInput.trim())) {
      setErrors((prev) => ({
        ...prev,
        sizeInput: "Size already added",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, currentSizeInput.trim()],
    }));
    setCurrentSizeInput("");
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.sizeInput;
      delete newErrors.sizes;
      return newErrors;
    });
  };

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const addSizeFromCommon = (size) => {
    if (formData.sizes.includes(size)) {
      setErrors((prev) => ({
        ...prev,
        sizeInput: "Size already added",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, size],
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.sizeInput;
      delete newErrors.sizes;
      return newErrors;
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      sizes: [],
      colors: [],
      category: "",
      stock: 1,
      imageUrl: "",
    });
    setPriceDisplay("");
    setMainImage(null);
    setColorImages({});
    setMainImagePreview("");
    setColorImagePreviews({});
    setCurrentColorInput("");
    setCurrentSizeInput("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Prepare form data
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("sizes", formData.sizes.join(","));
      submitData.append("colors", formData.colors.join(","));
      submitData.append("category", formData.category);
      submitData.append("stock", formData.stock);

      if (formData.imageUrl) {
        submitData.append("imageUrl", formData.imageUrl);
      }

      // Add main image
      if (mainImage) {
        submitData.append("mainImage", mainImage);
      }

      // Add color images
      formData.colors.forEach((color) => {
        if (colorImages[color]) {
          const colorFile = new File(
            [colorImages[color]],
            `${color}_${colorImages[color].name}`,
            {
              type: colorImages[color].type,
            }
          );
          submitData.append("colorImages", colorFile);
        }
      });

      // Submit to API
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await fetch(`${API_URL}admin/addproduct`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Product added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to add product");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Add New Product
              </h1>
            </div>
            <p className="text-gray-500 text-sm md:text-base">
              Create and manage your product inventory
            </p>
          </div>
        </div>

        {/* Error message for form submission */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price * (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={priceDisplay}
                    onChange={handlePriceChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all`}
                    placeholder="₹0"
                  />
                </div>
                {errors.price ? (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Enter price in Indian Rupees
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-6 h-6 text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Sizes</h2>
            </div>

            {errors.sizes && (
              <p className="mb-4 text-sm text-red-600">{errors.sizes}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {commonSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => addSizeFromCommon(size)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    formData.sizes.includes(size)
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={currentSizeInput}
                  onChange={(e) => setCurrentSizeInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSize())
                  }
                  className={`w-full px-4 py-2 border ${
                    errors.sizeInput ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent`}
                  placeholder="Add custom size"
                />
                {errors.sizeInput && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sizeInput}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.sizes.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Colors</h2>
            </div>

            {errors.colors && (
              <p className="mb-4 text-sm text-red-600">{errors.colors}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={currentColorInput}
                  onChange={(e) => setCurrentColorInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addColor())
                  }
                  className={`w-full px-4 py-2 border ${
                    errors.colorInput ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent`}
                  placeholder="Add color (e.g., red, blue, green)"
                />
                {errors.colorInput && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.colorInput}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.colors.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-6 h-6 text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Images</h2>
            </div>

            {/* Main Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image *
              </label>
              <div
                className={`border-2 border-dashed ${
                  errors.mainImage ? "border-red-500" : "border-gray-300"
                } rounded-lg p-6 text-center hover:border-gray-400 transition-colors`}
              >
                <input
                  type="file"
                  ref={mainImageRef}
                  onChange={handleMainImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                {mainImagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={mainImagePreview}
                      alt="Main preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImage(null);
                        setMainImagePreview("");
                      }}
                      className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => mainImageRef.current?.click()}
                    className="cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-800">Click to upload main image</p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG up to 1MB
                    </p>
                  </div>
                )}
              </div>
              {errors.mainImage && (
                <p className="mt-1 text-sm text-red-600">{errors.mainImage}</p>
              )}
            </div>

            {/* Color Images */}
            {formData.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Color-specific Images
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {formData.colors.map((color) => (
                    <div
                      key={color}
                      className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-medium text-gray-800 capitalize">
                          {color}
                        </span>
                      </div>
                      <input
                        type="file"
                        ref={(el) => (colorImageRefs.current[color] = el)}
                        onChange={(e) => handleColorImageSelect(color, e)}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-gray-400 transition-colors">
                        {colorImagePreviews[color] ? (
                          <div className="relative">
                            <img
                              src={colorImagePreviews[color]}
                              alt={`${color} preview`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setColorImages((prev) => {
                                  const newImages = { ...prev };
                                  delete newImages[color];
                                  return newImages;
                                });
                                setColorImagePreviews((prev) => {
                                  const newPreviews = { ...prev };
                                  delete newPreviews[color];
                                  return newPreviews;
                                });
                              }}
                              className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-700 text-xs"
                            >
                              <X className="w-2 h-2" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() =>
                              colorImageRefs.current[color]?.click()
                            }
                            className="cursor-pointer hover:bg-gray-50 rounded py-2 transition-colors"
                          >
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-800">Upload</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-medium transition-all ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Add Product
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
