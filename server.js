const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const adminRoutes = require('./routes/admin/AdminRoutes');
const vueRoutes = require('./routes/admin/VueRoutes');
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
app.use('/auth', require('./routes/auth/AuthRoutes'))
app.use('/admin', adminRoutes);
app.use('/vue', vueRoutes);


app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`)); 