// const { d3 } = require("d3-node");
d3.csv('https://raw.githubusercontent.com/edav-42/review-vs-stream/main/data/d3_data.csv').then(data => {
	const width = 10000
	const height = 300000
	const scale = 4
	const gdata = d3.group(data, d => d.Rank);
	const garray = Array.from(gdata, ([, value]) => ({ value }));
	const svg = d3.select('svg')
	const head = [
		{ text: 'Rank', x: 0 },
		{ text: 'Album', x: 50 },
		{ text: 'Artist', x: 300 },
		{ text: 'Popularity', x: 500 }
	]

	// Fixed text
	svg.append('g')
		.attr('id', 'head')
		.selectAll('text')
		.data(head)
		.enter()
		.append('text')
		.attr('x', d => d.x)
		.attr('y', '10')
		.text(d => d.text)

	svg.append('g')
		.attr('id', 'rank')
		.selectAll('text')
		.data(garray)
		.enter()
		.append('text')
		.attr('x', '0')
		.attr('y', (d, i) => i * 22 + 50)
		.attr('width', 20)
		.text(d => d.value[0].Rank)
	svg.append('g')
		.attr('id', 'album')
		.selectAll('text')
		.data(garray)
		.enter()
		.append('text')
		.attr('x', '50')
		.attr('y', (d, i) => i * 22 + 50)
		.attr('width', 20)
		.text(d => d.value[0].Album_Name)
	svg.append('g')
		.attr('id', 'artist')
		.selectAll('text')
		.data(garray)
		.enter()
		.append('text')
		.attr('x', '300')
		.attr('y', (d, i) => i * 22 + 50)
		.attr('width', 20)
		.text(d => d.value[0].Singer)

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

	svg.append('g')
		.attr('id', 'mean')
		.selectAll('circle')
		.data(garray)
		.enter()
			.append('circle')
			.attr('cx', d => 500 + +d3.mean(d.value, v => v.popularity) * scale)
			.attr('cy', (d, i) => i * 22 + 45)
			.attr('r', '8')
			.attr('fill', '#007aff')
	
	const mean_circ = d3.select('#mean').selectAll('circle')
	mean_circ.on('click', function() {
		const cy = d3.select(this).attr('cy');
		const cx = d3.select(this).attr('cx');
		const tracks = d3.select(this).data()[0].value;
		const width = scale * (d3.max(tracks, v => v.popularity) - d3.min(tracks, v => v.popularity));
		const new_cx = 500 + scale * d3.min(tracks, v => v.popularity);
		const line = [[+new_cx, +cy], [+new_cx + width, +cy]];
		
		d3.select(this)
			.transition()
			.duration(100)
			.attr('r', '0');
		
		const g = svg.append('g')
		g.selectAll('circle')
			.data(tracks)
			.enter()
				.append('circle')
				.attr('cx', cx)
				.attr('cy', cy)
				.attr('r', '5')
				.attr('fill', '#007aff99')
				.transition()
				.duration(100)
				.attr('r','5')
				.transition()
				.duration(500)
				.attr('cx', d => 500 + +d.popularity * scale);

		const mylinegen = d3.line()
			.x(d => d[0])
			.y(d => d[1]);
		console.log(cx + width);
		g.append('path')
			.datum(line)
			.transition()
			.duration(100)
			.attr('d', mylinegen([[+cx, +cy], [+cx, +cy]]))
			.attr('class', 'line')
			.transition()
			.duration(500)
			.attr('d', mylinegen)

	})
})