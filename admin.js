const authGate = document.getElementById("authGate");
const adminPanel = document.getElementById("adminPanel");
const loginForm = document.getElementById("loginForm");
const loginNote = document.getElementById("loginNote");
const logoutBtn = document.getElementById("logoutBtn");
const inquiryList = document.getElementById("inquiryList");
const inquiryCount = document.getElementById("inquiryCount");
const preregList = document.getElementById("preregList");
const preregCount = document.getElementById("preregCount");

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderInquiries(rows) {
  if (!rows.length) {
    inquiryList.innerHTML = '<p class="inquiry-empty">아직 접수된 문의가 없습니다.</p>';
    inquiryCount.textContent = "";
    return;
  }

  inquiryCount.textContent = `총 ${rows.length}건`;

  inquiryList.innerHTML = rows
    .map((row) => {
      const emailLine = row.email ? `<span>${escapeHtml(row.email)}</span>` : "";
      const readBadge = row.is_read
        ? '<span class="inquiry-badge inquiry-badge-read">읽음</span>'
        : '<span class="inquiry-badge inquiry-badge-unread">안읽음</span>';
      return `
        <div class="inquiry-card" data-id="${row.id}">
          <div class="inquiry-card-head">
            <div>
              <strong>${escapeHtml(row.name)}</strong>
              <span>${escapeHtml(row.phone)}</span>
              ${emailLine}
            </div>
            ${readBadge}
          </div>
          <p class="inquiry-message">${escapeHtml(row.message)}</p>
          <div class="inquiry-card-foot">
            <span class="inquiry-date">${formatDate(row.created_at)}</span>
            ${row.is_read ? "" : '<button type="button" class="btn btn-outline btn-sm mark-read-btn">읽음으로 표시</button>'}
          </div>
        </div>
      `;
    })
    .join("");

  inquiryList.querySelectorAll(".mark-read-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const card = e.target.closest(".inquiry-card");
      const id = card.dataset.id;
      btn.disabled = true;
      await supabaseClient.from("inquiries").update({ is_read: true }).eq("id", id);
      loadInquiries();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function loadInquiries() {
  inquiryList.innerHTML = '<p class="inquiry-empty">불러오는 중...</p>';
  const { data, error } = await supabaseClient
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    inquiryList.innerHTML = '<p class="inquiry-empty">문의 목록을 불러오지 못했습니다.</p>';
    return;
  }

  renderInquiries(data);
}

function formatDateOnly(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

function renderPreregCard(row) {
  return `
    <div class="prereg-card" data-id="${row.id}">
      <div class="prereg-info">
        <strong>${escapeHtml(row.name)}</strong>
        <span>${formatDateOnly(row.register_date)}</span>
      </div>
      <div class="prereg-actions">
        <button type="button" class="btn btn-outline btn-sm prereg-edit-btn">수정</button>
        <button type="button" class="btn btn-outline btn-sm prereg-delete-btn">삭제</button>
      </div>
    </div>
  `;
}

function renderPreregEditCard(row) {
  return `
    <div class="prereg-card" data-id="${row.id}">
      <div class="prereg-edit-row">
        <input type="text" class="prereg-edit-name" value="${escapeHtml(row.name)}">
        <input type="date" class="prereg-edit-date" value="${row.register_date}">
      </div>
      <div class="prereg-actions">
        <button type="button" class="btn btn-primary btn-sm prereg-save-btn">저장</button>
        <button type="button" class="btn btn-outline btn-sm prereg-cancel-btn">취소</button>
      </div>
    </div>
  `;
}

function attachPreregCardEvents(row) {
  const card = preregList.querySelector(`.prereg-card[data-id="${row.id}"]`);
  if (!card) return;

  const editBtn = card.querySelector(".prereg-edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      card.outerHTML = renderPreregEditCard(row);
      attachPreregCardEvents(row);
    });
  }

  const deleteBtn = card.querySelector(".prereg-delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      if (!confirm(`${row.name}님의 사전 등록을 삭제할까요?`)) return;
      deleteBtn.disabled = true;
      await supabaseClient.from("pre_registrations").delete().eq("id", row.id);
      loadPreregistrations();
    });
  }

  const saveBtn = card.querySelector(".prereg-save-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const name = card.querySelector(".prereg-edit-name").value.trim();
      const date = card.querySelector(".prereg-edit-date").value;
      if (!name || !date) return;
      saveBtn.disabled = true;
      await supabaseClient
        .from("pre_registrations")
        .update({ name, register_date: date })
        .eq("id", row.id);
      loadPreregistrations();
    });
  }

  const cancelBtn = card.querySelector(".prereg-cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      card.outerHTML = renderPreregCard(row);
      attachPreregCardEvents(row);
    });
  }
}

function renderPreregistrations(rows) {
  if (!rows.length) {
    preregList.innerHTML = '<p class="inquiry-empty">아직 사전 등록이 없습니다.</p>';
    preregCount.textContent = "";
    return;
  }

  preregCount.textContent = `총 ${rows.length}건`;
  preregList.innerHTML = rows.map(renderPreregCard).join("");
  rows.forEach(attachPreregCardEvents);
}

async function loadPreregistrations() {
  preregList.innerHTML = '<p class="inquiry-empty">불러오는 중...</p>';
  const { data, error } = await supabaseClient
    .from("pre_registrations")
    .select("*")
    .order("register_date", { ascending: true });

  if (error) {
    preregList.innerHTML = '<p class="inquiry-empty">사전 등록 목록을 불러오지 못했습니다.</p>';
    return;
  }

  renderPreregistrations(data);
}

function showAdminPanel() {
  authGate.hidden = true;
  adminPanel.hidden = false;
  loadInquiries();
  loadPreregistrations();
}

function showLoginForm() {
  authGate.hidden = false;
  adminPanel.hidden = true;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginNote.textContent = "";
  loginNote.classList.remove("form-note-error");

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    loginNote.classList.add("form-note-error");
    loginNote.textContent = "이메일과 비밀번호를 입력해 주세요.";
    return;
  }

  const submitBtn = loginForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "로그인 중...";

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  submitBtn.disabled = false;
  submitBtn.textContent = "로그인";

  if (error) {
    loginNote.classList.add("form-note-error");
    loginNote.textContent = "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.";
    return;
  }

  loginForm.reset();
  showAdminPanel();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLoginForm();
});

(async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  if (session) {
    showAdminPanel();
  } else {
    showLoginForm();
  }
})();
