const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const app = express();
const route = require('./routes');
const db = require('./config/db');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Load biến môi trường
dotenv.config({ path: './.env' });

// Kết nối DB
db.connect();

// Port
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ứng dụng đang chạy trên cổng ${PORT}`);
});

// Cấu hình CORS trước các middleware khác
const corsOptions = {
    origin: function (origin, callback) {
        // Cho phép requests không có origin (mobile apps, etc)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://localhost:5174', 
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Middleware với size limit lớn hơn cho file upload
app.use(express.urlencoded({ 
    extended: true, 
    limit: '100mb' 
}));
app.use(express.json({ 
    limit: '100mb' 
}));
app.use(methodOverride('_method'));
app.use(morgan('combined'));



// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.set('transporter', transporter);

// Khởi tạo routes
route(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
