const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

let colorIndex = 0;
const COLOR_ARR = [
    "rgb(107, 234, 232)",
    "rgb(250, 127, 102)",
    "rgb(69, 172, 35)",
    "rgb(201, 214, 14)",
    "rgb(226, 139, 188)",
    "rgb(39, 147, 225)",
    "rgb(233, 198, 189)",
    "rgb(32, 139, 153)",
    "rgb(191, 154, 88)",
    "rgb(167, 165, 142)",
    "rgb(24, 219, 153)",
    "rgb(198, 57, 214)",
    "rgb(52, 151, 18)",
    "rgb(133, 126, 167)",
    "rgb(250, 200, 148)",
    "rgb(50, 186, 254)",
    "rgb(228, 165, 13)",
    "rgb(245, 66, 121)"
]

fetch(url)
    .then(response => response.json())
    .then(data => {
            run(data);
    })

const run = (data) => {
    let colors = {};
    const width = 920;
    const height = 600;
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

    let boxes = canvas.selectAll("g")
        .data(leaves)
        .enter()
        .append("g")
        .attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');

    boxes.append("rect")
        .attr("class", "tile")
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
                `<p>Name: ${name}<br>Platform: ${category}<br>Units Sold: ${value} Million</p>`
                )
                .attr("data-value", value)
                .style("left", e.layerX + 20 + "px")
                .style("top", e.layerY - 25 + "px");
        })
        .on("mouseout", () => {
            toolTip.style("display", "none")
        });

    boxes
        .append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(d => {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', function (d, i) {
          return 13 + i * 10;
        })
        .style("font-size", "10px")
        .text(d => d);

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

    colors[category] = COLOR_ARR[colorIndex++]
    return colors[category];
}