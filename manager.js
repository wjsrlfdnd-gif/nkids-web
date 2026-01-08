// manager.js - 통합 관리자 (디자인 + 데이터베이스 연결)

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz68tFmFB7IuCEhLIgnm4RMuqiYlXzdgqDVikGFOODFVuh9wXfdOL4aZ4VFy-7HAsVPjQ/exec";
const LOGO_IMAGE_URL = "https://wjsrlfdnd-gif.github.io/nkids-web/logo.png";
// [Supabase 설정 정보] - 이곳에서 한 번만 설정하면 모든 페이지에 적용됩니다.
const SUPABASE_URL = "https://chmpykdpiwmotmfenirr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobXB5a2RwaXdtb3RtZmVuaXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTQ0NDksImV4cCI6MjA4MzA5MDQ0OX0.vL8_JBLEWXgrvjtfcoZ5BeqFiIRhFKrItx47VzDdmjQ";

const DEFAULT_INFO = {
    company: "(주)뉴키즈",
    ceo: "박홍기",
    address: "경기도 김포시 태장로 765 금광테크노밸리 627호",
    phone: "010-2333-2563 / 010-5522-8109"
};

// [0] 초기화 및 Supabase 연결
(function initSystem() {
    // 뷰포트 설정
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        document.head.prepend(meta);
    }

    // Supabase 연결 (라이브러리가 로드된 경우에만 실행)
    if (typeof supabase !== 'undefined') {
        window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase Connected via manager.js");
    }
})();

// [1] 데이터 로딩
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

// [2] 헤더 및 전체 스타일 로드
function loadHeader() {
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --primary-color: #1a3c6e; --accent-color: #f4a261; --bg-light: #f8f9fa; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
            font-size: 16px; color: #333; line-height: 1.6;
            padding-top: 70px;
        }
        a { text-decoration: none; color: inherit; }
        ul { list-style: none; }
        
        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; width: 100%; }
        section { padding: 80px 0; }
        
        h2 { font-size: 2.2rem; text-align: center; margin-bottom: 20px; color: var(--primary-color); font-weight: 700; }
        .section-desc { text-align: center; color: #666; margin-bottom: 50px; font-size: 1.1rem; }
        
        .btn {
            display: inline-block; padding: 12px 30px;
            background-color: var(--accent-color); color: #fff;
            border-radius: 5px; font-weight: bold; transition: 0.3s;
            border: none; cursor: pointer; text-align: center;
        }
        .btn:hover { background-color: #e76f51; }

        .sub-hero {
            height: 350px;
            background-size: cover; background-position: center center; background-repeat: no-repeat;
            display: flex; align-items: center; justify-content: center;
            text-align: center; color: #fff; margin-top: 0;
        }
        .sub-hero h1 { font-size: 3.2rem; font-weight: 800; margin-bottom: 20px; text-shadow: 0 4px 10px rgba(0,0,0,0.8); letter-spacing: -1px; }
        .sub-hero p { font-size: 1.4rem; font-weight: 600; color: #ffdca8; text-shadow: 0 2px 5px rgba(0,0,0,0.8); }

        header { width: 100%; height: 70px; background-color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: fixed; top: 0; left: 0; z-index: 9999; }
        .header-inner { display: flex; justify-content: space-between; align-items: center; height: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .logo-link { display: flex; align-items: center; height: 100%; }
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
        @media (max-width: 768px) {
            .mobile-btn { display: block !important; }
            .nav-menu { display: none !important; flex-direction: column; position: absolute; top: 70px; left: 0; width: 100%; background: white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-top: 1px solid #eee; padding: 0; gap: 0; }
            .nav-menu.active { display: flex !important; }
            .nav-menu > li { width: 100%; text-align: center; padding: 0; border-bottom: 1px solid #f9f9f9; }
            .nav-menu > li > a { display: block; padding: 15px 0; width: 100%; }
            .dropdown { display: none !important; position: static; transform: none; box-shadow: none; border: none; background: #f8f9fa; width: 100%; margin: 0; }
            .sub-open .dropdown { display: block !important; }
            .sub-hero h1 { font-size: 2.2rem; }
        }
        .cta-menu { color: #e76f51 !important; font-weight: 700 !important; }
    `;
    document.head.appendChild(style);

    const headerEl = document.querySelector('header');
    if (headerEl) {
        headerEl.innerHTML = `
            <div class="header-inner">
                <a href="index.html" class="logo-link">
                    <img src="${LOGO_IMAGE_URL}" alt="NEW KIDS" class="logo-img">
                </a>
                <button class="mobile-btn" onclick="window.toggleMenu()">☰</button>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="index.html">홈으로</a></li>
                    <li>
                        <a href="javascript:void(0)" onclick="window.toggleSubMenu(this)">교재소개 ▾</a>
                        <ul class="dropdown">
                            <li><a href="infant.html">👶 영아반 (Standard)</a></li>
                            <li><a href="child.html">🧒 유아반 (Premium)</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick="window.toggleSubMenu(this)">행사프로그램 ▾</a>
                        <ul class="dropdown">
                            <li><a href="season.html">🎉 시즌 테마 행사</a></li>
                            <li><a href="culture.html">🌍 원어민 문화 체험</a></li>
                            <li><a href="performance.html">🤹 오감 퍼포먼스</a></li>
                        </ul>
                    </li>
                    <li><a href="proposal.html" class="cta-menu">견적요청</a></li>
                </ul>
            </div>
        `;
    }
}

// 기능
window.toggleMenu = function () {
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('active');
};
window.toggleSubMenu = function (element) {
    if (window.innerWidth <= 768) {
        element.parentElement.classList.toggle('sub-open');
    }
};

// [3] 푸터 생성
function loadFooter() {
    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.innerHTML = `
            <style>
                footer { background: #222; color: #888; padding: 40px 0; text-align: center; }
            </style>
            <div class="container">
                <p>(주)뉴키즈 | 대표: <span id="info_ceo">${DEFAULT_INFO.ceo}</span></p>
                <p>주소: <span id="info_address">${DEFAULT_INFO.address}</span></p>
                <p>문의: <span id="info_phone">${DEFAULT_INFO.phone}</span></p>
                <br>
                <p>&copy; 2026 New Kids. All rights reserved.</p>
            </div>
        `;
    }
}

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
        if (menu && menu.classList.contains('active')) {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove('active');
            }
        }
    });
});