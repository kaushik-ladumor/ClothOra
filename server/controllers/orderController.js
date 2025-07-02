import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const { products, phoneNumber,  totalAmount, shippingAddress, paymentMethod = 'COD' } = req.body;

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid products array is required"
      });
    }

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total amount is required"
      });
    }

    if (
      !shippingAddress ||
      typeof shippingAddress !== 'object' ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address with street, city, state, and postalCode is required"
      });
    }

    // Validate products and build order
    const orderProducts = [];
    let calculatedTotal = 0;

    for (const product of products) {
      const productId = product.productId || product._id;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required for each item"
        });
      }

      const dbProduct = await Product.findById(productId);
      if (!dbProduct) {
        return res.status(400).json({
          success: false,
          message: `Product ${productId} not found`
        });
      }

      const quantity = product.quantity || 1;
      if (dbProduct.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${dbProduct.name}`
        });
      }

      const price = product.price || dbProduct.price;
      const productImage =
        product.image ||
        (dbProduct.images && dbProduct.images[0]) ||
        dbProduct.imageUrl ||
        'https://via.placeholder.com/150';

      calculatedTotal += price * quantity;

      orderProducts.push({
        name: dbProduct.name,
        color: product.color || 'Default',
        size: product.size || 'Default',
        quantity,
        price,
        phoneNumber,
        productId: dbProduct._id,
        image: productImage
      });
    }

    // Allow small floating point mismatch
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Total amount doesn't match calculated amount. Expected ${calculatedTotal}`
      });
    }

    const orderData = {
      user: req.user.id,
      products: orderProducts,
      totalAmount: calculatedTotal,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      deliveryStatus: 'Processing',
      phoneNumber
    };

    console.log("🛒 Creating Order With Data:", orderData);

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    // Decrement stock
    const bulkOps = orderProducts.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity } }
      }
    }));
    await Product.bulkWrite(bulkOps);

    // Link order to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { orders: savedOrder._id }
    });

    console.log(`✅ Order created: ${savedOrder._id} for user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      order: savedOrder,
      message: 'Order created successfully'
    });
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error:
        process.env.NODE_ENV === 'development'
          ? {
              message: err.message,
              stack: err.stack,
              validationErrors: err.errors
            }
          : undefined
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('user', 'name email avatar')
      .populate('products.productId', 'name price images');
      
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify order belongs to the user (unless admin)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized to view this order' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('❌ Error fetching order by ID:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching order' 
    });
  }
};

export const getLatestOrder = async (req, res) => {
  try {
    const latestOrder = await Order.findOne({ user: req.user.id })
      .sort({ orderedAt: -1 })
      .populate('user', 'name email')
      .populate('products.productId', 'name price images');
      
    if (!latestOrder) {
      return res.status(404).json({ 
        success: false,
        message: "No orders found" 
      });
    }

    res.json({
      success: true,
      order: latestOrder
    });
  } catch (err) {
    console.error("❌ Failed to fetch latest order:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching order" 
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user.id };

    if (status) {
      query.deliveryStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ orderedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('products.productId', 'name price images');

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (err) {
    console.error("❌ Error in getAllOrders:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching orders" 
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, isPaid, paymentId } = req.body;

    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify order belongs to the user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized to update this order' 
      });
    }

    // Update payment status
    order.paymentStatus = isPaid ? 'Paid' : 'Failed';
    
    if (paymentId) {
      order.razorpayPaymentId = paymentId;
    }

    // If payment is successful, update delivery status
    if (isPaid) {
      order.deliveryStatus = 'Processing';
    }

    await order.save();
    
    console.log(`✅ Payment status updated for order: ${orderId}`);
    
    res.json({ 
      success: true,
      message: 'Payment status updated successfully', 
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus
      }
    });
  } catch (err) {
    console.error('❌ Failed to update payment status:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating payment status' 
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, userId } = req.query;
    
    const query = {};
    if (status) {
      query.deliveryStatus = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    if (userId) {
      query.user = userId;
    }

    const orders = await Order.find(query)
      .sort({ orderedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email')
      .populate('products.productId', 'name price');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalOrders: total
    });
  } catch (err) {
    console.error('❌ Error in getAllOrdersAdmin:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching orders' 
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(deliveryStatus)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid delivery status' 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Update status and set deliveredAt if status is Delivered
    order.deliveryStatus = deliveryStatus;
    if (deliveryStatus === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    console.log(`✅ Order status updated: ${orderId} -> ${deliveryStatus}`);
    
    res.json({ 
      success: true,
      message: 'Order status updated successfully', 
      order 
    });
  } catch (err) {
    console.error('❌ Failed to update order status:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating order status' 
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Check if order can be cancelled
    if (!['Processing', 'Pending'].includes(order.deliveryStatus)) {
      return res.status(400).json({ 
        success: false,
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Update order status
    order.deliveryStatus = 'Cancelled';
    order.paymentStatus = 'Refunded';
    await order.save();

    // Restore product stock
    for (const product of order.products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: { stock: product.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (err) {
    console.error('❌ Failed to cancel order:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error cancelling order' 
    });
  }
};