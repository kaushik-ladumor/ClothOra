import Product from "../models/Product.js";
import User from '../models/User.js'
import Order from '../models/Order.js'

export const allProduct = async (req, res) => {
  let products = await Product.find();
  res.json(products);
}


export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sizes,
      colors,
      category,
      stock,
      imageUrl, // fallback for URL input
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, price, or category",
      });
    }

    let finalImageUrl = imageUrl || "";
    let imagesByColor = {};

    // Handle main image upload
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      finalImageUrl = req.files.mainImage[0].path;
    }

    // Handle color-specific images
    if (req.files && req.files.colorImages) {
      const colorArray = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors;
      
      req.files.colorImages.forEach((file, index) => {
        const colorName = file.originalname.split('_')[0]?.toLowerCase(); // Expect format: "red_image.jpg"
        if (colorName && colorArray.includes(colorName)) {
          imagesByColor[colorName] = file.path;
        } else if (colorArray[index]) {
          imagesByColor[colorArray[index].toLowerCase()] = file.path;
        }
      });
    }

    // Parse arrays if they come as strings
    const parsedSizes = typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes;
    const parsedColors = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors;
    const parsedCategory = typeof category === 'string' ? [category] : category;

    const createProduct = await Product.create({
      name,
      description,
      price: Number(price),
      sizes: parsedSizes,
      colors: parsedColors,
      imagesByColor,
      imageUrl: finalImageUrl,
      category: parsedCategory,
      stock: Number(stock) || 1,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: createProduct
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product",
      error: error.message,
    });
  }
}


export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error("❌ Image Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading image",
      error: error.message,
    });
  }
}

export const manyImageUpload =  async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided"
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname
    }));

    res.json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages
    });
  } catch (error) {
    console.error("❌ Images Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading images",
      error: error.message,
    });
  }
}


export const deleteProductCloudinary = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinaryConfig.cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: "Image deleted successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete image"
      });
    }
  } catch (error) {
    console.error("❌ Delete Image Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting image",
      error: error.message,
    });
  }
}

export const stockHendle = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Collect public IDs for Cloudinary deletion
    const imagesToDelete = [];

    // Handle main image (imageUrl)
    if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.includes('cloudinary.com')) {
      const publicId = product.imageUrl.split('/').pop().split('.')[0];
      imagesToDelete.push(publicId);
    }

    // Handle color images (imagesByColor)
    if (product.imagesByColor) {
      Object.values(product.imagesByColor).forEach(imageObj => {
        let imageUrl;

        if (typeof imageObj === 'string') {
          imageUrl = imageObj;
        } else if (typeof imageObj === 'object' && imageObj.url) {
          imageUrl = imageObj.url;
        }

        if (imageUrl && imageUrl.includes('cloudinary.com')) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          imagesToDelete.push(publicId);
        }
      });
    }

    // Delete images from Cloudinary
    if (imagesToDelete.length > 0) {
      try {
        await Promise.all(
          imagesToDelete.map(publicId => 
            cloudinaryConfig.cloudinary.uploader.destroy(`ClothOra/${publicId}`)
          )
        );
      } catch (cloudinaryError) {
        console.warn("⚠️ Some images could not be deleted from Cloudinary:", cloudinaryError);
      }
    }

    // Delete product from MongoDB
    const deletedProduct = await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (err) {
    console.error("❌ Delete Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


export const productCount = async (req, res) => {
  const count = await Product.countDocuments();
  res.json({ count });
}

export const allUser = async (req, res) => {
  let users = await User.find();
  res.json(users);
}


export const userCount = async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
}

export const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (err) {
    console.error("❌ Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


export const orderCount = async (req, res) => {
  const count = await Order.countDocuments();
  res.json({ count });
}

export const allOrder = async (req, res) => {
  try {
    console.log('📋 Fetching all orders with complete user details...');
    
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email phone address createdAt',
        options: { lean: true }
      })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`📊 Found ${orders.length} orders`);
    
    if (orders.length > 0) {
      console.log('📝 Sample order structure:', {
        id: orders[0]._id,
        userId: orders[0].user?._id,
        userName: orders[0].user?.name,
        userEmail: orders[0].user?.email,
        userPhone: orders[0].user?.phone,
        hasShippingAddress: !!orders[0].shippingAddress,
        productsCount: orders[0].products?.length || 0,
        deliveryStatus: orders[0].deliveryStatus,
        paymentStatus: orders[0].paymentStatus
      });
    }
    
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching orders', 
      error: err.message 
    });
  }
}

export const orderUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;

    console.log('🔄 Updating order status:', { id, deliveryStatus });

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!deliveryStatus || !validStatuses.includes(deliveryStatus)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid delivery status. Must be one of: ${validStatuses.join(', ')}`,
        receivedStatus: deliveryStatus
      });
    }

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid order ID format' 
      });
    }

    const updateData = { 
      deliveryStatus: deliveryStatus 
    };

    if (deliveryStatus === 'Delivered') {
      updateData.deliveredAt = new Date();
    }

    if (deliveryStatus !== 'Delivered') {
      updateData.deliveredAt = null;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: false
      }
    ).populate({
      path: 'user',
      select: 'name email phone address'
    });

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    console.log('✅ Order updated successfully:', {
      orderId: updatedOrder._id,
      newStatus: updatedOrder.deliveryStatus,
      deliveredAt: updatedOrder.deliveredAt,
      customerName: updatedOrder.user?.name
    });

    res.json({ 
      success: true,
      message: 'Delivery status updated successfully', 
      order: updatedOrder 
    });

  } catch (err) {
    console.error('❌ Error updating order status:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating order status', 
      error: err.message 
    });
  }
}


export const orderDetail = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$deliveryStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { deliveryStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    console.error('❌ Error fetching order stats:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching order statistics', 
      error: err.message 
    });
  }
}