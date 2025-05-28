function plotFunction() {
    const input = document.getElementById("functionInput").value;
    const expr = math.parse(input);
    const compiled = expr.compile();

    // Generate x values from -10 to 10
    const xValues = math.range(-10, 10, 0.1).toArray();

    // Safely evaluate the function for each x
    let yValues = [];
    try {
        yValues = xValues.map(x => {
            const scope = { x };
            const y = compiled.evaluate(scope);
            // Filter NaN or complex values
            return typeof y === "number" && isFinite(y) ? y : null;
        });
    } catch (error) {
        alert("Error evaluating the function: " + error.message);
        return;
    }

    const trace = {
        x: xValues,
        y: yValues,
        mode: 'lines',
        type: 'scatter',
        name: input,
        line: { shape: 'spline' }
    };

    const layout = {
        title: `Plot of y = ${input}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' }
    };

    Plotly.newPlot('plot', [trace], layout);
}
