const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Serve static files từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Gắn route trước khi chạy server
const regionRoutes = require('./routes/regionRoutes');
app.use('/api/regions', regionRoutes);

// Route cho frontend - serve index.html cho root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route test đơn giản
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running...',
    version: '1.0.0',
    endpoints: {
      'GET /api/regions': 'Lấy tất cả vùng trồng',
      'GET /api/regions/search': 'Tìm kiếm vùng trồng',
      'GET /api/regions/:id': 'Lấy vùng trồng theo ID',
      'POST /api/regions': 'Tạo vùng trồng mới',
      'PUT /api/regions/:id': 'Cập nhật vùng trồng',
      'DELETE /api/regions/:id': 'Xóa vùng trồng'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
});