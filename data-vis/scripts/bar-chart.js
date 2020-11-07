const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let req = fetch(url)
    .then(response => response.json())
    .then(json => {

        const data = json.data;
        const width = 700;
        const height = 400;
        const padding = 30;
        const barWidth = (width - padding * 2) / data.length;
        const canvas = d3.select("#content")
                         .append("svg")
                         .attr("height", height)
                         .attr("width", width);

        const minYear = new Date(data[0][0]);
        const maxYear = new Date(data[data.length - 1][0]);
        const minGDP = 0;
        const maxGDP = d3.max(data, d => d[1]);

        ///////////////////////////////   ////////////////////   //////////////////////////
        const xScale = d3.scaleTime()
            .domain([minYear, maxYear])
            .range([padding * 1.5, width - padding]);
        const yScale = d3.scaleLinear()
            .domain([minGDP, maxGDP])
            .range([height - padding, padding]);
            
        const toolTip = d3.select("#content")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);
        
        canvas.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => xScale(new Date(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", barWidth)
            .attr("height", d => (height - padding) - yScale(d[1]))
            .attr("class", "bar")
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .on('mouseover', (d, i) => {
                toolTip.transition().duration(50).style('opacity', 0.9);
                toolTip.html(
                    `${i[0]}<br>\$${i[1]} Billion`
                  )
                  .attr('data-date', i[0])
              })
              .on('mouseout', function () {
                toolTip.transition().duration(300).style('opacity', 0);
              });
        
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        canvas.append("g")
            .attr("transform", `translate(0, ${height - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);
        canvas.append("g")
            .attr("transform", `translate(${padding * 1.5}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);

        
    })