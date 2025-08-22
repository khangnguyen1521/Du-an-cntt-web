# Hệ Thống Quản Lý Vùng Trồng

## Mô tả
Hệ thống quản lý vùng trồng với giao diện tìm kiếm hiện đại, hỗ trợ tìm kiếm theo nhiều tiêu chí khác nhau.

## Tính năng

### Backend API
- ✅ Tạo vùng trồng mới
- ✅ Lấy danh sách tất cả vùng trồng
- ✅ Tìm kiếm vùng trồng theo tên, địa điểm, loại cây trồng, trạng thái
- ✅ Xem chi tiết vùng trồng
- ✅ Cập nhật thông tin vùng trồng
- ✅ Xóa vùng trồng

### Frontend
- ✅ Giao diện tìm kiếm trực quan và dễ sử dụng
- ✅ Tìm kiếm theo nhiều tiêu chí
- ✅ Hiển thị kết quả dạng bảng với phân trang
- ✅ Modal xem chi tiết
- ✅ Responsive design
- ✅ Thông báo real-time
- ✅ Loading indicators

## Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB với Mongoose
- CORS

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- Font Awesome Icons

## Cài đặt và Chạy

### 1. Cài đặt Dependencies
```bash
cd region-management-api
npm install
```

### 2. Cấu hình Database
Tạo file `.env` trong thư mục root:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/region_management
```

### 3. Khởi động Server
```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

### 4. Truy cập Ứng dụng
- Frontend: `http://localhost:5000`
- API Documentation: `http://localhost:5000/api`

## API Endpoints

### Regions
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/regions` | Lấy tất cả vùng trồng |
| GET | `/api/regions/search` | Tìm kiếm vùng trồng |
| GET | `/api/regions/:id` | Lấy vùng trồng theo ID |
| POST | `/api/regions` | Tạo vùng trồng mới |
| PUT | `/api/regions/:id` | Cập nhật vùng trồng |
| DELETE | `/api/regions/:id` | Xóa vùng trồng |

### Tìm kiếm
Endpoint: `GET /api/regions/search`

Query Parameters:
- `name`: Tên vùng trồng (string, optional)
- `location`: Địa điểm (string, optional)
- `cropType`: Loại cây trồng (string, optional)
- `status`: Trạng thái - active/inactive (string, optional)

Ví dụ:
```
GET /api/regions/search?name=vườn%20cam&location=Đồng%20Nai&status=active
```

## Cấu trúc Dữ liệu

### Region Schema
```javascript
{
  name: String,          // Tên vùng trồng
  location: String,      // Địa điểm
  area: Number,          // Diện tích (m²)
  cropType: String,      // Loại cây trồng
  status: String,        // Trạng thái (active/inactive)
  createdAt: Date,       // Ngày tạo
  updatedAt: Date        // Ngày cập nhật
}
```

## Hướng dẫn Sử dụng Giao diện

### Tìm kiếm
1. Nhập thông tin vào các trường tìm kiếm (tên, địa điểm, loại cây trồng, trạng thái)
2. Nhấn nút "Tìm Kiếm" 
3. Kết quả sẽ hiển thị trong bảng bên dưới
4. Số lượng kết quả được hiển thị ở góc phải

### Các chức năng khác
- **Xóa**: Xóa toàn bộ form tìm kiếm
- **Tải Tất Cả**: Hiển thị toàn bộ vùng trồng
- **Xem Chi Tiết**: Click nút "Xem" để xem thông tin chi tiết trong modal

### Tính năng nổi bật
- Tìm kiếm không phân biệt chữ hoa/thường
- Tìm kiếm từ khóa một phần (partial match)
- Thông báo trạng thái real-time
- Responsive trên mobile
- Loading animation

## Cấu trúc Thư mục
```
region-management-api/
├── config/
│   └── db.js              # Cấu hình database
├── controllers/
│   └── regionController.js # Logic xử lý business
├── models/
│   └── region.js          # Model Mongoose
├── public/               # Frontend files
│   ├── index.html        # Giao diện chính
│   ├── styles.css        # Styling
│   └── script.js         # Logic frontend
├── routes/
│   └── regionRoutes.js   # API routes
├── package.json
├── server.js             # Entry point
└── README.md            # Documentation
```

## Demo Data
Để test, bạn có thể thêm dữ liệu mẫu qua API:

```bash
# Tạo vùng trồng mới
curl -X POST http://localhost:5000/api/regions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vườn Cam Sành",
    "location": "Đồng Nai", 
    "area": 5000,
    "cropType": "Cam sành",
    "status": "active"
  }'
```

## Hỗ trợ
Nếu có vấn đề, hãy kiểm tra:
1. MongoDB đã chạy chưa
2. Cổng 5000 có bị chiếm không
3. Dependencies đã được install đầy đủ
4. File .env đã được cấu hình đúng

## License
MIT License 