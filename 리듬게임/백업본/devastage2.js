const columns = [document.getElementById('col-0'), document.getElementById('col-1'), document.getElementById('col-2'), document.getElementById('col-3')];
const scoreDisplay = document.getElementById('score');
const panjungPerfect = document.getElementById('panjung-perfect');
const panjungSlow = document.getElementById('panjung-slow');
const panjungFast = document.getElementById('panjung-fast');
const panjungMiss = document.getElementById('panjung-miss');
const fullComboText = document.getElementById('fullcombo');

let score = 0;
let mxcombo =0;
let combo = 0;
let notes = [];
let noteTimings = [];
let nextNoteIndex = 0;
let gameStartTime = 0;
const noteTravelDuration = 900; // 노트 내려오는 시간 (밀리초)

// 노트 객체 생성
function createNote(columnIndex, hitTime) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.dataset.hitTime = hitTime; // 노트 내려올 절대시간 지정
    columns[columnIndex].appendChild(note);
    notes.push({ element: note, columnIndex: columnIndex, hitTime: hitTime });
}

// 게임 시작
function startGame() {
    gameStartTime = performance.now(); // 게임 시작 시간 저장
    requestAnimationFrame(updateGame);
}
// 점수 계산
function calculateScore(panjung) {
    let comboBonus = Math.floor(combo / 10) * 100;
    if(panjung==1){
        return 1000 + comboBonus;
    }else if(panjung==2){
        return 500 + comboBonus;
    }else{
        return 0;
    }
}
// 게임 업데이트
function updateGame() {
    const currentTime = performance.now() - gameStartTime;

    // 노트 생성 (채보 데이터 기반)
    while (nextNoteIndex < noteTimings.length && noteTimings[nextNoteIndex].time - noteTravelDuration <= currentTime) {
        const noteData = noteTimings[nextNoteIndex];
        createNote(noteData.column, noteData.time);
        nextNoteIndex++;
    }

    // 노트 이동 및 판정
    notes.forEach((note, index) => {
        const timeToHit = note.hitTime - currentTime; // 남은 시간
        note.element.style.top = `${(1 - timeToHit / noteTravelDuration) * 600}px`; // top 위치 조정 (절대시간 기반)

        // 노트가 판정선을 지나갔을 때 (미스 처리)
        if (timeToHit <= -300) { // Miss 판정 시간 이후
            note.element.remove();
            notes.splice(index, 1);
            combo = 0; // 콤보 초기화
            updateScoreDisplay();
            const animatedDiv = document.getElementById("score");

            // 애니메이션을 시작하는 함수
            function playAnimation() {
                animatedDiv.style.animation = 'grow-shrink-shake 0.3s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv.addEventListener("animationend", () => {
                    animatedDiv.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation();
            const animatedDiv1 = document.getElementById("panjung-miss");

            // 애니메이션을 시작하는 함수
            function playAnimation1() {
                animatedDiv1.style.animation = 'panjung 0.2s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv1.addEventListener("animationend", () => {
                    animatedDiv1.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation1();
        }
    });
    if (nextNoteIndex >= noteTimings.length && notes.length === 0) {
        setTimeout(endGame, 2000); // 노트가 모두 사라지면 endGame 호출
    } else {
        requestAnimationFrame(updateGame); // 남아있을 경우 계속 갱신
    }
}

// 판정 및 키보드 이벤트 처리
window.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    let columnIndex = null;

    if (key === 'D') {columnIndex = 0;
        function startAnimation1() {
            const box = document.getElementById('white1');
            
            // 애니메이션을 적용하고, 애니메이션이 끝난 후 클래스를 제거하여 다시 실행 가능하게 설정
            box.classList.add('animate-fade');
            box.addEventListener('animationend', () => {
                box.classList.remove('animate-fade');
            }, { once: true });
        }
        startAnimation1();
    }
    else if (key === 'F') {columnIndex = 1;
        function startAnimation1() {
            const box = document.getElementById('white2');
            
            // 애니메이션을 적용하고, 애니메이션이 끝난 후 클래스를 제거하여 다시 실행 가능하게 설정
            box.classList.add('animate-fade');
            box.addEventListener('animationend', () => {
                box.classList.remove('animate-fade');
            }, { once: true });
        }
        startAnimation1();
    }
    else if (key === 'J') {columnIndex = 2;
        function startAnimation1() {
            const box = document.getElementById('white3');
            
            // 애니메이션을 적용하고, 애니메이션이 끝난 후 클래스를 제거하여 다시 실행 가능하게 설정
            box.classList.add('animate-fade');
            box.addEventListener('animationend', () => {
                box.classList.remove('animate-fade');
            }, { once: true });
        }
        startAnimation1();
    }
    else if (key === 'K') {columnIndex = 3;
        function startAnimation1() {
            const box = document.getElementById('white4');
            
            // 애니메이션을 적용하고, 애니메이션이 끝난 후 클래스를 제거하여 다시 실행 가능하게 설정
            box.classList.add('animate-fade');
            box.addEventListener('animationend', () => {
                box.classList.remove('animate-fade');
            }, { once: true });
        }
        startAnimation1();
    }

    if (columnIndex !== null) {
        checkHit(columnIndex);
    }
});

// 노트 히트 확인
function checkHit(columnIndex) {
    const currentTime = performance.now() - gameStartTime;
    const notesInColumn = notes.filter(note => note.columnIndex === columnIndex);

    // 가장 가까운 노트 찾기
    let closestNote = null;
    let smallestTimeDiff = Infinity;
    let notefar = null;
    let snotefar = null;
    for (const note of notesInColumn) {
        const timeDiff = Math.abs(note.hitTime - currentTime);
        notefar=note.hitTime - currentTime;
        if (timeDiff < smallestTimeDiff) {
            smallestTimeDiff = timeDiff;
            snotefar=notefar;
            closestNote = note;
        }
    }

    if (closestNote && smallestTimeDiff <= 300) { // 판정 범위 내에 있을 경우
        // 판정 기준 (Perfect, Fast, Slow)
        if (snotefar <= 40&&snotefar >= -40) {
            score += calculateScore(1);
            combo++;
            mxcombo=Math.max(mxcombo,combo);
            const animatedDiv = document.getElementById("score");

            // 애니메이션을 시작하는 함수
            function playAnimation() {
                animatedDiv.style.animation = 'grow-shrink-shake 0.3s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv.addEventListener("animationend", () => {
                    animatedDiv.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation();
            const animatedDiv1 = document.getElementById("panjung-perfect");

            // 애니메이션을 시작하는 함수
            function playAnimation1() {
                animatedDiv1.style.animation = 'panjung 0.2s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv1.addEventListener("animationend", () => {
                    animatedDiv1.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation1();
        } else if (snotefar <= 80&&snotefar >= 40) {
            score += calculateScore(2);
            combo++;
            mxcombo=Math.max(mxcombo,combo);
            const animatedDiv = document.getElementById("score");

            // 애니메이션을 시작하는 함수
            function playAnimation() {
                animatedDiv.style.animation = 'grow-shrink-shake 0.3s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv.addEventListener("animationend", () => {
                    animatedDiv.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation();
            const animatedDiv1 = document.getElementById("panjung-fast");

            // 애니메이션을 시작하는 함수
            function playAnimation1() {
                animatedDiv1.style.animation = 'panjung 0.2s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv1.addEventListener("animationend", () => {
                    animatedDiv1.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation1();
        } else if (snotefar <= -40&&snotefar >= -80) {
            score += calculateScore(2);
            combo++;
            mxcombo=Math.max(mxcombo,combo);
            const animatedDiv = document.getElementById("score");

            // 애니메이션을 시작하는 함수
            function playAnimation() {
                animatedDiv.style.animation = 'grow-shrink-shake 0.3s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv.addEventListener("animationend", () => {
                    animatedDiv.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation();
            const animatedDiv1 = document.getElementById("panjung-slow");

            // 애니메이션을 시작하는 함수
            function playAnimation1() {
                animatedDiv1.style.animation = 'panjung 0.2s forwards'; // 애니메이션 시작

                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv1.addEventListener("animationend", () => {
                    animatedDiv1.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation1();
        }else {
            combo = 0;
            updateScoreDisplay();
            const animatedDiv = document.getElementById("score");
    
                // 애니메이션을 시작하는 함수
                function playAnimation() {
                    animatedDiv.style.animation = 'grow-shrink-shake 0.3s forwards'; // 애니메이션 시작
    
                    // 애니메이션이 끝난 후 원래 상태로 되돌리기
                    animatedDiv.addEventListener("animationend", () => {
                        animatedDiv.style.animation = '';
                    }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
                }
                playAnimation();
            const animatedDiv1 = document.getElementById("panjung-miss");
    
            // 애니메이션을 시작하는 함수
            function playAnimation1() {
                animatedDiv1.style.animation = 'panjung 0.2s forwards'; // 애니메이션 시작
    
                // 애니메이션이 끝난 후 원래 상태로 되돌리기
                animatedDiv1.addEventListener("animationend", () => {
                    animatedDiv1.style.animation = '';
                }, { once: true }); // 애니메이션이 끝난 후 다시 이벤트를 추가하지 않도록 설정
            }
            playAnimation1();
        }

        updateScoreDisplay();
        closestNote.element.remove();
        notes = notes.filter(note => note !== closestNote);
    } 
}
// 점수 및 콤보 업데이트
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score} | Combo: ${combo}`;
}

// 채보 데이터 파싱
function parseNoteTimings(lines) {
    const [BPM, beatsPerMeasure, syncTime] = lines[0].split(' ').map(Number);  
    const beatInterval = 60000 / BPM; // BPM을 사용해 한 비트 길이 계산 (밀리초)
    let startSyncTime = syncTime || 0;  

    let currentMeasure = 0;
    let currentTime = 0;

    noteTimings = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '-') {  // 마디 구분
            currentMeasure++;
            currentTime = currentMeasure * beatsPerMeasure * beatInterval;
            continue;
        }

        const [beat, column] = line.split(' ').map(Number);
        const time = currentTime + (beat - 1) * beatInterval;

        // startSyncTime을 반영한 노트 타이밍 설정
        noteTimings.push({ time: time + startSyncTime, column });
    }
}

// 게임 시작 시 시간 동기화 및 채보 로드
window.addEventListener("load", () => {
    fetch('./beats.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n').map(line => line.trim()).filter(line => line);
            parseNoteTimings(lines);
            startGame(); // 게임 시작 호출
        })
        .catch(error => console.error('채보 파일을 불러오는 중 오류 발생:', error));
});
function endGame() {
    const finalScore = score;
    const finalMaxCombo = mxcombo;

    // 게임 성적에 따라 메시지 설정
    let message;
    if (finalScore >= 3600) {
        message = 'Full combo!';
        function startAnimation4() {
            const box = document.getElementById('fullcombo');
            
            // 애니메이션을 적용하고, 애니메이션이 끝난 후 클래스를 제거하여 다시 실행 가능하게 설정
            box.classList.add('animate-fullcombo');
            box.addEventListener('animationend', () => {
                box.classList.remove('animate-fullcombo');
            }, { once: true });
        }
        startAnimation4();
    } else if (finalScore >= 2400&&finalScore < 3600) {
        message = 'Perfect!';
    } else if (finalScore >= 1800&&finalScore < 2400) {
        message = 'Great!';
    } else if (finalScore >= 1000&&finalScore < 1800) {
        message = 'Good!';
    }else if (finalScore >= 500&&finalScore < 1000) {
        message = 'Bad!';
    }else {
        message = 'Fail!';
    }
    setTimeout(goresult, 1000);
    function goresult(){
        // 결과 화면으로 이동하며 점수와 콤보, 메시지를 전달
        window.location.href = `result.html?score=${finalScore}&maxCombo=${finalMaxCombo}&message=${encodeURIComponent(message)}`;
    }
}