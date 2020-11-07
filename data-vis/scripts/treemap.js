const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

fetch(url)
    .then(response => response.json())
    .then(data => {
            run(data);
    })

const run = (data) => {
    let colors = {};
    const width = 720;
    const height = 500;
    const padding = {
        top: 15,
        right: 0,
        bottom: 0,
        left: 0
    }

    const canvas = d3.select("#canvas")
        .attr("width", width)
        .attr("height", height);

    const toolTip = d3.select("#content")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    let root = d3.hierarchy(data).sum(d => Number(d.value));

    d3.treemap()
        .size([width - padding.left - padding.right, height - padding.top - padding.bottom])
        .padding(1)(root)

    let leaves = root.leaves()

    canvas.selectAll("rect")
        .data(leaves)
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", d => d.x0 + padding.left)
        .attr("y", d => d.y0 + padding.top)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("fill", d => getColor(colors, d.data.category))
        .on("mousemove", (e, d) => {
            toolTip.style("display", "block")
                .style("opacity", 0.9)

            let name = d.data.name;
            let category = d.data.category;
            let value = d.data.value;
            toolTip.html(
                `<p>Name: ${name}<br>Category: ${category}<br>Value: ${value}</p>`
                )
                .attr("data-value", value)
                .style("left", e.layerX + 20 + "px")
                .style("top", e.layerY - 25 + "px");
        })
        .on("mouseout", () => {
            toolTip.style("display", "none")
        });

    canvas.selectAll("text")
        .data(leaves)
        .enter()
        .append("text")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0 + 25)
        .style("font-size", "13px")
        .attr("class", "cell-label")
        .text(d => d.data.name)

    /*
    const labels = document.getElementsByClassName("cell-label");
    console.log(leaves)
    for (let i = 0; i < labels.length; i++) {
        const words = leaves[i].data.name.split(" ");
        for (let word of words)
            labels[i].innerHTML += `<tspan x="0" dy="1.25em">${word}</tspan>`
    }*/
    
    const legend = d3.select("#legend")
        .attr("width", width)
        .attr("height", 100)
        .attr("background-color", "orange")

    const horKeys = 7;
    const keyWidth = Math.floor(width / horKeys);
    const keyHeight = 25
    const keyPadding = (width - keyWidth * horKeys) / 2

    legend.selectAll(".legend-item")
        .data(Object.keys(colors))
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", (d, i) => i % horKeys * keyWidth + keyPadding)
        .attr("y", (d, i) => Math.floor(i / horKeys) * keyHeight + 5)
        .attr("fill", d => colors[d])

    legend.selectAll(".legend-name")
        .data(Object.keys(colors))
        .enter()
        .append("text")
        .attr("class", "legend-name")
        .attr("x", (d, i) => i % horKeys * keyWidth + keyPadding + 23)
        .attr("y", (d, i) => Math.floor(i / horKeys) * keyHeight + 20)
        .text(d => d)
}

function getColor(colors, category) {
    if (colors.hasOwnProperty(category))
        return colors[category];

    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    colors[category] = `rgb(${r}, ${g}, ${b})`
    return colors[category];
}