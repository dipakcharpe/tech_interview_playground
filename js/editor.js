import * as Y from 'https://esm.sh/yjs@13.6.1';
import { WebsocketProvider } from 'https://esm.sh/y-websocket@1.5.0';
import { CodemirrorBinding } from 'https://esm.sh/y-codemirror@3.0.1';

export let pyEditor, sqlEditor;

export function initCollaboration(userName) {
    // 1. Generate shorter, safer room name to avoid 403
    let roomName = window.location.hash.replace('#', '');
    if (!roomName) {
        roomName = `room-${Math.random().toString(36).substr(2, 5)}`;
        window.location.hash = roomName;
    }

    const ydoc = new Y.Doc();
    // Use y-websocket demo server
    const provider = new WebsocketProvider('wss://demos.yjs.dev', roomName, ydoc);
    const yPyText = ydoc.getText('python');
    const ySqlText = ydoc.getText('sql');

    // 2. Setup Editors
    pyEditor = CodeMirror.fromTextArea(document.getElementById('python-editor'), {
        mode: 'python', theme: 'dracula', lineNumbers: true
    });
    sqlEditor = CodeMirror.fromTextArea(document.getElementById('sql-editor'), {
        mode: 'text/x-sql', theme: 'dracula', lineNumbers: true
    });

    // 3. Sync
    new CodemirrorBinding(yPyText, pyEditor, provider.awareness);
    new CodemirrorBinding(ySqlText, sqlEditor, provider.awareness);

    // 4. Awareness (Show User Name)
    provider.awareness.setLocalStateField('user', { name: userName, color: '#10b981' });

    provider.on('status', s => {
        const dot = document.getElementById('status-dot');
        dot.className = s.status === 'connected' ? 'h-2 w-2 rounded-full bg-emerald-500' : 'h-2 w-2 rounded-full bg-orange-500 animate-pulse';
        document.getElementById('status-text').innerText = s.status === 'connected' ? 'Connected' : 'Connecting...';
    });

    window.addEventListener('refreshEditor', () => {
        pyEditor.refresh();
        sqlEditor.refresh();
    });
}