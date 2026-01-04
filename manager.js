// manager.js - 모바일 메뉴 접기/펴기(아코디언) 기능 완벽 구현

// [1] 설정값
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz68tFmFB7IuCEhLIgnm4RMuqiYlXzdgqDVikGFOODFVuh9wXfdOL4aZ4VFy-7HAsVPjQ/exec";
const LOGO_IMAGE_URL = "https://wjsrlfdnd-gif.github.io/nkids-web/logo.png"; 

const DEFAULT_INFO = {
    company: "(주)뉴키즈",
    ceo: "박홍기",
    address: "경기도 김포시 태장로 765 금광테크노밸리 627호",
    phone: "010-2333-2563 / 010-5522-8109"
};

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

function loadHeader() {
    // 1. 스타일 정의
    const style = document.createElement('style');
    style.innerHTML = `
        /* [PC 기본 스타일] */
        header { 
            width: 100%; height: 70px; background-color: #fff; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
            position: fixed; top: 0; left: 0; z-index: 1000; 
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

        /* PC 드롭다운 (호버 시 보임) */
        .dropdown {
            display: none; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
            background: white; min-width: 160px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-radius: 8px; border: 1px solid #eee; padding: 5px 0; list-style: none; z-index: 9999;
        }
        /* PC에서는 마우스 올리면(hover) 보임 */
        @media (min-width: 769px) {
            .nav-menu li:hover .dropdown { display: block; }
        }
        
        .dropdown li a { display: block; padding: 10px 15px; font-size: 0.95rem; color: #555; text-decoration: none; text-align: center;}
        .dropdown li a:hover { background: #f8f9fa; color: #f4a261; font-weight: bold; }

        /* 삼선 버튼 (기본 숨김) */
        .mobile-btn { display: none; font-size: 1.8rem; background: none; border: none; cursor: pointer; color: #1a3c6e; }

        /* [★ 모바일 전용 스타일 ★] */
        @media (max-width: 768px) {
            .mobile-btn { display: block; }

            /* 전체 메뉴 패널 (기본 숨김) */
            .nav-menu {
                display: none; /* 여기가 핵심: 평소에 안 보임 */
                flex-direction: column; 
                position: absolute; 
                top: 70px; left: 0; width: 100%; 
                background: white; 
                box-shadow: 0 10px 10px rgba(0,0,0,0.1);
                padding: 0; gap: 0;
            }
            
            /* 삼선 버튼 누르면 보임 */
            .nav-menu.active { display: flex; }

            .nav-menu > li { width: 100%; text-align: center; padding: 0; border-bottom: 1px solid #f0f0f0; }
            .nav-menu > li > a { display: block; padding: 15px 0; width: 100%; }

            /* [모바일 드롭다운 제어] */
            /* 1. 기본적으로 숨김 */
            .dropdown { 
                display: none !important; /* PC hover 무시하고 강제 숨김 */
                position: static; transform: none; 
                box-shadow: none; border: none; background: #f8f9fa; width: 100%; margin: 0;
            }
            
            /* 2. 클릭해서 열렸을 때만 보임 (.sub-open 클래스 붙으면) */
            .sub-open .dropdown { display: block !important; }
            
            /* 열린 메뉴 색상 강조 */
            .sub-open > a { color: #f4a261; font-weight: bold; }
        }
        
        .highlight-menu { color: #1a3c6e !important; font-weight: 700 !important; }
        .cta-menu { color: #e76f51 !important; font-weight: 700 !important; }
    `;
    document.head.appendChild(style);

    // 2. HTML 생성
    const headerEl = document.querySelector('header');
    if(headerEl) {
        headerEl.innerHTML = `
            <div class="header-inner">
                <a href="index.html" class="logo-link">
                    <img src="${LOGO_IMAGE_URL}" alt="NEW KIDS" class="logo-img">
                </a>

                <button class="mobile-btn" onclick="toggleMenu()">☰</button>

                <ul class="nav-menu" id="navMenu">
                    <li><a href="index.html">홈으로</a></li>
                    
                    <li>
                        <a href="javascript:void(0)" onclick="toggleSubMenu(this)">교재소개 ▾</a>
                        <ul class="dropdown">
                            <li><a href="infant.html">👶 영아반 (Standard)</a></li>
                            <li><a href="child.html">🧒 유아반 (Premium)</a></li>
                        </ul>
                    </li>

                    <li>
                        <a href="javascript:void(0)" onclick="toggleSubMenu(this)">행사프로그램 ▾</a>
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

// [기능 1] 삼선 메뉴 전체 토글
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// [기능 2] 모바일 하위 메뉴(드롭다운) 토글
function toggleSubMenu(element) {
    // 모바일 화면(폭 768px 이하)에서만 동작하도록 제한
    if (window.innerWidth <= 768) {
        const parentLi = element.parentElement; // 클릭한 a태그의 부모 li
        
        // 이미 열려있으면? -> 닫기
        if (parentLi.classList.contains('sub-open')) {
            parentLi.classList.remove('sub-open');
        } 
        // 닫혀있으면? -> 열기
        else {
            // (선택사항) 다른 메뉴들은 다 닫고 이것만 열고 싶으면 아래 주석 해제
            // document.querySelectorAll('.sub-open').forEach(el => el.classList.remove('sub-open'));
            
            parentLi.classList.add('sub-open');
        }
    }
}

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
