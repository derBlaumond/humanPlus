/* 애니메이션 효과 설정 */
document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer 설정
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 요소가 뷰포트에 들어오면 animate 클래스를 추가
            entry.target.classList.add('animate');
            // 관찰 중지
            observer.unobserve(entry.target);
        }
        });
});
    
// 애니메이션 대상 요소 선택
const targets = document.querySelectorAll('.fade-in, .fade-in-3, .slide-in-left, .slide-up, .slide-in-right, .curtain-reveal, .scrollDown');
targets.forEach(target => observer.observe(target));
});