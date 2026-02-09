const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 

require('dotenv').config(); 

const app = express(); 
const PORT = process.env.PORT || 5000; 

// Middleware 
app.use(cors()); 
app.use(express.json()); 

// Connexion à MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err));

// Eto ny routes principales
// --> 
app.use('/auth', require('./routes/auth/AuthRoutes'));
app.use('/orders_management', require('./routes/shop/OrderManagementRoutes'));
app.use('/stock_movement', require('./routes/shop/StockMovementRoutes'));
app.use('/products_management', require('./routes/shop/ProductRoutes'));
app.use('/stock', require('./routes/shop/StockRoutes'));



app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`)); 