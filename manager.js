// manager.js - 디자인이 업그레이드된 헤더/푸터 관리자

// [1] 설정값 (구글 시트 & 로고)
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz68tFmFB7IuCEhLIgnm4RMuqiYlXzdgqDVikGFOODFVuh9wXfdOL4aZ4VFy-7HAsVPjQ/exec";
const LOGO_IMAGE_URL = "https://wjsrlfdnd-gif.github.io/nkids-web/logo.png";

// 기본 정보
const DEFAULT_INFO = {
    company: "(주)뉴키즈",
    ceo: "박홍기",
    address: "경기도 김포시 태장로 765 금광테크노밸리 627호",
    phone: "010-2333-2563 / 010-5522-8109"
};

// [2] 엑셀 데이터 로딩 함수
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
            if (element) {
                element.innerHTML = text.replace(/\\n/g, "<br>");
            }
        });
    } catch (error) { console.error("엑셀 연동 실패:", error); }
}

// [3] ★헤더(메뉴) 만들기 - 보내주신 디자인 적용됨★
function loadHeader() {
    // 1. 스타일 주입 (CSS)
    const style = document.createElement('style');
    style.innerHTML = `
        /* [헤더 전체 스타일] */
        header { 
            width: 100%; 
            height: 70px; 
            background-color: #fff; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.05); /* 그림자 효과 */
            position: fixed; /* 상단 고정 */
            top: 0; 
            left: 0;
            z-index: 1000; 
        }

        /* [내용 정렬] */
        .header-inner { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            height: 100%; 
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* [로고] */
        .logo-link { display: flex; align-items: center; height: 100%; text-decoration: none; }
        .logo-img { max-height: 45px; width: auto; display: block; }

        /* [메뉴 리스트] */
        ul.nav-menu, ul.dropdown { list-style: none !important; margin: 0; padding: 0; }
        .nav-menu { display: flex; gap: 30px; }
        .nav-menu > li { position: relative; padding: 20px 0; } /* 클릭 영역 확보 */
        
        /* [메뉴 링크 글씨] */
        .nav-menu > li > a {
            font-size: 1.05rem;
            color: #333;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }
        .nav-menu > li > a:hover { color: #f4a261; } /* 마우스 올리면 주황색 */

        /* [드롭다운(하위) 메뉴] */
        .dropdown {
            display: none; 
            position: absolute; 
            top: 100%; /* 부모 바로 아래 */
            left: 50%; 
            transform: translateX(-50%); 
            background: white; 
            min-width: 180px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
            border-radius: 8px;
            border: 1px solid #eee; 
            padding: 10px 0; 
            z-index: 9999;
        }
        .nav-menu li:hover .dropdown { display: block; } /* 마우스 올리면 보임 */
        
        .dropdown li a {
            display: block; padding: 12px 20px; font-size: 0.95rem; color: #555;
            text-align: center; white-space: nowrap; transition: 0.2s; text-decoration: none;
        }
        .dropdown li a:hover { background-color: #f8f9fa; color: #f4a261; font-weight: bold; }

        /* [게시판 & 견적요청 강조] */
        .highlight-menu { color: #1a3c6e !important; font-weight: 700 !important; }
        .cta-menu { color: #e76f51 !important; font-weight: 700 !important; }

        /* [모바일 대응 - 일단 숨김 처리] */
        @media (max-width: 768px) { 
            .nav-menu { display: none; } /* 추후 모바일 메뉴 추가 필요 */
            .header-inner { justify-content: center; }
        }
    `;
    document.head.appendChild(style);

    // 2. HTML 주입
    const headerEl = document.querySelector('header');
    if (headerEl) {
        headerEl.innerHTML = `
            <div class="header-inner">
                <a href="index.html" class="logo-link">
                    <img src="${LOGO_IMAGE_URL}" alt="NEW KIDS" class="logo-img">
                </a>

                <ul class="nav-menu">
                    <li><a href="index.html">홈으로</a></li>
                    
                    <li>
                        <a href="index.html#services" style="cursor:default;">교재소개 ▾</a>
                        <ul class="dropdown">
                            <li><a href="infant.html">👶 영아반 (Standard)</a></li>
                            <li><a href="child.html">🧒 유아반 (Premium)</a></li>
                        </ul>
                    </li>

                    <li>
                        <a href="index.html#events" style="cursor:default;">행사프로그램 ▾</a>
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

// [4] 푸터(하단 정보) 만들기
function loadFooter() {
    const footerEl = document.querySelector('footer');
    if (footerEl) {
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

// [5] 실행
document.addEventListener("DOMContentLoaded", function () {
    loadHeader();
    loadFooter();
    loadDataFromSheet();

    // 전화번호 링크 자동 변환
    setTimeout(() => {
        const phoneTxt = document.getElementById('info_phone') ? document.getElementById('info_phone').innerText : DEFAULT_INFO.phone;
        const callBtns = document.querySelectorAll('a[href^="tel:"]');
        callBtns.forEach(btn => btn.href = "tel:" + phoneTxt.replace(/-/g, ""));
    }, 1000);
});