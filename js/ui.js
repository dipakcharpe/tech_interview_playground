export function logToConsole(msg, isError = false) {
    const consoleEl = document.getElementById('console');
    consoleEl.textContent += `\n${msg}`;
    consoleEl.style.color = isError ? '#f87171' : '#34d399';
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'border-emerald-600', 'text-emerald-700', 'bg-white'));
        btn.classList.add('active', 'border-emerald-600', 'text-emerald-700', 'bg-white');
        
        const isPython = btn.id === 'tab-python';
        document.getElementById('python-area').classList.toggle('hidden', !isPython);
        document.getElementById('sql-area').classList.toggle('hidden', isPython);
    });
});

// Share Button Logic
document.getElementById('share-session').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Invite link copied to clipboard! Share this with the candidate.');
});

// Add this to your existing js/ui.js
export function logToConsole(msg, isError = false) {
    const consoleEl = document.getElementById('console');
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    consoleEl.textContent += `\n[${timestamp}] ${msg}`;
    consoleEl.style.color = isError ? '#f87171' : '#34d399';
    consoleEl.scrollTop = consoleEl.scrollHeight; // Auto-scroll to bottom
}