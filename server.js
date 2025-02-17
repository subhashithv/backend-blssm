const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/db'); // If db.js is inside config folder
const multer = require('multer'); // Import multer
const orderRoutes = require('./routes/orderRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://blossomsbotique.com'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  },
});

const upload = multer({ storage }); // Initialize multer with the storage configuration

// Your product routes, with file upload handling
app.use('/api/products', upload.single('image'), productRoutes); // Use multer middleware

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', orderRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
