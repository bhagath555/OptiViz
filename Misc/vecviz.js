document.getElementById('vectorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const vector1 = {
        x: parseFloat(document.getElementById('v1-x').value),
        y: parseFloat(document.getElementById('v1-y').value),
        z: parseFloat(document.getElementById('v1-z').value) || 0
    };

    const vector2 = {
        x: parseFloat(document.getElementById('v2-x').value),
        y: parseFloat(document.getElementById('v2-y').value),
        z: parseFloat(document.getElementById('v2-z').value) || 0
    };

    const output = `
        <h3>Entered Vectors:</h3>
        <p>Vector 1: (${vector1.x}, ${vector1.y}, ${vector1.z})</p>
        <p>Vector 2: (${vector2.x}, ${vector2.y}, ${vector2.z})</p>
    `;

    document.getElementById('output').innerHTML = output;

    plotVectors(vector1, vector2);
});

function plotVectors(vector1, vector2) {
    const trace1 = {
        x: [0, vector1.x],
        y: [0, vector1.y],
        z: [0, vector1.z],
        mode: 'lines+markers',
        marker: {
            size: 5,
            color: 'red'
        },
        line: {
            width: 4,
            color: 'red'
        },
        name: 'Vector 1'
    };

    const trace2 = {
        x: [0, vector2.x],
        y: [0, vector2.y],
        z: [0, vector2.z],
        mode: 'lines+markers',
        marker: {
            size: 5,
            color: 'blue'
        },
        line: {
            width: 4,
            color: 'blue'
        },
        name: 'Vector 2'
    };

    const data = [trace1, trace2];

    const layout = {
        title: '3D Vector Visualization',
        scene: {
            xaxis: {title: 'X-axis'},
            yaxis: {title: 'Y-axis'},
            zaxis: {title: 'Z-axis'}
        }
    };

    Plotly.newPlot('plot', data, layout);
}
