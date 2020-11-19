const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const CELL_COLORS = [
    [1, ""],
    [2.5, "#0276FE"],
    [4, "#2CACFF"],
    [5.5, "#8CE8FE"],
    [7, "#FFFF9B"],
    [8.5, "#FFFF09"],
    [10, "#FFB200"],
    [11.5, "#FE4300"]
]

const TOOLTIP_COLORS = [
    [1, ""],
    [2.5, "#55CCFF"],
    [4, "#55DDFF"],
    [5.5, "#AAF0FF"],
    [7, "#FFFFBB"],
    [8.5, "#FFFF55"],
    [10, "#FFDD33"],
    [11.5, "#FEAA66"]
]

let req = fetch(url)
    .then(response => response.json())
    .then(json => {
        const baseTemp = Number(json.baseTemperature);
        const data = json.monthlyVariance;

        const width = 700;
        const height = 400;
        const paddingLeft = 60;
        const paddingRight = 30;
        const paddingTop = 30;
        const paddingBottom = 60;
        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const legendWidth = 50 * CELL_COLORS.length;

        //Calculates the size of each cell
        const cellWidth = chartWidth / (data.length / 12);
        const cellHeight = chartHeight / 12

        //Sets up the canvas to draw the chart on
        const canvas = d3.select("#canvas")
            .attr("width", width)
            .attr("height", height)

        //Parses data into a more usable format
        const dates = data.map(item => new Date(`${item.year}-${item.month}-1`));
        const temps = data.map(item => baseTemp + item.variance);

        //Gets the minimum and maximum for each axis
        const minYear = dates[0];
        const maxYear = dates[dates.length - 1];

        //Creates the x and y scales and axes
        const xScale = d3.scaleTime()
            .domain([minYear, maxYear])
            .range([paddingLeft, width - paddingRight]);
        const yScale = d3.scaleBand()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
            .range([height - paddingBottom, paddingTop]);
        const legendScale = d3.scaleBand()
            .domain(CELL_COLORS.map(item => item[0]))
            .range([paddingLeft + chartWidth / 2 - legendWidth / 2, 
                    paddingLeft + chartWidth / 2 + legendWidth / 2]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(month => MONTHS[month])
        const legendAxis = d3.axisBottom(legendScale)
            .tickFormat(temp => temp + "°C")

        canvas.append("g")
            .attr("transform", `translate(0, ${height - paddingBottom})`)
            .attr("id", "x-axis")
            .call(xAxis);
        canvas.append("g")
            .attr("transform", `translate(${paddingLeft}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);

        const toolTip = d3.select("#content")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        //Draws the data cells
        
        canvas.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("data-month", (d, i) => d.month - 1)
            .attr("data-year", (d, i) => d.year)
            .attr("data-temp", (d, i) => temps[i])
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .attr("x", (d, i) => xScale(dates[i]))
            .attr("y", (d, i) => yScale(dates[i].getMonth()))
            .attr("fill", (d, i) => getCellColor(temps[i]))
            .on("mouseover", (e, d) => {
                let month = d.month;
                let year = d.year;
                let temp = d.variance + baseTemp;

                temp = Math.round(temp * 100);
                temp /= 100;
                toolTip.transition()
                    .duration(1)
                    .style("display", "block")
                    .style("opacity", 0.9)

                toolTip.html(
                    `<p>${MONTHS[month - 1]}, ${year}<br>
                    ${temp}°C</p>`
                  )
                  .attr("data-year", year)
                  .style("left", e.layerX - 75 + "px")
                  .style("top", e.layerY - 75 + "px")
                  .style("background-color", getToolTipColor(temp))
              })
            .on("mouseout", () => {
                toolTip.transition()
                    .duration(1)
                    .style("display", "none")
                    .style("stroke", "black");
              });

        //Draws the legend
        const legendCanvas = d3.select("#legend")
            .attr("width", width)
            .attr("height", 100)

        legendCanvas.append("g")
            .attr("transform", `translate(0, 50)`)
            .attr("id", "legend-axis")
            .call(legendAxis);

        legendCanvas.selectAll(".key")
            .data(CELL_COLORS)
            .enter()
            .append("rect")
            .attr("x", d => legendScale(d[0]) - 25)
            .attr("y", 0)
            .attr("width", 50)
            .attr("height", 50)
            .attr("fill", d => d[1])
            .attr("display", (d, i) => i === 0 ? "none" : "block")
            .attr("class", "key")
    })

function getCellColor(temp) {
    for (let i = 1; i < CELL_COLORS.length - 1; i++) {
        if (temp < CELL_COLORS[i][0])
            return CELL_COLORS[i][1];
    }

    return CELL_COLORS[CELL_COLORS.length - 1][1];
}

function getToolTipColor(temp) {
    for (let i = 1; i < TOOLTIP_COLORS.length - 1; i++) {
        if (temp < TOOLTIP_COLORS[i][0])
            return TOOLTIP_COLORS[i][1];
    }

    return TOOLTIP_COLORS[TOOLTIP_COLORS.length - 1][1];
}