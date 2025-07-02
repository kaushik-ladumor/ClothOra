import mongoose from "mongoose";
import initData from './data.js';
import Product from '../models/Product.js'; // Fixed name from 'product' to 'Product'

const MONGO_URI = "mongodb://127.0.0.1:27017/ClothOra"; // Define MONGO_URI

main()
    .then(() => {
        console.log("Connection Successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URI); 
}

const initDB = async () => {
    await Product.deleteMany({});
    await Product.insertMany(initData); // Changed product -> Product, initData.data -> initData
    console.log("Data was initialized");
}

initDB();
