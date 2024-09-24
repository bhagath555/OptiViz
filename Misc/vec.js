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
});
