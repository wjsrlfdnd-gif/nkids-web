// manager.js - 모바일 메뉴 클릭 반응 개선 (window 객체 사용)

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz68tFmFB7IuCEhLIgnm4RMuqiYlXzdgqDVikGFOODFVuh9wXfdOL4aZ4VFy-7HAsVPjQ/exec";
const LOGO_IMAGE_URL = "https://wjsrlfdnd-gif.github.io/nkids-web/logo.png"; 

const DEFAULT_INFO = {
    company: "(주)뉴키즈",
    ceo: "박홍기",
    address: "경기도 김포시 태장로 765 금광테크노밸리 627호",
    phone: "010-2333-2563 / 010-5522-8109"
};

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

// [2] 헤더 생성
function loadHeader() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* [PC 기본 스타일] */
        header { 
            width: 100%; height: 70px; background-color: #fff; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
            position: fixed; top: 0; left: 0; z-index: 9999; /* z-index 최상위로 올림 */
        }
        .header-inner { 
            display: flex; justify-content: space-between; align-items: center; 
            height: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; 
        }
        .logo-link { display: flex; align-items: center; height: 100%; }
        .logo-img { max-height: 45px; width: auto; }

        /* PC 메뉴 */
        ul.nav-menu { list-style: none; margin: 0; padding: 0; display: flex; gap: 30px; }
        .nav-menu > li { position: relative; padding: 20px 0; }
        .nav-menu > li > a { font-size: 1.05rem; color: #333; text-decoration: none; font-weight: 600; cursor: pointer; }
        .nav-menu > li > a:hover { color: #f4a261; }

        /* PC 드롭다운 */
        .dropdown {
            display: none; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
            background: white; min-width: 160px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-radius: 8px; border: 1px solid #eee; padding: 5px 0; list-style: none; z-index: 9999;
        }
        @media (min-width: 769px) {
            .nav-menu li:hover .dropdown { display: block; }
        }
        .dropdown li a { display: block; padding: 10px 15px; font-size: 0.95rem; color: #555; text-decoration: none; text-align: center;}
        .dropdown li a:hover { background: #f8f9fa; color: #f4a261; font-weight: bold; }

        /* 삼선 버튼 (PC 숨김) */
        .mobile-btn { display: none; font-size: 1.8rem; background: none; border: none; cursor: pointer; color: #1a3c6e; padding: 10px; }

        /* [★ 모바일 전용 스타일 - 우선순위 강화 ★] */
        @media (max-width: 768px) {
            .mobile-btn { display: block !important; }

            /* 메뉴 패널: 평소엔 안 보임 */
            .nav-menu {
                display: none !important; /* 강제 숨김 */
                flex-direction: column; 
                position: absolute; 
                top: 70px; left: 0; width: 100%; 
                background: white; 
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                border-top: 1px solid #eee;
                padding: 0; gap: 0;
            }
            
            /* [중요] active 클래스가 붙으면 무조건 보임 */
            .nav-menu.active { display: flex !important; }

            .nav-menu > li { width: 100%; text-align: center; padding: 0; border-bottom: 1px solid #f9f9f9; }
            .nav-menu > li > a { display: block; padding: 15px 0; width: 100%; }

            /* 하위 메뉴(드롭다운) 숨김/표시 */
            .dropdown { 
                display: none !important; 
                position: static; transform: none; 
                box-shadow: none; border: none; background: #f8f9fa; width: 100%; margin: 0;
            }
            .sub-open .dropdown { display: block !important; }
            .sub-open > a { color: #f4a261; font-weight: bold; background: #fffbf5; }
        }
        
        .highlight-menu { color: #1a3c6e !important; font-weight: 700 !important; }
        .cta-menu { color: #e76f51 !important; font-weight: 700 !important; }
    `;
    document.head.appendChild(style);

    const headerEl = document.querySelector('header');
    if(headerEl) {
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

                    <li><a href="board.html" class="highlight-menu">📢 소통 게시판</a></li>
                    <li><a href="proposal.html" class="cta-menu">견적요청</a></li>
                </ul>
            </div>
        `;
    }
}

// [핵심 기능 1] 삼선 메뉴 토글 (전역 window 객체에 등록하여 인식 오류 방지)
window.toggleMenu = function() {
    console.log("메뉴 버튼 클릭됨"); // F12 콘솔 확인용
    const menu = document.getElementById('navMenu');
    if (menu) {
        menu.classList.toggle('active');
    } else {
        console.error("메뉴 ID(navMenu)를 찾을 수 없습니다.");
    }
};

// [핵심 기능 2] 하위 메뉴 토글
window.toggleSubMenu = function(element) {
    if (window.innerWidth <= 768) {
        const parentLi = element.parentElement;
        parentLi.classList.toggle('sub-open');
    }
};

// [3] 푸터 생성
function loadFooter() {
    const footerEl = document.querySelector('footer');
    if(footerEl) {
        footerEl.innerHTML = `
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

// 실행
document.addEventListener("DOMContentLoaded", function() {
    loadHeader();
    loadFooter();
    loadDataFromSheet(); 
    
    setTimeout(() => {
        const phoneTxt = document.getElementById('info_phone') ? document.getElementById('info_phone').innerText : DEFAULT_INFO.phone;
        const callBtns = document.querySelectorAll('a[href^="tel:"]');
        callBtns.forEach(btn => btn.href = "tel:" + phoneTxt.replace(/-/g, ""));
    }, 1000); 
});
