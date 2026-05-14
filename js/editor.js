import * as Y from 'https://esm.sh/yjs@13.6.1';
import { WebsocketProvider } from 'https://esm.sh/y-websocket@1.5.0';
import { CodemirrorBinding } from 'https://esm.sh/y-codemirror@3.0.1';

// Room Logic
const hash = window.location.hash.replace('#', '');
const roomName = hash || `interview-${Math.random().toString(36).substr(2, 9)}`;
if (!hash) window.location.hash = roomName;

const ydoc = new Y.Doc();
const provider = new WebsocketProvider('wss://demos.yjs.dev', roomName, ydoc);
const yPyText = ydoc.getText('python');
const ySqlText = ydoc.getText('sql');

// Editors
export const pyEditor = CodeMirror.fromTextArea(document.getElementById('python-editor'), {
    mode: 'python', theme: 'dracula', lineNumbers: true, indentUnit: 4, lineWrapping: true
});
export const sqlEditor = CodeMirror.fromTextArea(document.getElementById('sql-editor'), {
    mode: 'text/x-sql', theme: 'dracula', lineNumbers: true, lineWrapping: true
});

// Bindings
new CodemirrorBinding(yPyText, pyEditor, provider.awareness);
new CodemirrorBinding(ySqlText, sqlEditor, provider.awareness);

// Status UI
provider.on('status', s => {
    const dot = document.getElementById('status-dot');
    dot.className = s.status === 'connected' ? 'h-2 w-2 rounded-full bg-emerald-500' : 'h-2 w-2 rounded-full bg-orange-500 animate-pulse';
    document.getElementById('status-text').innerText = s.status === 'connected' ? 'Live Session Active' : 'Connecting...';
});

window.addEventListener('refreshEditors', () => {
    pyEditor.refresh();
    sqlEditor.refresh();
});