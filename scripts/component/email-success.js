document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 중단

        const formData = new FormData(form); // 폼 데이터 수집

        try {
            // 데이터를 Google Apps Script로 전송
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
            });

            if (response.ok) {
                // 성공 메시지 표시
                alert("이메일이 성공적으로 전송되었습니다!");
                form.reset(); // 폼 초기화
            } else {
                throw new Error("전송 실패. 다시 시도해주세요.");
            }
        } catch (error) {
            // 오류 메시지 표시
            alert(error.message);
        }
    });
});
