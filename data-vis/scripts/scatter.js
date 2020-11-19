const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let req = fetch(url)
    .then(response => response.json())
    .then(data => {
        const width = 700;
        const height = 400;
        const padding = 30;
        const r = 8;

        const years = data.map(item => item.Year);
        const times = data.map(item => {
            let num = Number(item.Seconds);
            let min = num / 60;
            let sec = num % 60;
            return new Date(Date.UTC(1970, 0, 1, 0, min, sec))
        });

        const minYear = d3.min(years);
        const maxYear = d3.max(years);
        const minTime = d3.min(times);
        const maxTime = d3.max(times);

        const canvas = d3.select("#canvas")
                         .attr("height", height)
                         .attr("width", width);

        const xScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([padding * 2, width - padding]);
        const yScale = d3.scaleTime()
            .domain([minTime, maxTime])
            .range([padding, height - padding])

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat("%M:%S"));

        canvas.append("g")
            .attr("transform", `translate(0, ${height - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);
        canvas.append("g")
            .attr("transform", `translate(${padding * 2}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);

        const toolTip = d3.select("#content")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        let yOffset = 25;

        canvas.selectAll("svg")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => xScale(years[i]))
            .attr("cy", (d, i) => yScale(times[i]))
            .attr("r", r)
            .attr("class", "dot")
            .attr("fill", d => d.Doping === "" ? "green" : "red")
            .attr("stroke", d => d.Doping === "" ? "darkgreen" : "darkred")
            .attr("stroke-width", "2px")
            .attr("data-xvalue", (d, i) => years[i])
            .attr("data-yvalue", (d, i) => times[i])
            .on("mouseover", (e, d) => {
                yOffset = d.Doping ? 50 : 25;
                const pos = Number(d.Place) - 1;
                toolTip.transition().duration(1).style("display", "block");
                toolTip.transition().duration(50).style("opacity", 0.9);
                toolTip.html(
                    `${d.Name} - ${getCountryName(d.Nationality)}<br>
                    Year: ${d.Year} - Time: ${times[pos].getMinutes()}:${times[pos].getSeconds()}${d.Doping !== "" ? `<br><br>${d.Doping}` : ""}`
                  )
                  .attr("data-year", years[pos])
                  .style("background-color", d.Doping ? "rgb(252, 165, 165)" : "rgb(197, 228, 197)")
                  .style("border-color", d.Doping ? "red" : "green")
              })
            .on("mousemove", (e, d) => {
                toolTip.style("left", e.layerX + 20 + "px")
                    .style("top", e.layerY - yOffset + "px");
            })
            .on("mouseout", () => {
                toolTip.transition()
                    .duration(100)
                    .style("opacity", 0);

                toolTip.transition()
                    .delay(100)
                    .style("display", "none")
              });
    })

function getCountryName(code) {
    switch (code) {
        case "ITA":
            return "Italy";
        case "USA":
            return "United States";
        case "GER":
            return "Germany";
        case "DEN":
            return "Denmark";
        case "FRA":
            return "France";
        case "ESP":
            return "Spain";
        case "SUI":
            return "Switzerland";
        case "POR":
            return "Portugal";
        case "COL":
            return "Columbia";
        case "UKR":
            return "Ukraine";
        case "RUS":
            return "Russia";
        default:
            return code;
    }
}