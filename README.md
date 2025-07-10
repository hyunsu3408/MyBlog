# 📝 MyBlog - Node.js 개인 블로그 프로젝트

> Node.js + Express + MongoDB + EJS 기반의 개인 블로그 프로젝트입니다.  
> 글 작성, 댓글, 검색, 좋아요/싫어요, 로그인 기능 등을 포함한 **풀스택 웹 프로젝트**입니다.

---

## 🔧 사용 기술 스택

- **Backend**: Node.js, Express
- **Frontend**: EJS (Express-EJS-Layouts)
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, cookie-parser, bcrypt
- **기타**: method-override, dotenv, express-async-handler, nodemon

---

## 📂 폴더 구조

```plaintext
MYBLOG/
├── config/            # DB 연결 설정
├── models/            # Mongoose 스키마 정의
├── routes/            # 메인/댓글/관리자 라우터
├── public/            # 정적 파일 (CSS, 이미지)
├── views/             # EJS 템플릿
├── .env               # 환경 변수
├── app.js             # 메인 서버 파일
├── package.json
└── README.md
