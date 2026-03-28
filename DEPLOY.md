# 🚀 AI News Ticker - Vercel 배포 가이드

## 📋 배포 전 확인사항

✅ **완료된 항목:**
- [x] Tailwind CSS 설정 (v3)
- [x] RSS 피드 소스 구성
- [x] 번역 기능 (MyMemory API)
- [x] .gitignore 생성
- [x] TypeScript 설정
- [x] Next.js 라우트 구성

---

## 🎯 Vercel 배포 단계

### 스텝 1: GitHub 레포지토리 생성

#### 1-1. GitHub 접속
```
https://github.com/new
```

#### 1-2. 레포지토리 설정
- **Repository name**: `ai-news-ticker`
- **Description**: `실시간 AI 뉴스 티커 - 자동 번역`
- **Public/Private**: Public (공개)
- **Initialize with README**: 체크 ✅
- **Add .gitignore**: 선택 (이미 있으므로 선택 안 해도 됨)
- **Choose a license**: MIT License

#### 1-3. "Create repository" 클릭

---

### 스텝 2: 코드 푸시

#### 2-1. 터미널에서 실행
```bash
cd /home/bsjung/.openclaw/workspace/ai-news-ticker

# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: AI News Ticker with Korean translation

Features:
- Real-time news ticker (5s intervals)
- RSS feeds from Hacker News, TechCrunch, MIT, VentureBeat
- Auto translation (MyMemory API)
- Responsive design with Tailwind CSS"

# 메인 브랜치 이름 변경 (필요한 경우)
git branch -M main

# GitHub 레포지토리 연결
# 사용자명/레포지토리명으로 교체 필요
git remote add origin https://github.com/your-username/ai-news-ticker.git

# 코드 푸시
git push -u origin main
```

---

### 스텝 3: Vercel에 프로젝트 연결

#### 3-1. Vercel 접속
```
https://vercel.com/new
```

#### 3-2. "Import Git Repository" 클릭

#### 3-3. GitHub 계정 연결
- "Continue with GitHub" 클릭
- Vercel 권한 부여 승인

#### 3-4. 레포지토리 선택
- **ai-news-ticker** 레포지토리 찾기
- "Import" 클릭

---

### 스텝 4: Vercel 프로젝트 설정

#### 4-1. 프로젝트 설정
- **Project Name**: `ai-news-ticker` (자동 생성)
- **Framework Preset**: `Next.js` (자동 감지)
- **Root Directory**: `./` (자동)
- **Build Command**: `npm run build` (자동)
- **Output Directory**: `.next` (자동)
- **Install Command**: `npm install` (자동)

#### 4-2. "Deploy" 클릭

---

## ⏱️ 배포 시간

- **빌드**: 약 30초 - 1분
- **배포**: 약 1-2분
- **총 시간**: 약 2-3분

---

## ✅ 배포 완료 후

### 배포 완료 화면 확인

```
✔ Production: https://ai-news-ticker-username.vercel.app
✔ Production: https://ai-news-ticker-git-repo-name.vercel.app
```

### 기능 테스트

1. 뉴스 자동 로딩 확인
2. 5초마다 헤드라인 변경 확인
3. 한국어 번역 확인
4. 뉴스 리스트 클릭 확인
5. 새로고침 버튼 확인
6. 반응형 디자인 확인 (모바일/데스크탑)

---

## 🌐 도메인 설정 (선택사항)

### 4-1. Vercel 대시보드
```
https://vercel.com/your-username/ai-news-ticker/settings/domains
```

### 4-2. 도메인 추가
- "Add Domain" 클릭
- 도메인 입력: `yourdomain.com`
- DNS 설정 안내 따르기

---

## 🔄 자동 배포 설정

### Git 푸시마다 자동 배포

Vercel은 기본적으로 Git 푸시를 감지해서 자동으로 배포합니다:

```bash
# 코드 수정 후
git add .
git commit -m "Update: Added feature XYZ"
git push

# ✅ Vercel이 자동으로 배포 시작!
```

---

## 📊 배포 모니터링

### Vercel 대시보드
```
https://vercel.com/your-username/ai-news-ticker
```

### 확인 항목
- **Deployments**: 배포 이력
- **Logs**: 빌드 로그
- **Analytics**: 방문자 통계
- **Environment Variables**: 환경 변수

---

## 🐛 문제 해결

### 1. 빌드 에러
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 및 수정
```

### 2. API 호출 실패
- **원인**: Vercel 서버리스 환경에서 외부 API 호출 제한
- **해결**:
  - Vercel 환경 변수에 API 키 설정
  - 서버리스 함수로 API 요청 라우팅

### 3. 번역 API 제한 초과
- **원인**: MyMemory API 하루 1,000번 제한
- **해결**:
  - 캐싱 강화
  - 다른 무료 번역 API 사용

---

## 💡 추가 최적화

### 1. 이미지 최적화
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 2. 캐싱 설정
```typescript
// app/api/news/route.ts
export const revalidate = 300; // 5분마다 재검증
```

### 3. 번역 캐싱
```typescript
// 번역 결과를 LocalStorage에 저장
// 같은 텍스트 재번역 방지
```

---

## 📞 도움링크

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 배포**: https://nextjs.org/docs/deployment
- **GitHub 가이드**: https://guides.github.com/

---

## 🎉 축하합니다!

배포가 완료되면 전 세계 어디서든 접속할 수 있습니다! 🌍

```
https://ai-news-ticker-username.vercel.app
```

---
