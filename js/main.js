// Generate x values from -10 to 10 with a step of 0.1
const x = math.range(-10, 10, 0.1).toArray();

// Compute y = sin(x) for each x
const y = x.map(xi => math.sin(xi));

// Create a trace for Plotly
const trace = {
    x: x,
    y: y,
    type: 'scatter',
    mode: 'lines',
    name: 'y = sin(x)'
};

// Render the plot in the div with id 'plot'
Plotly.newPlot('plot', [trace], {
    title: 'Plot of y = sin(x)',
    xaxis: { title: 'x' },
    yaxis: { title: 'y' }
});
