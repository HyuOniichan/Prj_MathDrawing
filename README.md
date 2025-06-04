# ✍️ Math Drawing 

Chuyển công thức toán học viết tay thành dạng **LaTeX**, giúp hiển thị, sao chép hoặc giải bài toán bằng AI.

---

## 🚀 Tính năng chính

- Vẽ công thức toán học bằng tay ngay trên website.
- Chọn vùng ảnh từ canvas để nhận diện công thức.
- Chuyển đổi hình ảnh viết tay thành:
  - 📄 Văn bản LaTeX
  - 🖼️ Ảnh công thức
- Tùy chọn gửi công thức đến AI để giải bài toán.

---

## 🧠 Công nghệ sử dụng

- **Frontend**: HTML5 Canvas / React + Konva.js
- **AI Engine**: [LaTeX-OCR](https://github.com/lukas-blecher/LaTeX-OCR) (open-source)
- **OCR Server**: Flask API chạy mô hình nhận diện công thức
- **Hiển thị công thức**: KaTeX / MathJax

---

## 📦 Cách hoạt động

1. Người dùng vẽ công thức → chọn vùng → ảnh được trích xuất.
2. Ảnh gửi đến server → xử lý bởi mô hình LaTeX-OCR.
3. Server trả về chuỗi LaTeX → frontend hiển thị kết quả.
