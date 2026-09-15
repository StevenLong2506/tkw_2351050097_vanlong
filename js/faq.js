// js/faq.js — Tính năng 3: accordion câu hỏi thường gặp.   (tiết 3)
//
// Phần tử có sẵn trong HTML:
//   khu vực   : #cau-hoi
//   nút hỏi   : <button data-faq-trigger aria-expanded="false" aria-controls="faq-p1">
//   khối đáp  : <div id="faq-p1" hidden>
// Năm cặp trigger/panel đã đánh số faq-t1..t5 và faq-p1..p5.

export function initFaq() {
    const root = document.getElementById("cau-hoi");
    if (!root) return;

    const triggers = [...root.querySelectorAll("[data-faq-trigger]")];
    if (triggers.length === 0) return;

    function setOpen(trigger, open) {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        trigger.setAttribute('aria-expanded', String(open));
        if (panel) panel.hidden = !open;
    }

    root.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-faq-trigger]');
        if (!trigger) return;
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        triggers.forEach((t) => setOpen(t, false));
        if (willOpen) setOpen(trigger, true);
    });

    
    root.addEventListener('keydown', (e) => {
        const trigger = e.target.closest('[data-faq-trigger]');
        if (!trigger) return;

        const i = triggers.indexOf(trigger);
        let next = null;
        if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
        if (e.key === 'ArrowUp') next = triggers[(i - 1 + triggers.length) % triggers.length];
        if (e.key === 'Home') next = triggers[0];
        if (e.key === 'End') next = triggers[triggers.length - 1];

        if (next) {
            e.preventDefault();
            next.focus();
        }
    });

    triggers.forEach((t) => setOpen(t,false));
}