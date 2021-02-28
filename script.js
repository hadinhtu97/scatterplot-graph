fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
        const w = 800;
        const h = 400;
        const padding = 40;

        const graph = d3.select('#graph')
            .append('svg')
            .style('width', w)
            .style('height', h)

        const tooltip = d3.select('#tooltip')
            .attr('data-year', '')
            .style('opacity', 0)

        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year)])
            .range([padding, w - padding]);
        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.Seconds), d3.max(data, d => d.Seconds)])
            .range([h - padding, padding]);

        const secondToMinute = s => {
            let minute = Math.floor(s / 60);
            let second = s - minute * 60;
            if (second == 0) second += '0'
            return minute + ':' + second;
        }
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(''));
        const yAxis = d3.axisLeft(yScale).tickFormat(secondToMinute);


        const circle = graph.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.Year))
            .attr('cy', d => yScale(d.Seconds))
            .attr('r', 5)
            .attr('class', 'dot')
            .attr('data-xvalue', d => d.Year)
            .attr('data-yvalue', d => d.Seconds)
            .attr('fill', d => {
                return d.Doping === '' ? 'cyan' : '#dd4814'
            })
            .style('stroke', 'black')
            .on('mouseover', (even, d) => {
                tooltip.attr('data-year', d.Year)
                    .html(
                        '<strong>Name</strong>: ' + d.Name + ',<br><strong>Time</strong>: ' + d.Time + ',<br><strong>Year</strong>: ' + d.Year + ',<br><strong>Nationality</strong>: ' + d.Nationality
                    )
                    .style('opacity', 1)
                    .style('left', (even.pageX + 20) + 'px')
                    .style('top', even.pageY + 'px')
            })
            .on('mouseout', (even, d) => {
                tooltip.attr('data-year', '')
                    .text('')
                    .style('opacity', 0)
                    .style('left', '0px')
                    .style('top', '0px')
            })

        graph.append('g')
            .attr('transform', 'translate(0,' + (h - padding) + ')')
            .call(xAxis)
            .attr('id', 'x-axis')
        graph.append('g')
            .attr('transform', 'translate(' + padding + ',0)')
            .call(yAxis)
            .attr('id', 'y-axis')

        graph.append('rect')
            .attr('x', 600)
            .attr('y', 200)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', 'cyan')
        graph.append('text')
            .attr('x', 625)
            .attr('y', 215)
            .text('No doping')
        graph.append('rect')
            .attr('x', 600)
            .attr('y', 225)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', '#dd4814')
        graph.append('text')
            .attr('x', 625)
            .attr('y', 240)
            .text('Doping')
    })