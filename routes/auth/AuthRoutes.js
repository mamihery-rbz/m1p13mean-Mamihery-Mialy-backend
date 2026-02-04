const express = require('express');
const router = express.Router();

const authService = require('../../services/auth/AuthService');

router.post('/api/register', async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({success: 'User registered successfully',user});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/api/login', async (req, res) => {
  try {
    const { name, password ,role} = req.body;
    const result = await authService.login(name, password, role);
    res.status(201).json({success: 'Login successfully', result});

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;