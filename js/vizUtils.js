// ------------ TABLE Update functions -------------
// --------------- TABLE FUNCTIONS --------------- //

// format the value to 3 decimal places if it's a number, otherwise return the value as is
export function formatValue(val) {
    return (typeof val === 'number') ? val.toFixed(3) : val;
}

// Append a row to the table with the given values  
export function appendTableRow(table_body, itr, x, y, f) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itr}</td>
        <td>${formatValue(x)}</td>
        <td>${formatValue(y)}</td>
        <td>${formatValue(f)}</td>
    `;
    table_body.appendChild(row);
}

// Append a row to the table with the given values  
export function goldenAppendTableRow(table_body, itr, a, c, fa, fc) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itr}</td>
        <td>${formatValue(a)}</td>
        <td>${formatValue(c)}</td>
        <td>${formatValue(fa)}</td>
        <td>${formatValue(fc)}</td>
    `;
    table_body.appendChild(row);
}


export function nelderMeadTableRow(table_body, itr, x, y, f) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itr}</td>
        <td>${formatValue(x)}</td>
        <td>${formatValue(y)}</td>
        <td>${formatValue(f)}</td>
    `;
    table_body.appendChild(row);
}

export function displayTermination(isConverged, num_steps, isDiverged=false){
    const Termination = document.getElementById('termination');
    if (isDiverged) {
        Termination.innerHTML = "Termination : Diverging";
        Termination.style.color = "red";
        return;
    }
    if (isConverged) {
        Termination.innerHTML = "Termination : Converged after " + (num_steps - 1) + " steps";
        Termination.style.color = "green";
    } else {
        Termination.innerHTML = "Termination : Maximum number of steps reached";
        Termination.style.color = "blue";
    }
}


export function displayTerminationInitial(){
    const Termination = document.getElementById('termination');
    Termination.innerHTML = "Termination : Not started yet";
    Termination.style.color = "black";
}

export function displayInvalidFunction(){
    const Termination = document.getElementById('termination');
    Termination.innerHTML = `Invalid function, please check the function input.`;
    Termination.style.color = "red";
}

export function displayInvalidFunctionOpti(message){
    const Termination = document.getElementById('termination');
    Termination.innerHTML = `Invalid function, please check the function input.
    </br> Can't perform optimization`;
    Termination.style.color = "red";
}

export function displayInvalidInput(message){
    const Termination = document.getElementById('termination');
    Termination.innerHTML = `Invalid input - ${message}.
    </br> please check the input values.`;
    Termination.style.color = "red";
}

// ----------------------- Plotting helpers ----------------------- //

export function get1dPlotData(f, x0) {

    let xrange;

    if (Math.abs(x0) > 2) {
        xrange = [-1.5 * Math.abs(x0), 1.5 * Math.abs(x0)];
    }
    else {
        xrange = [-5, 5];
    }

    const x = xrange[0];
    const xstep = (xrange[1] - xrange[0]) / 100;
    const X = [];
    const Y = [];

    for (let i = x; i <= xrange[1]; i += xstep) {
        X.push(i);
        Y.push(f(i));
    }
    return { X, Y };
}

/**
 * This function genrates 3D points for surface plot.
 * Inputs
 * - f: function to evaluate
 * - x0: initial guess list of two elements [x0, y0]
 */
export function get2dPlotData(f, x0){

    let xrange, yrange;

    const max_val = Math.max(Math.abs(x0[0]), Math.abs(x0[1]));
    if (max_val > 2) {
        xrange = [-1.5 * max_val, 1.5 * max_val];
        yrange = [-1.5 * max_val, 1.5 * max_val];
    } else {
        xrange = [-5, 5];
        yrange = [-5, 5];
    }

    const x = xrange[0];
    const y = yrange[0];
    const xstep = (xrange[1] - xrange[0]) / 100;
    const ystep = (yrange[1] - yrange[0]) / 100;
    const X = [];
    const Y = [];
    const Z = [];

    for (let i = x; i <= xrange[1]; i += xstep) {
        X.push(i);
    }
    for (let i = y; i <= yrange[1]; i += ystep) {
        Y.push(i);
    }
    for (let j = 0; j < Y.length; j++) {
        const row = [];
        for (let i = 0; i < X.length; i++) {
            row.push(f([X[i], Y[j]]));
        }
        Z.push(row);
    }


    return {X, Y, Z};
}


export function nelder_max_x0(init_splinex){
    let max = -Infinity;
    for (const point of init_splinex) {
        max = Math.max(max, Math.abs(point[0]), Math.abs(point[1]));
    }
    return [max, max];
}


// Creates a 1D line trace for Plotly plots with customizable color, width, dash style, legend, and hover info
export function createLineTrace1D(x, y, color = 'black', width = 2, dash = null, showlegend = false, hoverinfo = 'x+y') {
    return {
        x, y,
        mode: 'lines',
        line: { color, width, ...(dash && { dash }) },
        showlegend,
        hoverinfo
    };
}

// Creates a 1D marker trace for Plotly plots with customizable color, size, legend, and hover info
export function createMarkerTrace1D(x, y, color = 'black', size = 6, showlegend = false, hoverinfo = 'x+y') {
    return {
        x, y,
        mode: 'markers',
        marker: { color, size },
        showlegend,
        hoverinfo
    };
}


export function create_line_2d(x, y, z, type, mode, color = 'black', width = 2, dash = null, size = 3, showlegend = false, hoverinfo = 'x+y') {
    return {
        x, y, z,
        type,
        mode,
        line: { color, width, ...(dash && { dash }) },
        marker: { color, size },
        showlegend,
        hoverinfo
    };
}


export function plotly_1d_initial_data(X, Y, x0, y0) {
    return [
        createLineTrace1D(X, Y, 'black', 2),
        createMarkerTrace1D([x0], [y0], 'red', 8),
        createLineTrace1D([], [], 'blue', 2),
        createLineTrace1D([], [], 'green', 1, 'dot')
    ];
}



export function plotly_2d_surface_data(X, Y, Z, opacity = 0.8, colorscale = 'Viridis') {
    return {
        x: X,
        y: Y,
        z: Z,
        type: "surface",
        colorscale: colorscale,
        opacity: opacity,
        showscale: false,
        showlegend: false
    };
}



export function plotly2DInitialData(X,Y,Z,x0,y0,z0) {
    return [
        // Surfaace
        plotly_2d_surface_data(X, Y, Z),
        // Points on the surface
        create_line_2d([x0], [y0], [z0], 'scatter3d', 'markers', 'black', 2, null, 4),
        // Descent direction
        create_line_2d([], [], [], 'scatter3d', 'lines', 'black', 2, null),
        // Projection line
        create_line_2d([], [], [], 'scatter3d', 'lines+markers', 'black', 1, 'dot')
    ];
}


export function createGoldenSectionData(f, X, Y, a, c, yMin, yMax) {
    return [
        createLineTrace1D(X, Y, 'black', 2),
        createMarkerTrace1D([a], [f(a)], 'blue', 8),
        createMarkerTrace1D([c], [f(c)], 'red', 8),
        createLineTrace1D([a, a], [yMin, yMax], 'blue', 2, 'dot'),
        createLineTrace1D([c, c], [yMin, yMax], 'red', 2, 'dot')
    ];
}


// Returns a Plotly layout object for 1D or 2D plots, including title, axes, legend, and slider configuration
export function getLayout(dim, name) {
    /**
     * This function returns the layout for 1D or 2D+ plots
     */
    let layout = {
        title: name,
        showlegend: true,
        margin: { t: 40, b: 20, l: 20, r: 10 },
        autosize: true,
        sliders: [{
            pad: { t: 25 },
            currentvalue: {
                xanchor: 'right',
                prefix: 'Step: ',
                font: { color: '#888', size: 15 }
            },
            ticklen: 0,
            transition: { duration: 300, easing: 'cubic-in-out' },
            bgcolor: 'blue',
            bordercolor: 'black',
            steps: []
        }]
    };

    if (dim === 1) {
        // 1D plot axes
        layout.xaxis = { title: 'x' };
        layout.yaxis = { title: 'f(x)' };
    } else if (dim === 2) {
        // 2D plot axes (3D scene)
        layout.scene = {
            xaxis: { title: 'x', showspikes: false },
            yaxis: { title: 'y', showspikes: false },
            zaxis: { title: 'f(x, y)', showspikes: false },

            aspectmode: 'manual',
            aspectratio: { x: 1, y: 1, z: 0.5 },
        };
    } else {
        throw new Error("Unsupported dimension: only dim = 1 or 2 supported.");
    }

    return layout;
}

// Generates an array of slider step objects for Plotly animations, given the number of steps
export function createSliderSteps(num_steps) {
    const steps = [];
    for (let i = 0; i < num_steps; i++) {
        steps.push({
            label: `${i}`,
            method: 'animate',
            args: [[`step${i}`], {
                mode: 'immediate',
                transition: { duration: 0 },
                frame: { duration: 300, redraw: true }
            }]
        });
    }
    return steps;
}

// Returns Plotly config options for 1D plots (enables responsive, scroll zoom, and customizes mode bar)
export function Config_1D() {
    return {
        responsive: true,
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'hoverCompareCartesian', 'toggleSpikelines', 'hoverClosestCartesian'],
    };
}

// Returns Plotly config options for 2D plots (enables responsive, scroll zoom, and customizes mode bar)
export function Config_2D(){
    return {
    responsive: true,
    scrollZoom: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['hoverClosest3d'],
  };
}
