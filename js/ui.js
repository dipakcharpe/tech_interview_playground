import { initCollaboration } from './editor.js';
import { runPython, executeSQL } from './engines.js';

const startBtn = document.getElementById('start-btn');
const userNameInput = document.getElementById('user-name');
const lobby = document.getElementById('lobby');
const appContent = document.getElementById('app-content');

// Check if user is joining via shared link
const isJoining = window.location.hash.length > 5;
if (isJoining) {
    document.getElementById('lobby-desc').innerText = "You have been invited to a session. Enter your name to join.";
}

startBtn.onclick = () => {
    const name = userNameInput.value.trim();
    if (!name) return alert("Please enter your name.");

    lobby.classList.add('hidden');
    appContent.classList.remove('invisible');
    
    // Initialize Engines & Collaboration
    initCollaboration(name);
};

// Global Terminal Helper
export const terminal = (msg, isErr = false) => {
    const el = document.getElementById('console');
    const time = new Date().toLocaleTimeString([], { hour12: false });
    el.innerHTML += `<div class="${isErr ? 'text-red-400' : ''}"><span class="text-slate-600 mr-2">[${time}]</span>${msg}</div>`;
    el.scrollTop = el.scrollHeight;
};

// Tab Switching
document.getElementById('btn-python').onclick = () => {
    document.getElementById('python-container').classList.remove('hidden');
    document.getElementById('sql-container').classList.add('hidden');
    document.getElementById('run-python').classList.remove('hidden');
    document.getElementById('run-sql').classList.add('hidden');
    window.dispatchEvent(new Event('refreshEditor'));
};

document.getElementById('btn-sql').onclick = () => {
    document.getElementById('sql-container').classList.remove('hidden');
    document.getElementById('python-container').classList.add('hidden');
    document.getElementById('run-sql').classList.remove('hidden');
    document.getElementById('run-python').classList.add('hidden');
    window.dispatchEvent(new Event('refreshEditor'));
};

document.getElementById('copy-link').onclick = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Candidate Link Copied!");
};

document.getElementById('run-python').onclick = runPython;
document.getElementById('run-sql').onclick = executeSQL;