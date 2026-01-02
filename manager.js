// manager.js - 이미지 로고 적용 버전

// [1] 구글 스프레드시트 주소 (기존 주소 그대로 유지하세요)
const SHEET_URL = "여기에_아까_복사한_구글시트_주소를_붙여넣으세요";

// [★중요★] 여기에 사장님의 진짜 로고 이미지 주소를 넣으세요!
// 지금은 테스트용 임시 이미지가 들어있습니다.
const LOGO_IMAGE_URL = "file:///C:/Users/wjsrl/OneDrive/바탕%20화면/뉴키즈%20홈페이지/logo.png";


// 기본 정보
const DEFAULT_INFO = {
    company: "(주)뉴키즈",
    ceo: "박홍기",
    address: "경기도 김포시 태장로 765 금광테크노밸리 627호",
    phone: "010-2333-2563 / 010-5522-8109"
};

// [3] 엑셀 데이터 로딩 함수
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
        console.log("엑셀 데이터 연동 완료!");
    } catch (error) {
        console.error("엑셀 연동 실패 (주소를 확인하세요):", error);
    }
}

// [4] 헤더(메뉴) 만들기 - ★여기에 퍼포먼스 메뉴가 추가되었습니다★
function loadHeader() {
    // 1. 스타일 주입 (로고, 드롭다운)
    const style = document.createElement('style');
    style.innerHTML = `
        .nav-menu li { position: relative; padding: 10px 0; }
        .dropdown {
            display: none; position: absolute; top: 100%; left: 50%; 
            transform: translateX(-50%); background: white; min-width: 200px; /* 메뉴가 길어져서 너비 늘림 */
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px;
            border: 1px solid #eee; padding: 10px 0; z-index: 9999;
        }
        .nav-menu li:hover .dropdown { display: block; }
        .dropdown li a {
            display: block; padding: 12px 20px; font-size: 0.95rem; color: #555;
            text-align: center; white-space: nowrap; transition: 0.2s;
        }
        .dropdown li a:hover { background-color: #f8f9fa; color: #f4a261; font-weight: bold; }
        
        .logo-link { display: flex; align-items: center; height: 100%; }
        .logo-img { max-height: 50px; width: auto; display: block; }

        @media (max-width: 768px) { .dropdown { display: none !important; } }
    `;
    document.head.appendChild(style);

    // 2. 헤더 HTML 교체
    document.querySelector('header').innerHTML = `
        <div class="container header-inner">
            <a href="index.html" class="logo-link">
                <img src="${LOGO_IMAGE_URL}" alt="NEW KIDS 로고" class="logo-img">
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

                <li><a href="proposal.html" style="color:#1a3c6e; font-weight:bold;">견적요청</a></li>
		<li><a href="login.html" style="background:#1a3c6e; color:#fff; padding:8px 15px; border-radius:20px; font-size:0.9rem;">Login</a></li>
            </ul>
        </div>
    `;
}

// [5] 푸터(하단 정보) 만들기
function loadFooter() {
    document.querySelector('footer').innerHTML = `
        <div class="container">
            <p>(주)뉴키즈 | 대표: <span id="info_ceo">${DEFAULT_INFO.ceo}</span></p>
            <p>주소: <span id="info_address">${DEFAULT_INFO.address}</span></p>
            <p>문의: <span id="info_phone">${DEFAULT_INFO.phone}</span></p>
            <br>
            <p>&copy; 2026 New Kids. All rights reserved.</p>
        </div>
    `;
}

// [6] 실행
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