async function runCode() {
    let code_input = document.getElementById("code-input");
    let code = code_input.value || "say 'Hello'";
    let output_div = document.getElementById("output-display");
    let btn = document.querySelector(".run-btn");
    output_div.innerText = "Running...";
    btn.classList.add("loading");
    try {
        let headers = { 'Content-Type': "application/json" };
        let body_data = { 'code': code };
        let body_str = JSON.stringify(body_data);
        let options = { 'method': "POST", 'headers': headers, 'body': body_str };
        let response = await fetch("/api/run", options);
        let result = await response.text();
        output_div.innerText = result;
    } catch (e) {
        output_div.innerText = "Error: " + e.message;
    } finally {
        btn.classList.remove("loading");
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
        textarea.addEventListener('input', updateLineNumbers);
        textarea.addEventListener('scroll', syncScroll);
        updateLineNumbers();
    }

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            runCode();
        }
    });
});
