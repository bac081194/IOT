const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Tạo kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '170802',
  database: 'dbdemo'
});

// Định nghĩa một API endpoint để lấy dữ liệu từ bảng sensor_data
router.get('/sensor_data1', (req, res) => {
  // Truy vấn cơ sở dữ liệu để lấy dữ liệu từ bảng sensor_data
  db.query('SELECT * FROM sensor_data1', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', err);
      res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
      return;
    }

    // Trả về dữ liệu dưới dạng JSON
    res.json(results);
  });
});

module.exports = router;
