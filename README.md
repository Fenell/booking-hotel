# 🏨 Booking Hotel - Frontend

Đây là project **Frontend** cho hệ thống đặt phòng khách sạn (Hotel Booking System), được xây dựng bằng **React + TypeScript**.

Ứng dụng cung cấp giao diện để người dùng tìm kiếm khách sạn, xem thông tin chi tiết và thực hiện đặt phòng thông qua API từ backend (được triển khai ở project khác).

---

## 🚀 Giới thiệu

Project tập trung vào việc xây dựng giao diện người dùng hiện đại, dễ sử dụng cho hệ thống booking khách sạn.

Luồng hoạt động chính:

Các chức năng được thiết kế theo flow thực tế của một hệ thống đặt phòng:
- Tìm kiếm khách sạn  
- Xem chi tiết  
- Chọn ngày và đặt phòng  

---

## ⚙️ Chức năng chính

- 🔍 Tìm kiếm khách sạn  
- 🏨 Hiển thị danh sách khách sạn  
- 📄 Xem chi tiết khách sạn  
- 📅 Chọn ngày check-in / check-out  
- 🛒 Thực hiện đặt phòng  
- 👤 Đăng nhập / đăng ký (nếu có)  

---

## 🧩 Kiến trúc Frontend

Project được tổ chức theo cấu trúc phổ biến của React:

```bash
src/
│
├── components/     # UI components tái sử dụng
├── pages/          # Các trang chính (Home, Detail, Booking...)
├── services/       # Gọi API tới backend
├── hooks/          # Custom hooks
├── types/          # Định nghĩa TypeScript types
├── utils/          # Hàm tiện ích
└── App.tsx

## 🛠️ Công nghệ sử dụng

- ⚛️ **React** – Xây dựng giao diện người dùng  
- 🟦 **TypeScript** – Tăng tính an toàn kiểu dữ liệu  
- 🌐 **REST API** – Giao tiếp với backend  
- 📦 **Axios / Fetch** – Gửi request HTTP  
- 🎨 **CSS / SCSS / Tailwind** – Thiết kế giao diện  
