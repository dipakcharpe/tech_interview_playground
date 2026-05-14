import { logToConsole } from './ui.js';
import { pythonEditor, sqlEditor } from './editor.js';

let pyodide = null;
let dbInstance = null;

// --- Python Engine Setup ---
async function initPython() {
    const btn = document.getElementById('run-python');
    try {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        btn.innerText = "Run Python Code";
        btn.disabled = false;
        logToConsole("Python 3.10 Engine Ready.");
    } catch (err) {
        logToConsole("Python Init Error: " + err.message, true);
    }
}

// --- SQL Engine Setup ---
async function initSql() {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        dbInstance = new SQL.Database();
        
        // Load Default Schema
        const schema = `
            CREATE TABLE Students (id INT, name TEXT, dept TEXT, cgpa REAL);
            INSERT INTO Students VALUES (1, 'Anita', 'CSE', 8.5), (2, 'Bharat', 'ECE', 7.8);
            CREATE TABLE Courses (id INT, name TEXT, credits INT);
            INSERT INTO Courses VALUES (101, 'DBMS', 4), (102, 'Python', 3);
        `;
        dbInstance.exec(schema);
        injectSchemaUI();
        logToConsole("SQLite Engine Ready.");
    } catch (err) {
        logToConsole("SQL Init Error: " + err.message, true);
    }
}

function injectSchemaUI() {
    const schemaHtml = `
        <div class="p-2 bg-slate-50 border rounded mb-2">
            <p class="font-bold text-slate-700">Students</p>
            <p class="text-[10px] text-slate-500 font-mono">id(INT), name(TEXT), dept(TEXT), cgpa(REAL)</p>
        </div>
        <div class="p-2 bg-slate-50 border rounded">
            <p class="font-bold text-slate-700">Courses</p>
            <p class="text-[10px] text-slate-500 font-mono">id(INT), name(TEXT), credits(INT)</p>
        </div>
    `;
    document.getElementById('schema-details').innerHTML = schemaHtml;
}

// --- Execution Logic ---
document.getElementById('run-python').addEventListener('click', async () => {
    const code = pythonEditor.getValue();
    logToConsole(">>> Running Python...");
    try {
        // Redirect Python stdout to our console
        pyodide.runPython(`
            import sys
            import io
            sys.stdout = io.stringIO()
        `);
        await pyodide.runPythonAsync(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        logToConsole(stdout || "Execution finished (no output).");
    } catch (err) {
        logToConsole(err.message, true);
    }
});

document.getElementById('run-sql').addEventListener('click', () => {
    const query = sqlEditor.getValue();
    logToConsole(">>> Executing SQL...");
    try {
        const res = dbInstance.exec(query);
        if (res.length > 0) {
            renderSqlTable(res[0]);
            logToConsole(`Query successful: ${res[0].values.length} rows returned.`);
        } else {
            logToConsole("Query executed successfully.");
        }
    } catch (err) {
        logToConsole(err.message, true);
    }
});

function renderSqlTable(data) {
    const container = document.getElementById('sql-table');
    let html = `<table class="min-w-full text-xs text-slate-300 border-collapse border border-slate-700 mt-2">
        <thead><tr class="bg-slate-800 text-left">`;
    data.columns.forEach(col => html += `<th class="p-2 border border-slate-700">${col}</th>`);
    html += `</tr></thead><tbody>`;
    data.values.forEach(row => {
        html += `<tr>`;
        row.forEach(val => html += `<td class="p-2 border border-slate-700">${val}</td>`);
        html += `</tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

// Start engines
initPython();
initSql();