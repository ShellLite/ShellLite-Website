window.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname.split('/').pop();
    const contentDiv = document.getElementById('content');
    const sidebarDiv = document.getElementById('sidebar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Hide navigation elements
    if (sidebarDiv) sidebarDiv.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    
    // Expand main content area
    const docsMain = document.querySelector('.docs-main');
    if (docsMain) docsMain.style.width = '100%';
    const docsLayout = document.querySelector('.docs-layout');
    if (docsLayout) docsLayout.style.display = 'block';

    if (!path || path === 'docs') return;

    fetch('/static/docs/' + path)
        .then(r => {
            if (!r.ok) throw new Error('Not found');
            return r.text();
        })
        .then(text => {
            if (typeof marked !== 'undefined') {
                contentDiv.innerHTML = marked.parse(text);
                if (window.Prism) {
                    window.Prism.highlightAll();
                }
            } else {
                contentDiv.innerText = text;
            }
            window.scrollTo(0, 0);
        })
        .catch(err => {
            contentDiv.innerHTML = '<div style="text-align:center; padding: 40px;"><h2 style="color:var(--accent-primary)">404</h2><p>Document not found.</p></div>';
        });
});
