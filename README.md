<img width="617" height="580" alt="image" src="https://github.com/user-attachments/assets/6ba98374-6ee8-4058-8094-fa2761bcf455" /># 📝 MyBlog - Node.js 개인 블로그 프로젝트

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
```

## 메인 기능

- 로그인 기능
- 게시글 등록 및 수정/ 삭제
- 게시물 검색 & 페이징
- 댓글 기능
- 좋아요 / 싫어요 기능
- 총 방문자 수 구현
- 게시물 기능별 정렬

## DB 모델 ERD
<img width="1024" height="1024" alt="Myblog ERD" src="https://github.com/user-attachments/assets/3260ac9a-8603-4205-a487-a278fffd921b" />


## 결과 화면
- 메인 화면 ( "/", "/home" )
<img width="611" height="547" alt="image" src="https://github.com/user-attachments/assets/cbffb630-eaf9-45fc-9bd0-0d3af6cef89f" />

- 로그인 및 관리자 등록 페이지 ( "/add" )
<img width="617" height="580" alt="image" src="https://github.com/user-attachments/assets/ce72e09f-d178-4018-aebc-5db000b4d496" />

- 전체 게시물 화면 ("/allPosts" )
<img width="610" height="577" alt="image" src="https://github.com/user-attachments/assets/0a77433b-4a9e-4f9d-9524-6ed8b4bddcd3" />

- 게시물 및 댓글 페이지 ( "/post/:id" )
<img width="622" height="442" alt="image" src="https://github.com/user-attachments/assets/7487b3d4-69b4-4cef-a7ef-47d284b96683" />



