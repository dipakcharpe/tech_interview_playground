import { terminal } from './ui.js';
import { pyEditor, sqlEditor } from './editor.js';

let pyodide, db;

async function loadEngines() {
    try {
        pyodide = await loadPyodide();
        terminal("Python engine online.");
        
        const SQL = await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` });
        db = new SQL.Database();
        db.run("CREATE TABLE Interviewees (id INT, name TEXT, role TEXT, score INT);");
        db.run("INSERT INTO Interviewees VALUES (1, 'Deepak', 'Engineer', 95), (2, 'Candidate', 'Data Scientist', 88);");
        terminal("SQL engine online.");

        document.getElementById('schema-area').innerHTML = `
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                <div class="text-xs font-bold text-emerald-600 mb-1">Interviewees</div>
                <div class="text-[10px] font-mono text-slate-500">id(INT), name(TEXT), role(TEXT), score(INT)</div>
            </div>`;
    } catch (e) { terminal("Load error: " + e.message, true); }
}

document.getElementById('run-python').onclick = async () => {
    terminal("Running Python script...");
    try {
        const code = pyEditor.getValue();
        const output = await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
${code}
sys.stdout.getvalue()`);
        terminal(output || "Success: (No output)");
    } catch (e) { terminal(e.message, true); }
};

document.getElementById('run-sql').onclick = () => {
    terminal("Executing SQL query...");
    try {
        const res = db.exec(sqlEditor.getValue());
        if (res.length > 0) {
            renderTable(res[0]);
            terminal("Query returned " + res[0].values.length + " rows.");
        } else {
            terminal("Success: Command executed.");
        }
    } catch (e) { terminal(e.message, true); }
};

function renderTable(data) {
    let h = `<table><thead><tr>${data.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;
    h += `<tbody>${data.values.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    document.getElementById('sql-output').innerHTML = h;
}

loadEngines();