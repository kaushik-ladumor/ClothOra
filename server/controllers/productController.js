import Product from '../models/Product.js';

export const allproduct = async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products);                   
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const productDetail = async (req, res) => {
  try {
    const { id } = req.params; // ✅ CORRECT destructuring
    const product = await Product.findById(id); // ✅ Not { id }
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Server error" });
  }
}