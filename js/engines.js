import { terminal } from './ui.js';
import { pyEditor, sqlEditor } from './editor.js';

let pyodide, db;

// Initialize Engines
(async () => {
    pyodide = await loadPyodide();
    const SQL = await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` });
    db = new SQL.Database();
    db.run("CREATE TABLE Interview (id INT, note TEXT);");
    terminal("Engines Initialized.");
    
    document.getElementById('schema-area').innerHTML = `
        <div class="p-3 bg-slate-50 border rounded text-xs font-mono">
            <b>Interview</b><br>id (INT), note (TEXT)
        </div>`;
})();

export async function runPython() {
    terminal("Executing Python...");
    try {
        const output = await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
${pyEditor.getValue()}
sys.stdout.getvalue()`);
        terminal(output || "Executed successfully.");
    } catch (e) { terminal(e.message, true); }
}

export function executeSQL() {
    terminal("Executing SQL...");
    try {
        const res = db.exec(sqlEditor.getValue());
        if (res.length) {
            let h = `<table><thead><tr>${res[0].columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;
            h += `<tbody>${res[0].values.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
            document.getElementById('sql-output').innerHTML = h;
        }
    } catch (e) { terminal(e.message, true); }
}