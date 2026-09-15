export const dong = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
});

export function initPricing() {
    const sw = document.getElementById("cong-tac-gia");
    if (!sw) return;

    const prices = [...document.querySelectorAll("[data-price]")];
    const units = [...document.querySelectorAll("[data-price-unit]")];
    if (prices.length === 0) return;

    // TODO 1 — vẽ lần đầu theo trạng thái đang có trong HTML:
    //   render(sw.getAttribute("aria-checked") === "true")
    render(sw.getAttribute('aria-checked') === 'true');
    // TODO 2 — bấm công tắc thì đảo trạng thái rồi gọi render().
    sw.addEventListener('click', () => {
        const yearly = sw.getAttribute('aria-checked') !== 'true';
        render(yearly);
    });
    // TODO 3 — bàn phím: phím Space và Enter đều phải bật/tắt được.
    // <button> đã tự lo Enter, nhưng viết rõ ra để người đọc thấy bạn đã cân nhắc.
    // Nhớ e.preventDefault() với phím Space, nếu không trang sẽ cuộn xuống.
    sw.addEventListener('keydown', (e) => {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        e.preventDefault();
        const yearly = sw.getAttribute('aria-checked') !== 'true';
        render(yearly);
    });


    function render(yearly) {
        // TODO 4 — ba việc:
        //   a. sw.setAttribute("aria-checked", String(yearly))
        //      → trạng thái nằm ở ARIA, CSS tự đọc qua .cong-tac[aria-checked="true"],
        //        nên KHÔNG cần thêm class riêng nào cả.
        //   b. mỗi phần tử trong `prices`: đọc el.dataset.yearly hoặc el.dataset.monthly,
        //      đổi sang số, rồi el.textContent = dong.format(...)
        //      Dùng textContent chứ không innerHTML — buổi 5 sẽ nói kỹ vì sao.
        //   c. mỗi phần tử trong `units`: "/năm" hoặc "/tháng".
        sw.setAttribute('aria-checked', String(yearly));
        prices.forEach((el) => {
            const amount = yearly ? el.dataset.yearly : el.dataset.monthly;
            el.textContent = dong.format(Number(amount));
        });

        units.forEach((el) => {
            el.textContent = yearly ? '/năm' : '/tháng';
        });
    }
}