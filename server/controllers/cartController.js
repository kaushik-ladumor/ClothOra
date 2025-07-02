import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
  res.json(cart || { items: [] });
}

export const addCart =async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

  const existing = cart.items.find(item => item.productId.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
}


export const removeCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
}


export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.id });
  res.json({ message: "Cart cleared" });
}


export const totalDetail = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    
    if (!cart) {
      return res.json({ total: 0 });
    }

    const total = cart.items.reduce((sum, item) => {
      if (!item.productId || !item.productId.price) {
        console.warn('Invalid product data for item:', item);
        return sum;
      }
      return sum + (item.productId.price * item.quantity);
    }, 0);

    res.json({ total });
  } catch (err) {
    console.error('Error calculating cart total:', err);
    res.status(500).json({ 
      message: 'Error calculating cart total',
      error: err.message 
    });
  }
}