# backend
backend server

## 디렉토리 구조

- `api/`: 실제 API 코드가 저장되는 디렉토리. `server.js`에서 라우팅된다.
  - `admin.js`: DB 저장, 업데이트 관련 API
  - `channel.js`: 채널 정보 불러오는 API
  - `summary.js`: summary API
- `jupyter/`: 주피터 랩 작업용 디렉토리
  - `jlab`: 주피터 랩 실행 스크립트
  - `result.json`: 현재 DB에 저장되어 있는 데이터 덤프
  - `spark612-backend-jupyter-config.py`: 주피터 랩 환경설정 파일. `jupyter/jlab`으로 주피터 랩 실행 시 적용됨.
- `models/`: mongoose가 사용하는 DB 스키마가 저장되는 디렉토리
  - `channel.js`: channel collection 스키마
- `node_modules/`: Node.js가 사용하는 디렉토리(패키지 저장소). 직접 건드릴 일은 없을 것이다.
- `summary/`: summary API가 사용하는 파일들을 모아놓은 디렉토리
  - `dummy-channel-img.png`: 채널 이미지 더미 이미지. 현재 summary API는 이 파일을 base64로 전송한다. 추후 DB에 채널 이미지 추가되면 변경 예정(사용 안 할 예정).
  - `summary_func.js`: `summary.json`을 빌드하기 위한 함수들을 모아놓은 파일.
  - `summary.json`: summary API 핵심 파일. 이 파일의 내용을 바탕으로 summary API를 전송한다.
- `.gitignore`: Git 추적하지 않을 파일 목록.
- `config.js`: 서버 설정 파일. 글로벌하게 사용되는 가변성이 있는 변수들(ex. DB 접속 정보, 디렉토리명 등)은 이 파일에서 관리한다.
- `LICENSE`: 라이선스 파일(MIT 라이선스)
- `package-lock.json`: Node.js가 사용하는 파일(패키지 설치 정보). 직접 건드릴 일은 없을 것이다.
- `package.json`: Node.js가 사용하는 파일(Node.js 설정 파일)
- `README.md`: Github README 파일(현재 파일)
- `run`: 서버 실행 스크립트
- `secret.js`: 서버 설정 파일. 글로벌하게 사용되는 가변성이 있는 변수들 중 Github에 올라가면 안 되는 값들(ex. 비밀번호 등)은 이 파일에서 관리한다.
- `server.js`: Node.js 진입점(entry point)
- `utils.js`: 글로벌하게 사용되는 함수들(ex. 로그 출력용 함수 등)을 모아놓은 파일.
