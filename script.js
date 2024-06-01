// 스크롤 이동
function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location - 20, behavior: 'smooth'});
}

// 모바일 버전
function loadMobileCSS() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "phone.css";
    document.head.appendChild(link);
    var mobileButton = document.querySelector('.mobile-button');
    mobileButton.style.display = 'none';  
}     

// 맛집 정보 객체
const restaurantInfo = {
    '콩불': { name: '콩불 팟', time: '13:00 PM - 14:00 PM', people: '4-6', menu: '불고기, 볶음밥' },
    '방콕스토리': { name: '방콕스토리 팟', time: '12:30 PM - 13:30 PM', people: '2-4', menu: '팟타이, 똠양꿍' },
    '겐코': { name: '겐코 팟', time: '11:30 AM - 12:50 PM', people: '2-6', menu: '덮밥, 라멘' },
    '유가네 닭갈비': { name: '유가네 닭갈비 팟', time: '11:00 AM - 12:00 PM', people: '4-8', menu: '닭갈비, 치즈볶음밥' },
    '광교연탄불고기': { name: '광교연탄불고기 팟', time: '17:00 PM - 18:00 PM', people: '4-6', menu: '불고기, 삼겹살' }
};

// 클릭 시 기존 article 숨기고 새로운 article 보여주는 함수
function showArticle(event, restaurantName) {
    event.preventDefault();
    // 현재 스크롤 위치 저장
    var scrollPosition = window.scrollY || document.documentElement.scrollTop;
    document.getElementById("oldArticle").style.display = "none";
    document.getElementById("newArticle").style.display = "block";
    // 맛집 정보 가져오기
    var info = restaurantInfo[restaurantName];
    // newArticle 내용 업데이트
    newArticle.innerHTML = `
        <p class="pod-title">${info.name}</p>
        <p class="pod-info">✅시간: ${info.time}\n</p>
        <p class="pod-info">✅인원: ${info.people}\n</p>
        <p class="pod-info">✅메뉴: ${info.menu}\n</p>
        <button class="pod-button" onclick="reserve('${restaurantName}'); showNotification()">참여하기</button>
    `;
    // 저장된 스크롤 위치로 다시 스크롤
    window.scrollTo(0, scrollPosition);

    // 마커 크기 변경 기능 추가
    // 모든 마커를 원래 크기로 되돌립니다
    for (var i = 0; i < markers.length; i++) {
        markers[i].setImage(new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(35, 35)));
    }

    // 클릭된 마커를 찾고 크기를 변경합니다
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].getTitle() === restaurantName) {
            markers[i].setImage(new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(50, 50)));
            map.panTo(markers[i].getPosition());
            break;
        }
    }
}
function reserve(restaurantName) {
    alert(`${restaurantName} 팟에 참여 신청했어요.`);
}
function showNotification() {
    var notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    var icon = document.createElement("div");
    icon.classList.add("notification-icon");
    notificationElement.appendChild(icon);
    var notificationArea = document.getElementById("notificationArea");
    notificationArea.appendChild(notificationElement);
}

// 밥비티아이
let answersNQ = [];
let answersFS = [];
let answersTA = [];
let currentPhase = 1;

function selectAnswer(answer) {
    if (currentPhase === 1) {
        answersNQ.push(answer);
    } else if (currentPhase === 2) {
        answersFS.push(answer);
    } else {
        answersTA.push(answer);
    }
    showNextQuestion();
}

function showNextQuestion() {
    const totalQuestions = 9;
    const currentQuestionIndex = answersNQ.length + answersFS.length + answersTA.length;
    const currentQuestion = document.getElementById(`question${currentQuestionIndex}`);
    if (currentQuestion) {
        currentQuestion.style.display = 'none';
    }

    const nextQuestion = document.getElementById(`question${currentQuestionIndex + 1}`);
    if (nextQuestion) {
        nextQuestion.style.display = 'block';
        if (currentQuestionIndex === 2) {
            currentPhase = 2; // Change to phase 2 after the third question
        } else if (currentQuestionIndex === 5) {
            currentPhase = 3; // Change to phase 3 after the sixth question
        }
    } else {
        const { resultText, resultImage } = showResult(); // 저장된 결과를 가져옴
        const resultCard = document.getElementById('result-card');
        resultCard.querySelector('span').textContent = result; // 결과 텍스트 출력
        resultCard.querySelector('img').src = resultImage; //결과 이미지 출력
        resultCard.style.display = 'block';
    }
}

function showResult() {
    const nCount = answersNQ.filter(answer => answer === 'N').length;
    const qCount = answersNQ.filter(answer => answer === 'Q').length;
    const fCount = answersFS.filter(answer => answer === 'F').length;
    const sCount = answersFS.filter(answer => answer === 'S').length;
    const tCount = answersTA.filter(answer => answer === 'T').length;
    const aCount = answersTA.filter(answer => answer === 'A').length;

    const resultNQ = nCount > qCount ? 'N' : 'Q';
    const resultFS = fCount > sCount ? 'F' : 'S';
    const resultTA = tCount > aCount ? 'T' : 'A';

    // 밥BTI 이름을 각 결과값에 매핑
    const bbtiNames = {
        'NFT': { 
            name: '보글보글 라면', 
            image: 'images/ramyeon.png', 
            description: '당신은 보글보글 라면 입니다. &nbsp; 남녀노소 누구나 좋아할 것 같은 당신은 사람도 좋아하고 밥도 맛있게 먹는군요. &nbsp; 인기가 많아 약속도 많고 바쁘지만, 자기 자신을 챙기는 시간도 중요하다는 점.&nbsp; 잊지 말고 혼자만의 시간도 가져보도록 해요. \n\n\n',
            match: '🩷잘 맞아요: 매콤한 카레라이스\n🩶별로예요: 고소한 간장계란밥' 
            },
        'NFA': { 
            name: '후루룩 국수', 
            image: 'images/noodle.png', 
            description: '당신은 후루룩 국수 입니다. &nbsp; 무엇이든 열정적으로 하는 당신에게 끌리는 사람이 많군요. &nbsp; 하지만 뜨거운 국수를 너무 빨리 먹으면 다칠 수 있어요. &nbsp; 가끔은 주위를 둘러보고 천천히, 다른 사람과 함께 하는 시간도 가져보도록 해요. \n\n\n',  
            match: '🩷잘 맞아요: 맛있는 비빔밥\n🩶별로예요: 담백한 야채죽'
        },
        'NST': { 
            name: '뜨끈한 국밥', 
            image: 'images/gukbap.png', 
            description: '당신은 뜨끈한 국밥 입니다. &nbsp; 호탕하고 매력적인 당신은 언제나 사람들이 좋아하는 사람이에요. &nbsp; 인생을 즐기기 위해 최선을 다하는군요. &nbsp; 하지만 가끔은 불안해지기도 하는 마음, 충분히 잘하고 있으니 힘을 내서 나아가봐요.  \n\n\n',
            match: '🩷잘 맞아요: 담백한 야채죽\n🩶별로예요: 맛있는 비빔밥'  
        },
        'NSA': { 
            name: '상큼한 샌드위치', 
            image: 'images/sandwich.png', 
            description: '당신은 상큼한 샌드위치 입니다. &nbsp;당신은 한 번쯤 눈길이 가는 사람이군요.&nbsp; 특별한 매력을 가진 당신은 스스로에게 솔직하고 행복해지는 방법을 알고 있어요. &nbsp; 잠재력을 믿고, 오늘보다 더 나은 내일을 위해 힘을 내서 노력해 봐요. \n\n\n',  
            match: '🩷잘 맞아요: 고소한 간장계란밥\n🩶별로예요: 매콤한 카레라이스'  
        },
        'QFT': { 
            name: '매콤한 카레라이스', 
            image: 'images/curry.png', 
            description: '당신은 매콤한 카레라이스 입니다. &nbsp; 반전 매력을 가진 당신은 무엇이든 척척 해내는군요. &nbsp; 능력 있고 때로는 다정한 모습에 주변인들이 당신을 무척 좋아해요. &nbsp; 하지만 너무 완벽해지려고 하다 보면 지칠 수도 있어요. 때로는 여유를 가져봐요. \n\n\n',  
            match: '🩷잘 맞아요: 보글보글 라면\n🩶별로예요: 상큼한 샌드위치'
        },
        'QFA': { 
            name: '맛있는 비빔밥', 
            image: 'images/bibim.png', 
            description: '당신은 맛있는 비빔밥 입니다. &nbsp; 남들에게 피해주지 않으면서도 조화롭게 어우러지는 당신은 반짝이는 잠재력을 지녔어요. &nbsp; 넘치지도, 모자라지도 않고 맡은 일은 잘 해내는 당신. &nbsp; 잘하고 있어요. &nbsp; 때로는 주변을 둘러보기도 하고 어떤 걸 할 때 행복한지 찾아봐요.  \n\n\n',  
            match: '🩷잘 맞아요: 후루룩 국수\n🩶별로예요: 상큼한 샌드위치'
        },
        'QST': { 
            name: '담백한 야채죽', 
            image: 'images/vegetable.png', 
            description: '당신은 담백한 야채죽 입니다. &nbsp; 타인을 배려하고 따뜻한 마음을 가진 당신에게 사람들은 편안함을 느끼고, 함께하고 싶어 하는군요. &nbsp; 주변의 행복만 신경 쓰다 보면 중요한 게 무엇인지 잊을 수 있어요. &nbsp; 자기 자신을 가장 따뜻하게 대해주세요.  \n\n\n',  
            match: '🩷잘 맞아요: 뜨끈한 국밥\n🩶별로예요: 후루룩 국수'
        },
        'QSA': { 
            name: '고소한 간장계란밥', 
            image: 'images/egg.png', 
            description: '당신은 고소한 간장계란밥 입니다. &nbsp; 자신만의 개성이 뚜렷한 당신은 흔들리지 않고 행복을 찾아가는 사람이군요. &nbsp; 다정한 당신은 충분히 좋은 사람이에요. &nbsp; 당신과 친해지고 싶어 하는 사람들에게 곁을 내주면 더 행복해질 거예요. \n\n\n',
            match: '🩷잘 맞아요: 상큼한 샌드위치\n🩶별로예요: 보글보글 라면'  
        }
    };

    // 결과 조합으로 밥 이름 가져오기
    const result = bbtiNames[resultNQ + resultFS + resultTA];
    const resultCard = document.getElementById('result-card');
    resultCard.querySelector('span').textContent = `${result.name}`; // 결과 텍스트 출력
    resultCard.querySelector('img').src = result.image;//이미지 경로 설정
    resultCard.querySelector('p.result-description').innerHTML = result.description.replace(/\n/g, '<br>'); // 설명 출력
    resultCard.querySelector('p.result-match').innerHTML = result.match.replace(/\n/g, '<br>'); // 매칭 출력
    resultCard.style.display = 'block';
}

function goHome() {
    window.location.href = '밥약.html';
}

window.onload = function() {
    showNextQuestion();
}
