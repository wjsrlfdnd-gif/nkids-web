// manager.js - 통합 관리자 (Footer 디자인까지 완벽 통합)

// ============================================================
// [1] 설정 및 상수 정의
// ============================================================
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz68tFmFB7IuCEhLIgnm4RMuqiYlXzdgqDVikGFOODFVuh9wXfdOL4aZ4VFy-7HAsVPjQ/exec";
const LOGO_IMAGE_URL = "https://wjsrlfdnd-gif.github.io/nkids-web/logo.png";

const DEFAULT_INFO = {
    company: "(주)뉴키즈",
    ceo: "박홍기",
    address: "경기도 김포시 태장로 765 금광테크노밸리 627호",
    phone: "010-2333-2563 / 010-5522-8109"
};

// ★ Supabase 설정
const SUPABASE_URL = "https://chmpykdpiwmotmfenirr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobXB5a2RwaXdtb3RtZmVuaXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTQ0NDksImV4cCI6MjA4MzA5MDQ0OX0.vL8_JBLEWXgrvjtfcoZ5BeqFiIRhFKrItx47VzDdmjQ";

window.sb = null;
if (typeof supabase !== 'undefined') {
    window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ============================================================
// [2] 초기화 및 데이터 로딩
// ============================================================
(function initViewport() {
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        document.head.prepend(meta);
    }
})();

async function loadDataFromSheet() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const rows = data.split("\n").slice(1);
        rows.forEach(row => {
            const columns = row.split(",");
            const id = columns[0].trim();
            let text = columns.slice(1).join(",").trim();
            text = text.replace(/^"|"$/g, '');
            const element = document.getElementById(id);
            if (element) element.innerHTML = text.replace(/\\n/g, "<br>");
        });
    } catch (error) { console.error("엑셀 연동 실패:", error); }
}

// ============================================================
// [3] 헤더/푸터 및 스타일 생성 (여기에 Footer 디자인 추가됨)
// ============================================================
function loadHeader() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* [A] 글로벌 반응형 스타일 */
        :root { --primary-color: #1a3c6e; --accent-color: #f4a261; --bg-light: #f8f9fa; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
            font-size: 16px; color: #333; line-height: 1.6;
            overflow-x: hidden; padding-top: 70px;
            display: flex; flex-direction: column; min-height: 100vh; /* 푸터 하단 고정용 */
        }
        a { text-decoration: none; color: inherit; }
        ul { list-style: none; }
        img { max-width: 100%; height: auto; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; width: 100%; }
        section { padding: clamp(40px, 8vw, 80px) 0; } /* 기본 섹션 여백 */
        
        /* 폰트/버튼 */
        h1 { font-size: clamp(2rem, 5vw, 3.5rem) !important; line-height: 1.3; margin-bottom: 20px; }
        h2 { font-size: clamp(1.8rem, 4vw, 2.4rem) !important; margin-bottom: 30px; color: var(--primary-color); }
        h3 { font-size: clamp(1.3rem, 3vw, 1.8rem) !important; margin-bottom: 15px; }
        p, li, td { font-size: clamp(0.95rem, 2.5vw, 1.05rem); word-break: keep-all; }
        .btn {
            display: inline-block; padding: 12px clamp(20px, 5vw, 40px);
            font-size: clamp(1rem, 2.5vw, 1.1rem); background-color: var(--accent-color);
            color: #fff; border-radius: 5px; font-weight: bold; transition: 0.3s;
            text-align: center; border: none; cursor: pointer;
        }
        .btn:hover { background-color: #e76f51; }
        .card-grid, .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }

        /* [B] 헤더 스타일 */
        header { width: 100%; height: 70px; background-color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: fixed; top: 0; left: 0; z-index: 9999; }
        .header-inner { display: flex; justify-content: space-between; align-items: center; height: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .logo-img { max-height: 45px; width: auto; }
        ul.nav-menu { display: flex; gap: 30px; }
        .nav-menu > li { position: relative; padding: 20px 0; }
        .nav-menu > li > a { font-size: 1.05rem; font-weight: 600; color: #333; }
        .nav-menu > li > a:hover { color: #f4a261; }
        .dropdown { display: none; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: white; min-width: 160px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; border: 1px solid #eee; padding: 5px 0; z-index: 9999; }
        @media (min-width: 769px) { .nav-menu li:hover .dropdown { display: block; } }
        .dropdown li a { display: block; padding: 10px 15px; font-size: 0.95rem; color: #555; text-align: center; }
        .dropdown li a:hover { background: #f8f9fa; color: #f4a261; font-weight: bold; }
        .mobile-btn { display: none; font-size: 1.8rem; background: none; border: none; cursor: pointer; color: #1a3c6e; padding: 10px; }

        /* [C] 모바일 헤더 */
        @media (max-width: 768px) {
            .mobile-btn { display: block !important; }
            .nav-menu { display: none !important; flex-direction: column; position: absolute; top: 70px; left: 0; width: 100%; background: white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-top: 1px solid #eee; padding: 0; gap: 0; }
            .nav-menu.active { display: flex !important; }
            .nav-menu > li { width: 100%; text-align: center; padding: 0; border-bottom: 1px solid #f9f9f9; }
            .nav-menu > li > a { display: block; padding: 15px 0; width: 100%; }
            .dropdown { display: none !important; position: static; transform: none; box-shadow: none; border: none; background: #f8f9fa; width: 100%; margin: 0; }
            .sub-open .dropdown { display: block !important; }
            .btn { width: 100%; display: block; margin-top: 10px; }
        }

        /* [★중요★] Footer 통합 스타일 */
        footer {
            background-color: #222;
            color: #888;
            padding: 40px 0;
            text-align: center;
            font-size: 0.9rem;
            margin-top: auto; /* 내용이 적어도 항상 바닥에 */
        }
        footer p { margin-bottom: 8px; color: #888; }
        footer .container { padding: 0 20px; }
    `;
    document.head.appendChild(style);

    const headerEl = document.querySelector('header');
    if (headerEl) {
        headerEl.innerHTML = `
            <div class="header-inner">
                <a href="index.html" class="logo-link"><img src="${LOGO_IMAGE_URL}" alt="NEW KIDS" class="logo-img"></a>
                <button class="mobile-btn" onclick="window.toggleMenu()">☰</button>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="index.html">홈으로</a></li>
                    <li><a href="javascript:void(0)" onclick="window.toggleSubMenu(this)">교재소개 ▾</a>
                        <ul class="dropdown"><li><a href="infant.html">👶 영아반</a></li><li><a href="child.html">🧒 유아반</a></li></ul>
                    </li>
                    <li><a href="javascript:void(0)" onclick="window.toggleSubMenu(this)">행사프로그램 ▾</a>
                        <ul class="dropdown"><li><a href="season.html">🎉 시즌 테마</a></li><li><a href="culture.html">🌍 원어민 문화</a></li><li><a href="performance.html">🤹 오감 퍼포먼스</a></li></ul>
                    </li>
                    <li><a href="proposal.html" class="cta-menu">견적요청</a></li>
                </ul>
            </div>
        `;
    }
}

window.toggleMenu = function () { const menu = document.getElementById('navMenu'); if (menu) menu.classList.toggle('active'); };
window.toggleSubMenu = function (el) { if (window.innerWidth <= 768) { el.parentElement.classList.toggle('sub-open'); } };

function loadFooter() {
    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.innerHTML = `
            <div class="container">
                <p>(주)뉴키즈 | 대표: <span id="info_ceo">${DEFAULT_INFO.ceo}</span></p>
                <p>주소: <span id="info_address">${DEFAULT_INFO.address}</span></p>
                <p>문의: <span id="info_phone">${DEFAULT_INFO.phone}</span></p>
                <br>
                <p onclick="handleAdminLogin()" style="cursor:pointer; user-select:none;">&copy; 2026 New Kids. All rights reserved.</p>
            </div>
        `;
    }
}

// [4] 관리자 로그인 함수
let clickCount = 0;
window.handleAdminLogin = async function () {
    clickCount++;
    if (clickCount >= 5) {
        clickCount = 0;
        if (!window.sb) { alert("Supabase 연결 실패"); return; }
        const { data: { session } } = await window.sb.auth.getSession();
        if (session) {
            if (confirm("로그아웃 하시겠습니까?")) { await window.sb.auth.signOut(); location.reload(); }
        } else {
            const email = prompt("관리자 이메일:");
            const password = prompt("비밀번호:");
            if (email && password) {
                const { error } = await window.sb.auth.signInWithPassword({ email, password });
                if (error) alert("실패: " + error.message);
                else location.reload();
            }
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    loadHeader();
    loadFooter();
    loadDataFromSheet();
    setTimeout(() => {
        const phoneTxt = document.getElementById('info_phone') ? document.getElementById('info_phone').innerText : DEFAULT_INFO.phone;
        const callBtns = document.querySelectorAll('a[href^="tel:"]');
        callBtns.forEach(btn => btn.href = "tel:" + phoneTxt.replace(/[^0-9]/g, ""));
    }, 1000);

    document.addEventListener('click', function (e) {
        const menu = document.getElementById('navMenu');
        const btn = document.querySelector('.mobile-btn');
        if (menu && menu.classList.contains('active') && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
});