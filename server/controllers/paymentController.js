import razorpay from '../config/payment.js';

export const payment = async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  // Validate request
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ 
      success: false,
      message: 'Valid amount is required' 
    });
  }

  // Convert amount to paise (Razorpay expects amount in the smallest currency unit)
  const amountInPaise = Math.round(Number(amount) * 100);

  // Validate minimum amount (Razorpay minimum is 1 INR = 100 paise)
  if (amountInPaise < 100) {
    return res.status(400).json({ 
      success: false,
      message: 'Amount must be at least 1 INR' 
    });
  }

  try {
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1, // auto-capture payment
      notes: {
        userId: req.user.id, // from JWT
        purpose: 'ecommerce-payment'
      }
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      throw new Error('Invalid response from Razorpay');
    }

    console.log(`✓ Payment order created: ${order.id} for ${order.amount} ${order.currency}`);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      created_at: order.created_at,
      key_id: process.env.RAZORPAY_KEY_ID // Send key to frontend
    });

  } catch (err) {
    console.error('❌ Razorpay error:', err);
    
    // Extract meaningful error message
    let errorMessage = 'Payment initiation failed';
    if (err.error?.description) {
      errorMessage = err.error.description;
    } else if (err.message) {
      errorMessage = err.message;
    }

    res.status(500).json({ 
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { error: err })
    });
  }
}

export const verifyPayment =async (req, res) => {
  try {
    const crypto = await import('crypto');
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body.toString();

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature === expectedSignature) {
      const payload = JSON.parse(body);
      
      if (payload.event === 'payment.captured') {
        // Payment successful - update order status
        console.log('✅ Payment captured:', payload.payload.payment.entity);
        // Handle payment success logic here
      }
      
      res.status(200).json({ success: true });
    } else {
      console.log('❌ Invalid signature');
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.status(500).json({ success: false, message: 'Webhook error' });
  }
}