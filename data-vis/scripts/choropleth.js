const eduUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const legendTicks = [0, 10, 20, 30, 40, 50, 60]

const maxR = 100, maxG = 220, maxB = 100;

fetch(eduUrl)
    .then(response => response.json())
    .then(eduData => {
        fetch(countyUrl)
        .then(response => response.json())
        .then(countyData => {
            run(eduData, countyData);
        })
    })

const run = (eduData, countyData) => {
    const width = 960;
    const height = 600;
    const paddingLeft = 60;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 60;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const percents = eduData.map(item => item.bachelorsOrHigher);
    const cache = {};
    eduData.forEach(item => cache[item.fips] = item);

    const maxPercent = d3.max(percents);

    const canvas = d3.select("#canvas")
        .attr("width", width)
        .attr("height", height);

    const toolTip = d3.select("#content")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    const path = d3.geoPath()

    canvas.selectAll("path")
        .data(topojson.feature(countyData, countyData.objects.counties).features)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", d => getColor(cache[d.id].bachelorsOrHigher, maxPercent))
        .attr("data-fips", d => d.id)
        .attr("data-education", d => cache[d.id].bachelorsOrHigher)
        .on("mouseover", (e, d) => {
            toolTip.style("display", "block")
                .style("opacity", 0.9)

            let id = d.id;
            let countyName = cache[id].area_name;
            let state = cache[id].state;
            let percent = cache[id].bachelorsOrHigher;
            toolTip.html(
                `<p>${countyName}, ${state}: ${percent}%</p>`
                )
                .attr("data-education", percent)
                .style("left", e.layerX + 25 + "px")
                .style("top", e.layerY - 12 + "px");
        })
        .on("mouseout", () => {
            toolTip.style("display", "none")
        });

    const legendScale = d3.scaleBand()
        .domain(legendTicks)
        .range([width / 2 - 150, width / 2 + 150]);

    const legendAxis = d3.axisBottom(legendScale)
        .tickFormat(percent => percent + "%")

    const legendCanvas = d3.select("#legend")
        .attr("width", width)
        .attr("height", 100)

    legendCanvas.append("g")
        .attr("transform", `translate(0, 50)`)
        .attr("id", "legend-axis")
        .call(legendAxis);

    legendCanvas.selectAll(".key")
        .data(legendTicks)
        .enter()
        .append("rect")
        .attr("x", d => legendScale(d) - 22)
        .attr("y", 40)
        .attr("width", 45)
        .attr("height", 10)
        .attr("fill", d => getColor(d, maxPercent))
        .attr("display", (d, i) => i === 0 ? "none" : "block")
        .attr("class", "key")
}

function getColor(percent, max) {
    let portion = 1 - (percent / max);
    let r = maxR * portion;
    let g = maxG * portion;
    let b = maxB * portion;
    return `rgb(${r}, ${g}, ${b})`;
}