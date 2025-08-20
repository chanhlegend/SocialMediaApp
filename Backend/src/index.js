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

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
