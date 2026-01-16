# 🚀 SMD System - Quick Start Guide

## ⚡ Khởi Động Nhanh (5 phút)

### 1️⃣ Kiểm tra Prerequisites
```bash
# Windows
.\test-system.bat

# Linux/Mac
./test-system.sh
```

### 2️⃣ Khởi Động Hệ Thống
```bash
# Windows
.\setup.bat

# Linux/Mac
./setup.sh
```

### 3️⃣ Truy Cập Ứng Dụng
- **Web**: http://localhost:3000
- **Login**: admin / admin123

### 4️⃣ Kiểm Tra Health (Optional)
```bash
# Windows
.\check-system.bat

# Linux/Mac
./check-system.sh
```

## 🎯 Tính Năng Chính

### 👤 Đăng Nhập
- **Admin**: admin / admin123
- **Lecturer**: lecturer1 / lecturer123
- **Student**: student1 / student123

### 📚 Quản Lý Đề Cương
1. Login với tài khoản lecturer1
2. Vào "Create Syllabus" 
3. Tạo đề cương mới
4. Submit để approval

### 🤖 AI Features
1. Upload PDF/Word document
2. Sử dụng OCR để extract text
3. AI sẽ tự động analyze CLO-PLO mapping
4. Xem summary và suggestions

### 🔍 Tìm Kiếm
1. Vào Student portal
2. Sử dụng Advanced Search
3. Xem Subject Tree visualization
4. Subscribe để nhận notifications

## 🛠️ Troubleshooting

### Port Conflicts
```bash
# Thay đổi ports trong docker-compose.yml
# Frontend: 3000 -> 3001
# Backend: 8080 -> 8081
```

### Memory Issues
```bash
# Tăng Docker memory limit lên 4GB+
# Restart Docker Desktop
```

### Build Failures
```bash
# Reset và rebuild
docker-compose down -v
docker system prune -a
.\setup.bat
```

## 📱 Mobile App

### Expo Go
1. Install Expo Go app trên điện thoại
2. Chạy `npm start` trong mobile/smd-mobile
3. Scan QR code
4. Enjoy mobile experience!

## 🔗 Useful Links

- **API Docs**: http://localhost:8080/swagger-ui.html
- **AI Service**: http://localhost:8000/docs
- **Elasticsearch**: http://localhost:9200
- **Full Documentation**: README.md

---

**🎉 Chúc bạn khám phá SMD System thành công!**