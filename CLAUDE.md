# 조인식 선생님 랜딩페이지

개인 브랜딩 랜딩페이지 (index.html, about.html, services.html, reviews.html, contact.html + style.css, script.js).

## Git 자동 반영 규칙

- 파일을 수정/생성/삭제하는 작업을 마치면, 그 턴 안에서 바로 `git add -A`, `git commit`, `git push origin main`까지 실행한다. 별도로 push 여부를 묻지 않는다.
- 커밋 메시지는 변경 내용을 한국어로 간결하게 요약한다.
- push가 실패하면(충돌, 인증 오류 등) 자동으로 재시도하지 말고 사용자에게 상황을 알린다.
- 원격 저장소: `origin` → `git@github.com-branding-page:brightkimtheater-pixel/branding-page.git` (SSH, 이 PC의 `~/.ssh/id_ed25519_branding_page` 키 사용).
