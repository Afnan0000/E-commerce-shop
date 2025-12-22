/* assets/js/products-data.js
   Embedded product data for file:// protocol compatibility.
   This allows the site to work when opened directly from the filesystem.
*/

const PRODUCTS_DATA = [
    {
        "id": 1,
        "title": "Classic White Mug",
        "price": 25.00,
        "image": "images/img1.jpg",
        "description": "A classic white ceramic mug with a smooth finish. Perfect for your everyday coffee."
    },
    {
        "id": 2,
        "title": "Travel Thermal Mug",
        "price": 45.50,
        "image": "images/img2.jpg",
        "description": "Keep your drink hot for hours. Stainless steel travel mug with a leak-proof lid."
    },
    {
        "id": 3,
        "title": "Colorful Hand-painted Mug",
        "price": 30.00,
        "image": "images/Colorful Hand painted Mug.jfif",
        "description": "Brighten your mornings with this hand-painted artisanal mug."
    },
    {
        "id": 4,
        "title": "Minimal Pastel Mug",
        "price": 28.00,
        "image": "images/Minimal pasted Mug.jfif",
        "description": "Soft pastel tone mug. Perfect gift with a cute, minimal look."
    },
    {
        "id": 5,
        "title": "Mug with Spoon Holder",
        "price": 34.99,
        "image": "images/Mug with Spoon Holder.jfif",
        "description": "Functional mug with a spoon holder for instant stirring convenience."
    },
    {
        "id": 6,
        "title": "Cartoon Doodle Mug",
        "price": 32.50,
        "image": "images/Cartoon Doodle Mug.jfif",
        "description": "Cute cartoon-style mug with small hand-drawn doodles. Cheerful and fun."
    },
    {
        "id": 7,
        "title": "Rustic Ceramic Mug",
        "price": 38.00,
        "image": "images/Rustic Ceramic Mug.jfif",
        "description": "Handcrafted rustic mug with natural earthy tones. Perfect for cozy mornings."
    },
    {
        "id": 8,
        "title": "Modern Geometric Mug",
        "price": 29.99,
        "image": "images/Modern creometric Mug.jfif",
        "description": "Sleek modern design with geometric patterns. A statement piece for your desk."
    },
    {
        "id": 9,
        "title": "Oversized Latte Mug",
        "price": 42.00,
        "image": "images/Oversized latter Mug.jfif",
        "description": "Extra large capacity for your favorite lattes and cappuccinos."
    },
    {
        "id": 10,
        "title": "Vintage Floral Mug",
        "price": 35.00,
        "image": "images/Vintage floral Mug.jfif",
        "description": "Beautiful vintage-inspired floral design. Brings elegance to tea time."
    },
    {
        "id": 11,
        "title": "Double Wall Glass Mug",
        "price": 48.00,
        "image": "images/Double well Glass mug.jfif",
        "description": "Innovative double wall design keeps drinks hot while staying cool to touch."
    },
    {
        "id": 12,
        "title": "Ombre Gradient Mug",
        "price": 33.00,
        "image": "images/Ombre Gradient mug.jfif",
        "description": "Stunning ombre gradient finish from deep blue to soft pink."
    },
    {
        "id": 13,
        "title": "Espresso Cup Set",
        "price": 55.00,
        "image": "images/Espresso cup set.jfif",
        "description": "Set of 4 premium espresso cups. Perfect for coffee lovers and entertaining."
    },
    {
        "id": 14,
        "title": "Camping Adventure Mug",
        "price": 40.00,
        "image": "images/Camping Adventure mug.jfif",
        "description": "Durable enamel mug perfect for outdoor adventures and camping trips."
    },
    {
        "id": 15,
        "title": "Gold Rim Elegant Mug",
        "price": 52.00,
        "image": "images/Gold Rim Elegant mug.jfif",
        "description": "Luxurious mug with 24k gold rim detailing. A touch of elegance."
    },
    {
        "id": 16,
        "title": "Stackable Office Mug",
        "price": 22.00,
        "image": "images/Stackable office mug.jfif",
        "description": "Space-saving stackable design. Great for office and small kitchens."
    },
    {
        "id": 17,
        "title": "Artisan Speckled Mug",
        "price": 39.00,
        "image": "images/Artisan Speckled mug.jfif",
        "description": "Handmade with unique speckled glaze. Each piece is one of a kind."
    }
];

// Function to get products (works with file:// protocol)
function getProducts() {
    return PRODUCTS_DATA;
}

// Function to get a single product by ID
function getProductById(id) {
    return PRODUCTS_DATA.find(p => p.id === id);
}
