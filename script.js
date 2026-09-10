// 상단 바 스크롤 스타일
const topbar = document.getElementById("topbar");
window.addEventListener("scroll", () => {
  topbar.classList.toggle("scrolled", window.scrollY > 10);
});

// 모바일 메뉴 토글
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileNav.classList.toggle("open");
});
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
  });
});

// 현재 페이지 메뉴 활성 표시
const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll(".nav a, .mobile-nav a").forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("active");
    }
  });
}

// 스크롤 등장 애니메이션
const revealTargets = document.querySelectorAll(
  ".about-card, .service-card, .review-card, .section-title, .about-lead, .contact-form, .contact-info, .explore-card"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => observer.observe(el));

// 상담 신청 폼 (연락처 페이지에만 존재)
const form = document.getElementById("contactForm");

if (form) {
  const formNote = document.getElementById("formNote");

  const setError = (id, message) => {
    const field = document.getElementById(id);
    const err = document.getElementById("err-" + id);
    if (message) {
      field.classList.add("invalid");
      err.textContent = message;
    } else {
      field.classList.remove("invalid");
      err.textContent = "";
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formNote.textContent = "";
    formNote.classList.remove("form-note-error");

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    let valid = true;

    if (!name) {
      setError("name", "이름을 입력해 주세요.");
      valid = false;
    } else {
      setError("name", "");
    }

    if (!phone) {
      setError("phone", "연락처를 입력해 주세요.");
      valid = false;
    } else {
      setError("phone", "");
    }

    if (!message) {
      setError("message", "문의 내용을 입력해 주세요.");
      valid = false;
    } else {
      setError("message", "");
    }

    if (!valid) return;

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "보내는 중...";

    const { error } = await supabaseClient.from("inquiries").insert([
      { name, phone, email: email || null, message },
    ]);

    submitBtn.disabled = false;
    submitBtn.textContent = "문의 보내기";

    if (error) {
      formNote.classList.add("form-note-error");
      formNote.textContent = "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      return;
    }

    formNote.textContent = "문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.";
    form.reset();
  });
}
