export const KEY = 'technest:records';
const DATA_FILE = './data/records.json';

export const docTuMay = () => {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : null;
    } catch {
        return null;
    }
}

export function luuVaoMay(records) {
    try {
        localStorage.setItem(KEY, JSON.stringify(records));
    }
    catch (e) {
        console.log(`Lưu vào local storage thất bại: ${String.parse(e.message)}`);
    }
}

export const downloadData = async () => {
    const res = await fetch(DATA_FILE);
    if (!res.ok) {
        throw new Error(`Máy chủ trả về ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error('Dữ liệu không phải là mảng');
    }

    return data;
}

export const loadData = async () => {
    const existed = docTuMay();
    if (existed !== null) return existed;

    const data = await downloadData();
    luuVaoMay(data);
    return data;
}

export const restoreData = async () => {
    localStorage.removeItem(KEY);
    const data = await downloadData();
    luuVaoMay(data);
    return data;
}
