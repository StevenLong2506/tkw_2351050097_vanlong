// js/slider.js — Tính năng 6: slider cảm nhận, TỰ VIẾT, không thư viện.  (tiết 5)
//
// Phần tử có sẵn trong HTML:
//   khu vực : #slider-camnhan
//   dải     : [data-slider-track]   ← thứ sẽ bị dịch sang trái
//   slide   : [data-slide]          ← mỗi slide rộng đúng 100% khung nhìn
//   ô chấm  : [data-slider-dots]    ← RỖNG, chấm do JavaScript sinh ra
//   nút     : [data-slider-prev] / [data-slider-next]
//
// Ý tưởng: xếp các slide thành một dải ngang, rồi dịch cả dải bằng
//   track.style.transform = `translateX(-${index * 100}%)`

const TU_CHAY = 6000;   // ms — thời gian giữa hai lần tự chuyển

export function initSlider() {
    const root = document.getElementById("slider-camnhan");
    if (!root) return;

    const track = root.querySelector("[data-slider-track]");
    const slides = [...root.querySelectorAll("[data-slide]")];
    const dotsBox = root.querySelector("[data-slider-dots]");
    const prev = root.querySelector("[data-slider-prev]");
    const next = root.querySelector("[data-slider-next]");
    if (!track || slides.length === 0) return;

    let index = 0;
    let timer = null;

    // TODO 1 — sinh chấm chỉ dẫn BẰNG JAVASCRIPT, từ số slide thật.
    // Viết cứng ba cái chấm trong HTML thì thêm một cảm nhận phải sửa hai chỗ,
    // và sớm muộn sẽ lệch. Mỗi chấm là một <button type="button"> có:
    //   class "slider-dot"                     (CSS đã có sẵn)
    //   aria-label "Xem cảm nhận i trên n"     (chấm tròn không có chữ)
    //   listener: bấm thì go(i) rồi restart()
    // Giữ lại mảng các chấm để hàm go() còn cập nhật aria-current.
    const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `Xem cảm nhận ${i + 1} trên ${slides.length}`);
        dot.addEventListener('click', () => {
            go(i);
            restart();
        });
        dotsBox.append(dot);
        return dot;
    });

    function go(next_) {
        // TODO 2 — một dòng lo cả hai đầu, KHÔNG dùng if:
        index = (next_ + slides.length) % slides.length;
        // Từ slide 0 bấm lùi ra -1, cộng length thành length-1 → slide cuối.

        // TODO 3 — dịch dải: track.style.transform = ...
        track.style.transform = `translateX(-${index * 100}%)`;
        // TODO 4 — với từng slide, đánh dấu slide KHÔNG phải slide hiện tại:
        //   s.toggleAttribute("inert", ...)
        //   s.setAttribute("aria-hidden", ...)
        // Thiếu `inert` thì người nhấn Tab rơi vào slide vô hình nằm ngoài màn hình.
        // Đây là lỗi tiếp cận phổ biến nhất của mọi slider, và là lỗi mà máy chấm
        // bắt được còn mắt thường thì không.
        slides.forEach((s, i) => {
            s.toggleAttribute('inert', i !== index);
            s.setAttribute('aria-hidden', String(i !== index));
        });

        // TODO 5 — cập nhật aria-current cho chấm đang hiện.
        dots.forEach((d, i) => {
            d.setAttribute('aria-current', String(i === index));
        })
    }

    function start() {
        // TODO 6 — người bật "giảm chuyển động" thì KHÔNG tự chạy: return sớm.
        // Sau đó LUÔN gọi stop() trước khi đặt setInterval mới, nếu không mỗi lần
        // rê chuột vào ra là thêm một bộ đếm, slider sẽ chạy nhanh dần rồi giật.
        //   timer = setInterval(() => go(index + 1), TU_CHAY);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        stop();
        timer = setInterval(() => go(index + 1), TU_CHAY);
    }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    // TODO 7 — nút prev/next: go(index - 1) / go(index + 1), rồi restart().
    // Dùng prev?.addEventListener(...) để trang thiếu nút vẫn không nổ.
    prev?.addEventListener('click', () => {
        go(index - 1);
        restart();
    });
    next?.addEventListener('click', () => {
        go(index + 1);
        restart();
    })
    // TODO 8 — bàn phím: ArrowLeft / ArrowRight khi tiêu điểm đang trong slider.
    root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            go(index - 1);
            restart();
        }
        else if (e.key === 'ArrowRight') {
            go(index + 1);
            restart();
        }
    });
    // TODO 9 — tự chạy nhưng biết dừng khi người dùng đang xem:
    //   mouseenter → stop      mouseleave → start
    //   focusin    → stop      focusout   → start     ← hay bị quên nhất:
    //     người dùng bàn phím không rê chuột, chỉ có tiêu điểm, nên nếu thiếu
    //     cặp này thì slider trôi mất trong lúc họ đang đọc.
    //   document "visibilitychange" → chuyển tab thì dừng, quay lại thì chạy.
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    // TODO 10 — trạng thái đầu:
    go(0); 
    start();

}