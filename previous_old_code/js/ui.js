export const terminal = (msg, isErr = false) => {
    const el = document.getElementById('console');
    const time = new Date().toLocaleTimeString([], { hour12: false });
    el.innerHTML += `<div class="${isErr ? 'text-red-400' : ''}"><span class="text-slate-600 mr-2">[${time}]</span>${msg}</div>`;
    el.scrollTop = el.scrollHeight;
};

// Tab Logic
document.getElementById('btn-python').onclick = () => {
    document.getElementById('btn-python').className = 'px-8 py-4 text-sm font-bold tab-active transition-all';
    document.getElementById('btn-sql').className = 'px-8 py-4 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all';
    document.getElementById('python-container').classList.remove('hidden');
    document.getElementById('sql-container').classList.add('hidden');
    // We will trigger a refresh via a custom event later or rely on the editor.js
    window.dispatchEvent(new Event('refreshEditors'));
};

document.getElementById('btn-sql').onclick = () => {
    document.getElementById('btn-sql').className = 'px-8 py-4 text-sm font-bold tab-active transition-all';
    document.getElementById('btn-python').className = 'px-8 py-4 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all';
    document.getElementById('sql-container').classList.remove('hidden');
    document.getElementById('python-container').classList.add('hidden');
    window.dispatchEvent(new Event('refreshEditors'));
};

document.getElementById('clear-console').onclick = () => {
    document.getElementById('console').innerHTML = '';
    document.getElementById('sql-output').innerHTML = '';
};

document.getElementById('copy-link').onclick = () => {
    navigator.clipboard.writeText(window.location.href);
    const btn = document.getElementById('copy-link');
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = "Invite Candidate", 2000);
};