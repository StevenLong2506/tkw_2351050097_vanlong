

export function initNav() {
    const toggle = document.querySelector('[aria-controls="nav-mobile"]');
    const menu = document.getElementById('nav-mobile');
    if (!toggle || !menu) return;


    // TODO 1 — MỘT hàm duy nhất chịu trách nhiệm đổi trạng thái menu.
    // Không nơi nào khác được sửa class hay ARIA của menu; có vậy hai thứ
    // mới không bao giờ lệch nhau. Hàm này phải chạm đủ BỐN thứ:
    //   a. menu.classList.toggle("hidden", ...)      → cho người nhìn thấy
    //   b. toggle.setAttribute("aria-expanded", ...) → cho trình đọc màn hình
    //   c. toggle.setAttribute("aria-label", ...)    → "Mở menu" / "Đóng menu"
    //   d. document.body.classList.toggle("overflow-hidden", ...) → chặn nền cuộn
    const setOpen = (open) => {
        menu.classList.toggle('hidden', !open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
        document.body.classList.toggle('overflow-hidden', open);
    }

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    // TODO 2 — bấm nút thì đảo trạng thái.
    toggle.addEventListener('click', () => setOpen(!isOpen()));

    // TODO 3 — ba cách đóng, vì người dùng không ai giống ai:
    //   a. phím ESC — nhớ gọi toggle.focus() để trả tiêu điểm về nút,
    //      nếu không người dùng bàn phím bị "rơi" ra đầu trang.
    //   b. bấm ra ngoài vùng header — gợi ý: e.target.closest("header")
    //   c. màn hình phóng lên desktop — window.matchMedia("(min-width: 1024px)")
    //      rồi nghe sự kiện "change".

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) {
            setOpen(false);
            toggle.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (isOpen() && !e.target.closest('header')) {
            setOpen(false);
        }
    })

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    desktopQuery.addEventListener('change', (e) => {
        if (e.matches && isOpen()) {
            setOpen(false);
        }
    })
}


export function initToTop() {
    const btn = document.getElementById('nut-len-dau');
    const sentinel = document.getElementById('nav-sentinel');

    if (!btn || !sentinel) return;

    const observer = new IntersectionObserver(
        ([entry]) => btn.classList.toggle('is-visible', !entry.isIntersecting),
        // ([entry]) => {

        // },
        { rootMargin: '400px 0px 0px 0px' }
    );

    observer.observe(sentinel);
    btn.addEventListener('click', () => {
        const reduce = window.matchMedia('(prefer-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        document.querySelector('header a, header button');
    })
};