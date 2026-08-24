import { dong } from "./pricing.js";
import { loadData } from "./store.js";



const state = {
    records: [],
    query: '',
    category: 'all',
    status: 'all',
    sort: 'date-desc',
    loading: true,
    error: null,
}
const STATUS_LABEL={
    'da-chot':'Đã chốt',
    'huy': 'Hủy',
    'cho-xu-ly': 'Chờ xử lý',
}
const el = {};
function buildRow(record) {
    const row = el.template.content.firstElementChild.cloneNode(true);
    row.dataset.id = record.id;
    
    row.querySelector('[data-cell="id"]').textContent = record.id;
    row.querySelector('[data-cell="category"]').textContent = record.category;
    row.querySelector('[data-cell="amount"]').textContent = dong.format(Number(record.amount));
    row.querySelector('[data-cell="date"]').textContent = record.date;

    const statusRow = row.querySelector('[data-cell="status"]');
    statusRow.textContent = STATUS_LABEL[record.status] ?? record.status;
    statusRow.dataset.status = record.status;

    const delBtn = row.querySelector('[data-action="delete"]');
    delBtn.setAttribute('aria-label',`Xóa đơn hàng ${record.id}`);
    delBtn.addEventListener('click', () => xoaDonHang(record.id));

    return row;
}

const render = () => {
    const list = visibleRecords();
    el.loading.hidden = !state.loading;
    el.error.hidden = state.loading || !state.error;
    el.empty.hidden = state.loading || Boolean(state.error) || list.length > 0;
    el.table.hidden = state.loading || Boolean(state.error) || list.length === 0;

    el.tbody.replaceChildren(...list.map(buildRow));

    el.statCount.textContent = String(list.length);
    el.errorMessage.textContent = state.error ?? '';

    const totalAmount = list.reduce((sum, rec) => sum + rec.amount, 0);
    el.statAmount.textContent = dong.format(Number(totalAmount));
}

const visibleRecords= () => {
    // const q = state.query.trim().toLowerCase();
    return state.records;
}


const xoaDonHang = (id) => {

}

const start = async() => {
    state.loading = true;
    state.error = null;
    render();
    try {
        state.records = await loadData();

    } catch (error) {
       state.error = `Không tải được dữ liệu: ${error.message}`; 
    }  
    finally{
        state.loading=false;
        render();
    }
}

const checkElement = () => {
    el.tbody = document.getElementById('record-body');
    el.table = document.getElementById('record-table'); 
    el.loading = document.getElementById('state-loading');
    el.empty = document.getElementById('state-empty');
    el.error = document.getElementById('state-error');
    el.template = document.getElementById('row-template');
    el.statCount = document.getElementById('stat-count');
    el.statAmount = document.getElementById('stat-amount');
    el.errorMessage = document.getElementById('error-message');
}

export function initApp() {
    checkElement();
    start();
}