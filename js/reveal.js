// js/reveal.js — Tính năng 7: hiệu ứng lộ dần khi cuộn tới.   (tiết 4)
//
// Phần tử có sẵn: các khối mang thuộc tính [data-reveal].
// CSS có sẵn trong src/input.css:
//   .js [data-reveal]              → mờ và đẩy xuống 16px
//   .js [data-reveal].is-visible   → hiện lên đúng chỗ
// Việc của file này chỉ là gắn class "is-visible" đúng lúc.

export function initReveal() {
    const items = [...document.querySelectorAll("[data-reveal]")];
    if (items.length === 0) return;

    // TODO 1 — TÔN TRỌNG NGƯỜI DÙNG TRƯỚC, làm hiệu ứng sau.
    // Người bị rối loạn tiền đình có thể chóng mặt thật sự vì hiệu ứng trượt.
    // Hệ điều hành có sẵn công tắc, việc của mình là nghe theo:
    //   window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Nếu đang bật: gắn "is-visible" cho tất cả rồi `return` ngay — hiện luôn,
    // không quan sát, không animate.

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    // TODO 2 — IntersectionObserver với { threshold: 0.15 }:
    //   phần tử vào khung nhìn → thêm class "is-visible"
    //   rồi observer.unobserve(entry.target) — hiện rồi thì thôi, đừng theo dõi nữa.
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.15 }
    );

    // TODO 3 — cho observer quan sát từng phần tử trong `items`.
    items.forEach((el) => observer.observe(el));
    // BẪY của tiết này: nếu bạn viết CSS ẩn [data-reveal] mà KHÔNG kèm tiền tố
    // ".js", thì máy nào chặn JavaScript sẽ thấy một trang trắng trơn. Mở
    // src/input.css, tìm khối ".js [data-reveal]" và đọc lại comment ở đó.
}