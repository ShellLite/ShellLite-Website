window.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname.split('/').pop();
    const contentDiv = document.getElementById('content');
    const sidebarDiv = document.getElementById('sidebar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!path || path === 'docs') return;

    try {
        const response = await fetch('/static/docs_graph.json');
        const data = await response.json();
        renderSidebar(data, path);
        setupNavigation(data, path);
    } catch (err) {
        console.error('Error loading navigation:', err);
    }

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

    function renderSidebar(data, currentPath) {
        if (!sidebarDiv) return;
        sidebarDiv.innerHTML = '';

        const groups = {};
        data.nodes.forEach(node => {
            if (!groups[node.group]) groups[node.group] = [];
            groups[node.group].push(node);
        });

        const order = ['basics', 'intermediate', 'advanced', 'expert', 'reference', 'tutorials'];
        
        order.forEach(groupKey => {
            if (groups[groupKey]) {
                const groupSection = document.createElement('div');
                groupSection.className = 'sidebar-group';
                
                const title = document.createElement('h4');
                title.innerText = groupKey.replace(/^\w/, c => c.toUpperCase());
                groupSection.appendChild(title);

                groups[groupKey].sort((a, b) => a.level - b.level).forEach(node => {
                    const link = document.createElement('a');
                    link.href = node.url;
                    link.className = 'sidebar-link';
                    if (node.url.endsWith(currentPath)) link.classList.add('active');
                    link.innerText = node.label;
                    groupSection.appendChild(link);
                });

                sidebarDiv.appendChild(groupSection);
            }
        });
    }

    function setupNavigation(data, currentPath) {
        const nodes = data.nodes.sort((a, b) => a.level - b.level);
        const currentIndex = nodes.findIndex(n => n.url.endsWith(currentPath));

        if (currentIndex > 0) {
            const prev = nodes[currentIndex - 1];
            prevBtn.innerHTML = `<span>Previous</span><a href="${prev.url}">${prev.label}</a>`;
        }

        if (currentIndex < nodes.length - 1) {
            const next = nodes[currentIndex + 1];
            nextBtn.innerHTML = `<span>Next</span><a href="${next.url}">${next.label}</a>`;
        }
    }
});
