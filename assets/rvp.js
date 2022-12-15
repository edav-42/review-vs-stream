// const { d3 } = require("d3-node");
d3.csv('https://raw.githubusercontent.com/edav-42/review-vs-stream/main/data/d3_data.csv').then(data => {
	const width = 10000;
	const height = 300000;
	const gdata = d3.group(data, d => d.Rank);
	const garray = Array.from(gdata, ([, value]) => ({ value }));
	const svg = d3.select('svg');
	const head = [
		{ text: 'Rank', x: 0, y: 50 },
		{ text: 'Album', x: 50, y: 50 },
		{ text: 'Artist', x: 300, y: 50 },
		// { text: 'Popularity', x: 500, y:20 }
	];

	// Scale
	const axisScale = d3.scaleLinear()
					.domain([0, 100])
					.range([500, 900]);
	
	const axis = d3.axisTop(axisScale)
	svg.append("g")
		.attr("class", "axis")
		.attr("transform",
			`translate(0, 50)`)
		.call(axis);

	// Fixed text
	svg.append('g')
		.attr('id', 'head')
		.selectAll('text')
		.data(head)
		.enter()
		.append('text')
		.attr('x', d => d.x)
		.attr('y', d => d.y)
		.text(d => d.text)

	svg.append('g')
		.attr('id', 'rank')
		.selectAll('text')
		.data(garray)
		.enter()
		.append('text')
		.attr('x', '0')
		.attr('y', (d, i) => i * 22 + 80)
		.attr('width', 20)
		.text(d => d.value[0].Rank)
	svg.append('g')
		.attr('id', 'album')
		.selectAll('text')
		.data(garray)
		.enter()
		.append('text')
		.attr('x', '50')
		.attr('y', (d, i) => i * 22 + 80)
		.attr('width', 20)
		.text(d => d.value[0]['Album_Name'])
	svg.append('g')
		.attr('id', 'artist')
		.selectAll('text')
		.data(garray)
		.enter()
		.append('text')
		.attr('x', '300')
		.attr('y', (d, i) => i * 22 + 80)
		.attr('width', 20)
		.text(d => d.value[0].Singer)


	function renderAspect(aspect) {
		const maxPop = (aspect == 'popularity' ? 100 : 1); //d3.max(garray, v => d3.max(v.value, z => z.popularity));
		const minPop = 0; //d3.min(garray, v => d3.min(v.value, z => z.popularity));
		const popScale = d3.scaleLinear()
			.domain([minPop, maxPop])
			.range([500, 900]);
			const colorScale = d3.scaleLinear()
			.domain([minPop, maxPop])
			.range([100, 255]);

		// Interactive
		// svg.append('g')
		// 	.attr('id', 'bars')
		// 	.selectAll('rect')
		// 	.data(garray)
		// 	.enter()
		// 		.append('rect')
		// 		.attr('x', d => 500 + +d3.min(d.value, v => v.popularity) * 3)
		// 		.attr('y', (d, i) => i * 22 + 35)
		// 		.attr('height', '20')
		// 		.attr('width', d => (d3.max(d.value, v => v.popularity) - d3.min(d.value, v => v.popularity)) * 3)
		// 		.attr('fill', 'lightblue')

		function pickMeanColor(aspect) {
			if (aspect == 'popularity') {
				return 'rgb(0, 122, 255)'
			} else if (aspect == 'danceability') {
				return 'rgb(255, 80, 0)'
			} else if (aspect == 'energy') {
				return 'rgb(255, 0, 0)'
			}
		}
		svg.append('g')
			.attr('id', 'mean')
			.selectAll('circle')
			.data(garray)
			.enter()
				.append('circle')
				.attr('cx', d => popScale(d3.mean(d.value, v => v[aspect])))
				.attr('cy', (d, i) => i * 22 + 75)
				.attr('r', '8')
				.attr('fill', pickMeanColor(aspect))
		
		const mean_circ = d3.select('#mean').selectAll('circle')
		let track = d3.selectAll('.track')
		mean_circ.on('click', function() {
			const cy = d3.select(this).attr('cy');
			const cx = d3.select(this).attr('cx');
			const tracks = d3.select(this).data()[0].value;
			const width = popScale(d3.max(tracks, v => v[aspect])) - popScale(d3.min(tracks, v => v[aspect]));
			const new_cx = popScale(d3.min(tracks, v => v[aspect]));
			const line = [[+new_cx, +cy], [+new_cx + width, +cy]];
			
			function pickTrackColor(aspect, d) {
				if (aspect == 'popularity') {
					return `0, 122, ${colorScale(d)}`
				} else if (aspect == 'danceability') {
					return `${colorScale(d)}, 80, 0`
				} else if (aspect == 'energy') {
					return `${colorScale(d)}, 0, 0`
				}
			}

			d3.select(this)
				.transition()
				.duration(200)
				.attr('r', '0')
				.attr('fill', d => 'rgb(' + pickTrackColor(aspect, d3.mean(d.value, v => v[aspect])) + ')');
			
			const g = svg.append('g')
			g.selectAll('circle')
				.data(tracks)
				.enter()
					.append('circle')
					.attr('class', 'track')
					.attr('cx', cx)
					.attr('cy', cy)
					.attr('r', '5')
					.attr('fill', d => "rgba("+ pickTrackColor(aspect, d[aspect]) + ", 0.7)")
					.transition()
					.duration(200)
					.attr('r','6')
					.transition()
					.duration(500)
					.attr('cx', d => popScale(d[aspect]));

			const mylinegen = d3.line()
				.x(d => d[0])
				.y(d => d[1]);
			g.append('path')
				.datum(line)
				.transition()
				.duration(200)
				.attr('d', mylinegen([[+cx, +cy], [+cx, +cy]]))
				.attr('class', 'line')
				.transition()
				.duration(500)
				.attr('d', mylinegen)
			
			track = d3.selectAll('.track');
			track.on('mouseover', function(event, d) {
				const [x,y] = d3.pointer(event);
				info.html(d.name)
					.transition()
					.duration(50)
					.style('visibility', 'visible')
					.style('left', (x + 10) + "px")
					.style('top', (y + 40) + "px");
			track.on('mouseout', function() {
				info.style('visibility', 'hidden');
			})
			})
		})

		const info = d3.select('.info');
	}

	renderAspect('popularity');
	// Buttons
	d3.selectAll('.button')
		.on('click', function(event) {
			d3.select('#mean').remove();
			d3.selectAll('.track').remove();
			d3.selectAll('.line').remove();
			renderAspect(event.currentTarget.value);
		})
})