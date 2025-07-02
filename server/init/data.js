const data = [
  {
    name: "Classic Black T-Shirt",
    description: "100% cotton, classic fit t-shirt.",
    price: 3344,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white", "blue", "red"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/71zK5dxxaVL._SX569_.jpg",
      white: "https://m.media-amazon.com/images/I/519NVkqDQmL._SX679_.jpg",
      red: "https://m.media-amazon.com/images/I/81RWZjGCixL._SX569_.jpg",
      blue: "https://m.media-amazon.com/images/I/81kjJZQKdrS._SX569_.jpg"
    },
    stock: 60,
    imageUrl: "https://m.media-amazon.com/images/I/71zK5dxxaVL._SX569_.jpg",
    category: ["men"]
  },
  {
    name: "Formal Shirt",
    description: "Slim fit formal shirt for office wear.",
    price: 1823,
    sizes: ["S", "M", "L", "XL"],
    colors: ["grey", "white", "blue", "red"],
     imagesByColor: {
      grey: "https://m.media-amazon.com/images/I/61CQt2e2EzL._SY741_.jpg",
      white: "https://m.media-amazon.com/images/I/61aDwkW8OvL._SY741_.jpg",
      red: "https://m.media-amazon.com/images/I/61PjxItm1SL._SY741_.jpg",
      blue: "https://m.media-amazon.com/images/I/61wvRlnWJzL._SY741_.jpg"
    },
    stock: 102,
    imageUrl: "https://m.media-amazon.com/images/I/61CQt2e2EzL._SY741_.jpg",
    category: ["men"]
  },
  {
    name: "Hoodie",
    description: "Warm and stylish hoodie for winter.",
    price: 1719,
    sizes: ["S", "M", "L", "XL"],
    colors: ["yellow", "white", "blue", "green"],
     imagesByColor: {
      yellow: "https://m.media-amazon.com/images/I/619DAFGi6dL._SX569_.jpg",
      white: "https://m.media-amazon.com/images/I/51BaWHbbziL._SX569_.jpg",
      green: "https://m.media-amazon.com/images/I/51TMjj-XwAL._SX569_.jpg",
      blue: "https://m.media-amazon.com/images/I/51+FaQjkYVL._SX569_.jpg"
    },
    stock: 42,
    imageUrl: "https://m.media-amazon.com/images/I/51BaWHbbziL._SX569_.jpg",
    category: ["men"]
  },
  {
    name: "Denim Jeans",
    description: "Comfortable blue jeans with a modern cut.",
    price: 4772,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "grey", "blue"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/51tQUQnvRPL._SY741_.jpg",
      grey: "https://m.media-amazon.com/images/I/61EITRMkVTL._SY741_.jpg",
      blue: "https://m.media-amazon.com/images/I/61SRj3IzD1L._SY741_.jpg"
    },
    stock: 91,
    imageUrl: "https://m.media-amazon.com/images/I/61RUZaIxfFL._AC_UL320_.jpg",
    category: ["men"]
  },
  {
    name: "Girls Printed Regular Casual Dress ",
    description: "Easy to dress and easy to wash, it fits perfectly into your little one’s routine while keeping them looking sharp.",
    price: 4529,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "yellow", "blue", "pink"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/61BQOLEdcGL._SY741_.jpg",
      yellow: "https://m.media-amazon.com/images/I/71rmBZOoSNL._SY741_.jpg",
      pink: "https://m.media-amazon.com/images/I/812LrLc7W+L._SY741_.jpg",
      blue: "https://m.media-amazon.com/images/I/71jHk8KdSyL._SY741_.jpg"
    },
    stock: 104,
    imageUrl: "https://m.media-amazon.com/images/I/812LrLc7W+L._SY741_.jpg",
    category: ["kids"]
  },
  {
    name: "Cotton Shorts",
    description: "Casual wear shorts perfect for summer.",
    price: 4033,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white", "blue", "red"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/71k4YzUtD9L._SX569_.jpg",
      white: "https://m.media-amazon.com/images/I/61qMkontR-L._SX569_.jpg",
      red: "https://m.media-amazon.com/images/I/71ItK3XSI-L._SX569_.jpg",
      blue: "https://m.media-amazon.com/images/I/71ZtfaDtmiL._SX569_.jpg"
    },
    stock: 40,
    imageUrl: "https://m.media-amazon.com/images/I/71k4YzUtD9L._SX569_.jpg",
    category: ["men"]
  },
  {
    name: "Leather Jacket",
    description: "Premium leather jacket for bikers.",
    price: 1577,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "blue", "brown"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/61Hejb+YFwL._SY741_.jpg",
      brown: "https://m.media-amazon.com/images/I/619hGHdgLoL._SX569_.jpg",
      blue: "https://m.media-amazon.com/images/I/717qaU0TK1L._SY741_.jpg"
    },
    stock: 57,
    imageUrl: "https://m.media-amazon.com/images/I/61Hejb+YFwL._SY741_.jpg",
    category: ["men"]
  },
  {
    name: "Polo T-Shirt",
    description: "Soft and breathable fabric with polo collar.",
    price: 4821,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white", "blue", "red"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/71eUwDk8z+L._SX569_.jpg",
      white: "https://m.media-amazon.com/images/I/61TgFZMIzML._SY741_.jpg",
      red: "https://m.media-amazon.com/images/I/51QtaB4auXL._SY741_.jpg",
      blue: "https://m.media-amazon.com/images/I/71Htl4lgh1L._SX569_.jpg"
    },
    stock: 114,
    imageUrl: "https://m.media-amazon.com/images/I/71eUwDk8z+L._SX569_.jpg",
    category: ["men"]
  },
  {
    name: "Checked Shirt",
    description: "Trendy checked shirt with a slim fit.",
    price: 1892,
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "blue"],
     imagesByColor: {
      white: "https://m.media-amazon.com/images/I/61MakEoLvDL._SY741_.jpg",
      blue: "https://m.media-amazon.com/images/I/61DGAlvxRLL._SY741_.jpg"
    },
    stock: 71,
    imageUrl: "https://m.media-amazon.com/images/I/61DGAlvxRLL._SY741_.jpg",
    category: ["men"]
  },
  {
    name: "Track Pants",
    description: "Ideal for gym and daily workouts.",
    price: 3400,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "green", "red"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/61GYbugKAqL._SX569_.jpg",
      green: "https://m.media-amazon.com/images/I/61pidHQuYeL._SX569_.jpg",
      red: "https://m.media-amazon.com/images/I/61LdecBPM-L._SX569_.jpg",
    },
    stock: 71,
    imageUrl: "https://m.media-amazon.com/images/I/61pidHQuYeL._SX569_.jpg",
    category: ["men"]
  },
  {
   name: "Oversized Hoodie",
    description: "Comfy oversized hoodie with fleece lining.",
    price: 739,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white", "blue", "orange"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/610w7fXzu6L._SY741_.jpg",
      white: "https://m.media-amazon.com/images/I/51S1KaKpWYL._SY741_.jpg",
      orange: "https://m.media-amazon.com/images/I/610kVARcEKL._SY741_.jpg",
      blue: "https://m.media-amazon.com/images/I/610hWdsQ8tL._SY741_.jpg"
    },
    stock: 51,
    imageUrl: "https://m.media-amazon.com/images/I/610hWdsQ8tL._SY741_.jpg",
    category: ["women"]
  },
  {
    name: "Formal Pants",
    description: "Tailored fit black pants for office wear.",
    price: 1526,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "blue", "grey"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/61aRj-WOyIL._SX569_.jpg",
      grey: "https://m.media-amazon.com/images/I/719KfdkNRwL._SX569_.jpg",
      blue: "https://m.media-amazon.com/images/I/61104FtVXXL._SX569_.jpg"
    },
    stock: 53,
    imageUrl: "https://m.media-amazon.com/images/I/719KfdkNRwL._SX569_.jpg",
    category: ["men"]
  },
  {
    name: "Printed T-Shirt",
    description: "Cool printed tee with graphic design.",
    price: 4135,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "grey", "orange", "red"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/61NIbeM05OL._SY741_.jpg",
      grey: "https://m.media-amazon.com/images/I/61BhG1dijXL._SY741_.jpg",
      red: "https://m.media-amazon.com/images/I/71m4XI+PsEL._SY741_.jpg",
      orange: "https://m.media-amazon.com/images/I/61iKv6-unXL._SY741_.jpg"
    },
    stock: 65,
    imageUrl: "https://m.media-amazon.com/images/I/61NIbeM05OL._SY741_.jpg",
    category: ["women"]
  },
  {
    name: "Beanie Cap",
    description: "Woolen beanie to keep you warm in winter.",
    price: 1013,
    sizes: [],
    colors: ["black", "orange", "grey"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/61HAX0SOw+L._SX679_.jpg",
      grey: "https://m.media-amazon.com/images/I/713DlHJl-tL._SX679_.jpg",
      orange: "https://m.media-amazon.com/images/I/81Om63rwbjL._SX679_.jpg"
    },
    stock: 87,
    imageUrl: "https://m.media-amazon.com/images/I/81Om63rwbjL._SX679_.jpg",
    category: ["men"]
  },
  {
    name: "Sports Bra",
    description: "High support sports bra for workouts.",
    price: 911,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "grey", "red"],
     imagesByColor: {
      black: "https://m.media-amazon.com/images/I/71nySGtw9tL._SX679_.jpg",
      grey: "https://m.media-amazon.com/images/I/71czbV0qkKL._SX679_.jpg",
      red: "https://m.media-amazon.com/images/I/71HqFLV8-TL._SX679_.jpg",
    },
    stock: 107,
    imageUrl: "https://m.media-amazon.com/images/I/71HqFLV8-TL._SX679_.jpg",
    category: ["women"]
  },
  {
    name: "Yoga Pants",
    description: "Stretchable and soft yoga pants.",
    price: 1492,
    sizes: ["S", "M", "L", "XL"],
    colors: ["grey", "blue", "orange"],
     imagesByColor: {
      grey: "https://m.media-amazon.com/images/I/41z8yZ4zohL._SY741_.jpg",
      orange: "https://m.media-amazon.com/images/I/51AsxCmXrML._SY741_.jpg",
      blue: "https://m.media-amazon.com/images/I/41c5EjBFf-L._SY741_.jpg"
    },
    stock: 74,
    imageUrl: "https://m.media-amazon.com/images/I/51AsxCmXrML._SY741_.jpg",
    category: ["women"]
  },
  {
    name: "Summer Hat",
    description: "Stylish wide-brim hat for sunny days.",
    price: 1959,
    sizes: [],
    colors: ["purple", "grey", "blue", "red"],
     imagesByColor: {
      purple: "https://m.media-amazon.com/images/I/61unifVmvYL._SX679_.jpg",
      grey: "https://m.media-amazon.com/images/I/61unifVmvYL._SX679_.jpg",
      red: "https://m.media-amazon.com/images/I/61HTHPweZAL._SX679_.jpg",
      blue: "https://m.media-amazon.com/images/I/61VDhvwQr0L._SX679_.jpg"
    },
    stock: 105,
    imageUrl: "https://m.media-amazon.com/images/I/61HTHPweZAL._SX679_.jpg",
    category: ["women"]
  },
];

export default data;
