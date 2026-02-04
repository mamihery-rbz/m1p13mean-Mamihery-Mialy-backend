const User = require('../../models/users/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'wawa';

async function register(userData){
    const {name, mail, password, role} = userData;

    const existingUser = await User.findOne({ name });
    if (existingUser) {
        throw new Error('Name already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        mail,
        password: hashedPassword,
        role
    });

    await user.save();
    return user;
} 


async function login(name, password){
    const user = await User.findOne({ name });
    if(!name || !password){
        throw new Error('All fields are required');
    }
    if (!user) {
        throw new Error('Invalid name');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    JWT_SECRET, { expiresIn: '1d' });
    
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            mail: user.mail,
            role: user.role
        }
    };
}

module.exports = {register, login};