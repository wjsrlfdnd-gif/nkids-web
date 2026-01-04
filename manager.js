// manager.js - 모바일 삼선 메뉴(햄버거) 기능 추가 완료

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
    // 1. 스타일 정의 (모바일 반응형 포함)
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

        /* 메뉴 리스트 */
        ul.nav-menu { list-style: none; margin: 0; padding: 0; display: flex; gap: 30px; }
        .nav-menu > li { position: relative; padding: 20px 0; }
        .nav-menu > li > a { font-size: 1.05rem; color: #333; text-decoration: none; font-weight: 600; }
        .nav-menu > li > a:hover { color: #f4a261; }

        /* 드롭다운 */
        .dropdown {
            display: none; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
            background: white; min-width: 160px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-radius: 8px; border: 1px solid #eee; padding: 5px 0; list-style: none; z-index: 9999;
        }
        .nav-menu li:hover .dropdown { display: block; }
        .dropdown li a { display: block; padding: 10px 15px; font-size: 0.95rem; color: #555; text-decoration: none; text-align: center;}
        .dropdown li a:hover { background: #f8f9fa; color: #f4a261; font-weight: bold; }

        /* 삼선 메뉴 버튼 (PC에서는 숨김) */
        .mobile-btn { display: none; font-size: 1.8rem; background: none; border: none; cursor: pointer; color: #1a3c6e; }

        /* [★ 모바일 전용 스타일 ★] */
        @media (max-width: 768px) {
            /* 삼선 버튼 보이기 */
            .mobile-btn { display: block; }

            /* 메뉴 숨기기 (기본) */
            .nav-menu {
                display: none; 
                flex-direction: column; 
                position: absolute; 
                top: 70px; left: 0; width: 100%; 
                background: white; 
                box-shadow: 0 10px 10px rgba(0,0,0,0.05);
                padding: 0; gap: 0;
            }
            
            /* 메뉴 열렸을 때 (.active 클래스 추가시) */
            .nav-menu.active { display: flex; }

            .nav-menu > li { width: 100%; text-align: center; padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
            
            /* 모바일에서 드롭다운은 항상 보이게 하거나 클릭으로 처리 (여기선 펼쳐서 보여줌) */
            .nav-menu li:hover .dropdown { display: none; } /* 호버 끄기 */
            .dropdown { 
                display: block; position: static; transform: none; 
                box-shadow: none; border: none; background: #f8f9fa; width: 100%; margin-top: 10px;
            }
            .dropdown li a { padding: 10px 0; font-size: 0.9rem; color: #666; }
        }
        
        .highlight-menu { color: #1a3c6e !important; font-weight: 700 !important; }
        .cta-menu { color: #e76f51 !important; font-weight: 700 !important; }
    `;
    document.head.appendChild(style);

    // 2. HTML 구조 생성 (삼선 버튼 추가)
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
                        <a href="javascript:void(0)" style="cursor:default;">교재소개 ▾</a>
                        <ul class="dropdown">
                            <li><a href="infant.html">👶 영아반 (Standard)</a></li>
                            <li><a href="child.html">🧒 유아반 (Premium)</a></li>
                        </ul>
                    </li>

                    <li>
                        <a href="javascript:void(0)" style="cursor:default;">행사프로그램 ▾</a>
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

// [모바일 메뉴 토글 함수]
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    // active 클래스를 껐다 켰다 함 (CSS에서 display: flex로 변함)
    menu.classList.toggle('active');
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
