async function runCode() {
    let code_input = document.getElementById("code-input");
    let code = code_input.value || "say 'Hello'";
    let stdin_input = document.getElementById("stdin-input");
    let stdin_val = stdin_input ? stdin_input.value : "";
    let output_div = document.getElementById("output-display");
    let btn = document.querySelector(".run-btn");
    output_div.innerText = "Running...";
    btn.classList.add("loading");
    try {
        let headers = { 'Content-Type': "application/json" };
        let body_data = { 'code': code, 'stdin': stdin_val };
        let body_str = JSON.stringify(body_data);
        let options = { 'method': "POST", 'headers': headers, 'body': body_str };
        let query = "?code=" + encodeURIComponent(code);
        if (stdin_val) {
            query += "&stdin=" + encodeURIComponent(stdin_val);
        }
        let response = await fetch("/api/run" + query, options);
        let result = await response.text();
        output_div.innerText = result;
    } catch (e) {
        output_div.innerText = "Error: " + e.message;
    } finally {
        btn.classList.remove("loading");
    }
}

function toggleStdin() {
    let drawer = document.getElementById("stdin-drawer");
    let toggleText = document.getElementById("stdin-toggle-text");
    if (!drawer) return;
    if (drawer.style.display === "none" || drawer.style.display === "") {
        drawer.style.display = "block";
        if (toggleText) toggleText.innerText = "Click to collapse ▲";
        let stdinInput = document.getElementById("stdin-input");
        if (stdinInput) stdinInput.focus();
    } else {
        drawer.style.display = "none";
        if (toggleText) toggleText.innerText = "Click to expand ▼";
    }
}

function updateStdinBadge() {
    let stdinInput = document.getElementById("stdin-input");
    let badge = document.getElementById("stdin-badge");
    if (stdinInput && badge) {
        if (stdinInput.value.trim().length > 0) {
            badge.style.display = "inline-block";
        } else {
            badge.style.display = "none";
        }
    }
}

function checkAskInCode() {
    let textarea = document.getElementById("code-input");
    let drawer = document.getElementById("stdin-drawer");
    let toggleText = document.getElementById("stdin-toggle-text");
    if (textarea && drawer && (textarea.value.includes("ask") || textarea.value.includes("input"))) {
        if (drawer.style.display === "none" || drawer.style.display === "") {
            drawer.style.display = "block";
            if (toggleText) toggleText.innerText = "Click to collapse ▲";
        }
    }
}

function clearOutput() {
    document.getElementById("output-display").innerText = "// Output cleared";
}

function handleTab(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        let textarea = e.target;
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let value = textarea.value;
        textarea.value = value.substring(0, start) + "    " + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        updateLineNumbers();
    }
}

function updateLineNumbers() {
    let textarea = document.getElementById("code-input");
    let lineNumbers = document.getElementById("line-numbers");
    if (!lineNumbers) return;

    let lines = textarea.value.split('\n');
    let numbers = [];
    for (let i = 1; i <= lines.length; i++) {
        numbers.push(i);
    }
    lineNumbers.innerText = numbers.join('\n');
}

function syncScroll(e) {
    let lineNumbers = document.getElementById("line-numbers");
    if (lineNumbers) {
        lineNumbers.scrollTop = e.target.scrollTop;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let textarea = document.getElementById("code-input");
    if (textarea) {
        textarea.addEventListener('keydown', handleTab);
        textarea.addEventListener('input', function () {
            updateLineNumbers();
            checkAskInCode();
        });
        textarea.addEventListener('scroll', syncScroll);
        updateLineNumbers();
        checkAskInCode();
    }

    let stdinInput = document.getElementById("stdin-input");
    if (stdinInput) {
        stdinInput.addEventListener('input', updateStdinBadge);
        updateStdinBadge();
    }

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            runCode();
        }
    });
});
