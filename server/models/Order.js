import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: 'Default' },
  size: { type: String, default: 'Default' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },

    products: {
      type: [productSchema],
      required: true,
      validate: {
        validator: function(products) {
          return products && products.length > 0;
        },
        message: 'At least one product is required'
      }
    },

    totalAmount: { 
      type: Number, 
      required: true,
      min: 0
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'COD',
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },

    deliveryStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },

    razorpayPaymentId: {
      type: String,
      default: null
    },
    
    phoneNumber : {
      type:String,
    },

    razorpayOrderId: {
      type: String,
      default: null
    },

    orderedAt: {
      type: Date,
      default: Date.now,
    },

    deliveredAt: {
      type: Date,
      default: null
    },

    // Track order updates
    statusHistory: [{
      status: String,
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
  },
  { 
    timestamps: true,
    // Add indexes for better query performance
    indexes: [
      { user: 1, orderedAt: -1 },
      { deliveryStatus: 1 },
      { paymentStatus: 1 }
    ]
  }
);

// Pre-save middleware to track status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('deliveryStatus') && !this.isNew) {
    this.statusHistory.push({
      status: this.deliveryStatus,
      updatedAt: new Date()
    });
  }
  next();
});

// Calculate total from products if not provided
orderSchema.pre('save', function(next) {
  if (!this.totalAmount || this.totalAmount === 0) {
    this.totalAmount = this.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }
  next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.orderedAt) / (1000 * 60 * 60 * 24));
});

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['Processing', 'Shipped'].includes(this.deliveryStatus);
};

// Static method to get orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ deliveryStatus: status });
};

const Order = mongoose.model('Order', orderSchema);

export default Order;