import * as Y from 'https://cdn.skypack.dev/yjs';
import { WebsocketProvider } from 'https://cdn.skypack.dev/y-websocket';
import { CodemirrorBinding } from 'https://cdn.skypack.dev/y-codemirror';

// 1. Get Room ID from URL (e.g., #room=interview-123)
const params = new URLSearchParams(window.location.hash.substring(1));
let roomName = params.get('room');

if (!roomName) {
    roomName = `pad-${Math.random().toString(36).substring(7)}`;
    window.location.hash = `room=${roomName}`;
}

// 2. Initialize Yjs
const ydoc = new Y.Doc();
const provider = new WebsocketProvider('wss://demos.yjs.dev', roomName, ydoc);
const yPythonText = ydoc.getText('python');
const ySqlText = ydoc.getText('sql');

// 3. Setup CodeMirror
export const pythonEditor = CodeMirror.fromTextArea(document.getElementById('python-editor'), {
    mode: 'python',
    lineNumbers: true,
    theme: 'dracula',
    indentUnit: 4
});

export const sqlEditor = CodeMirror.fromTextArea(document.getElementById('sql-editor'), {
    mode: 'text/x-sql',
    lineNumbers: true,
    theme: 'dracula'
});

// 4. Bind Yjs to Editors (This enables real-time sync)
new CodemirrorBinding(yPythonText, pythonEditor, provider.awareness);
new CodemirrorBinding(ySqlText, sqlEditor, provider.awareness);

// Status Management
provider.on('status', event => {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (event.status === 'connected') {
        dot.className = "h-2 w-2 rounded-full bg-emerald-500";
        text.innerText = "Collaborative Session Active";
    }
});

// Initial Text if empty
if (yPythonText.toString() === '') {
    yPythonText.insert(0, "# Start coding in Python\ndef solution():\n    return 'Hello World'\n\nprint(solution())");
}