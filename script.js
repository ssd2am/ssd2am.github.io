async function updateNowBox() {
    try {
        const response = await fetch('now.json');
        
        if (!response.ok) throw new Error('파일을 찾을 수 없습니다.');

        const data = await response.json();

        const dateElement = document.querySelector('.now-date');
        const contentElement = document.querySelector('.now-content');

        if (dateElement) {
            dateElement.innerText = data.date;
        }
        if (contentElement) {
            contentElement.innerHTML = data.content;
        }

        console.log("나우 박스 업데이트 완료! ✨");

    } catch (error) {
        console.error('데이터 로딩 중 에러 발생:', error);
    }
}

window.onload = updateNowBox;