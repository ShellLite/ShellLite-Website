async function loadGraph() {
    try {
        const colors = {
            "basics": "#60a5fa",
            "intermediate": "#a855f7",
            "advanced": "#fb923c",
            "expert": "#f43f5e",
            "reference": "#10b981",
            "tutorials": "#f59e0b"
        };

        function getGroupColor(group) {
            return colors[group] || '#94a3b8';
        }

        const response = await fetch('/static/docs_graph.json');
        const data = await response.json();

        const gData = {
            nodes: data.nodes.map(n => ({
                id: n.id,
                name: n.label,
                group: n.group,
                level: n.level,
                url: n.url,
                color: getGroupColor(n.group)
            })),
            links: data.edges.map(e => ({
                source: e.from,
                target: e.to
            }))
        };

        const container = document.getElementById('docs-graph');

        const Graph = ForceGraph3D()(container)
            .graphData(gData)
            .nodeLabel('name')
            .nodeColor('color')
            .nodeRelSize(8) // Slightly larger nodes
            .nodeResolution(24) // Smoother spheres
            .linkWidth(1)
            .linkDirectionalParticles(2) // Flowing particles for better UX
            .linkDirectionalParticleSpeed(d => 0.005)
            .linkDirectionalParticleWidth(2)
            .linkDirectionalArrowLength(4)
            .linkDirectionalArrowRelPos(1)
            .backgroundColor('#030712') // Matches deep black theme
            .onNodeClick(node => {
                if (node.url) {
                    window.location.href = node.url;
                }
            })
            .onNodeHover(node => {
                container.style.cursor = node ? 'pointer' : null;
            });

        // Add auto-rotation
        Graph.controls().autoRotate = true;
        Graph.controls().autoRotateSpeed = 0.6;

        // Force layout adjustments
        Graph.d3Force('charge').strength(-150);
        Graph.d3Force('link').distance(60);

        // Responsive sizing
        Graph.width(container.clientWidth);
        Graph.height(container.clientHeight);

        window.addEventListener('resize', () => {
            Graph.width(container.clientWidth);
            Graph.height(container.clientHeight);
        });

    } catch (err) {
        console.error('Failed to load 3D graph:', err);
        document.getElementById('docs-graph').innerHTML =
            '<p style="color: #ef4444; text-align: center; padding: 40px;">Failed to load Interactive Learning Path</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadGraph);
