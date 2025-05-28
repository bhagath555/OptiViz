
/** 
 * Visualize nelder mead method
 */
function visualize1d(optimizer) {

    // Access all the information
    const funcname = document.getElementById('objectiveSelect').value;
    const x0 = getX0();

    // Access the step method and length
    let step_method = null, step_length = null;
    if (optimizer !== 'newton'){
        step_method = document.getElementById('lineSearchSelect').value;
        // If the method is constant, we need to get the step length from the input field
        if (step_method === 'constant'){
            step_length = getStepLengthValue();
        }
    }


    const plot_id = 'plot';

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    const tol = 1e-2;
    const max_itr = 100;

    let plot_name;
    const f = getfunction(funcname, 1).f;
    const X = numeric.linspace(-10, 10, 200);
    const Y = X.map(f);

    // Optimization Algorithm
    let x_all = [], f_all = [], x_dot = [], f_dot = [];


    switch (optimizer) {
        case 'steepest':
            plot_name = "Steepest descent";
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = steepestDescent1D(funcname, step_method, x0, step_length, tol, max_itr);
            break;
        case 'conjugate':
            plot_name = "Conjugate gradient";
            const beta_method = document.getElementById('betaSelect').value;
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = conjugateGradient1D(funcname, step_method, beta_method, x0, step_length, tol, max_itr);
            break;
        case 'newton':
            plot_name = "Newton";
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = newton1D(funcname, x0, tol, max_itr);
            break;
        case 'lmm':
            plot_name = "LMM";
            const alpha = parseFloat(document.getElementById('alpha').value);
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = lmm1D(funcname, step_method, x0, step_length, alpha, tol, max_itr);
            break;
        default:
            console.warn("Unknown optimization method");
            return;
    }

    const data = [
        createLineTrace1D(X, Y, 'black'),
        createMarkerTrace1D([x_all[0]], [f_all[0]], 'red', 6),
        createLineTrace1D([], [], 'blue', 2),
        createLineTrace1D([], [], 'green', 1, 'dot'),
    ];

    let layout = getLayout(1, plot_name);
    const num_steps = Math.ceil(x_all.length / 3);
    layout.sliders[0].steps = createSliderSteps(num_steps);

    Plotly.react(plot_id, data, layout, Config_1D());
    let frames = [];

    // 0th frame with no projectons
    frames.push({
        name: `step0`,
        data: [
            { x: X, y: Y },
            { x: [x_all[0]], y: [f_all[0]] },
            { x: [], y: [] },
            { x: [], y: [] }
        ]
    });

    // Display termination message in the right div
    displayTermination(isConverged, num_steps, isDiverged);

    // Data of each frame
    for (let i = 1; i <= num_steps; i++) {
        const currentPointsX = x_all.slice(0, 3 * i);
        const currentPointsY = f_all.slice(0, 3 * i);
        const dotX = x_dot.slice(0, 3 * i);
        const dotY = f_dot.slice(0, 3 * i);

        frames.push({
            name: `step${i}`,
            data: [
                { x: X, y: Y },
                { x: currentPointsX, y: currentPointsY },
                { x: currentPointsX, y: currentPointsY },
                { x: dotX, y: dotY }
            ]
        });

        appendTableRow(table_body, i-1, currentPointsX[3*(i-1)], '-', currentPointsY[3*(i-1)]);
    }

    Plotly.addFrames(plot_id, frames);
}


/** 
 * Visualize nelder mead method
 */
function visualize2d(optimizer) {
    // Access all the information
    const funcname = document.getElementById('objectiveSelect').value;
    // x0 = [x0, y0], below
    const x0 = [getX0(), getY0()];

    // Access the step method and length
    let step_method = null, step_length = null;
    if (optimizer !== 'newton'){
        step_method = document.getElementById('lineSearchSelect').value;
        // If the method is constant, we need to get the step length from the input field
        if (step_method === 'constant'){
            step_length = getStepLengthValue();
        }
    }

    const plot_id = 'plot';
    const tol = 1e-2;
    const max_itr = 100;

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    let plot_name;
    const f = getfunction(funcname, 2).f;
    let X, Y, Z;
    [X, Y, Z] = func2Dplotdata(f, [-5, 5], [-5, 5]);


    // Optimization Algorithm
    let x_all = [], y_all = [], z_all = [], x_proj = [], y_proj = [], z_proj = [];

    switch (optimizer) {
        case 'steepest':
            plot_name = "Steepest descent";
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = steepestDescent2D(funcname, step_method, x0, step_length, tol, max_itr);
            break;
        case 'conjugate':
            plot_name = "Conjugate gradient";
            const beta_method = document.getElementById('betaSelect').value;
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = conjugateGradient2D(funcname, step_method, beta_method, x0, step_length, tol, max_itr);
            break;
        case 'newton':
            plot_name = "Newton";
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = newton2D(funcname, x0, tol, max_itr);
            break;
        case 'lmm':
            plot_name = "LMM";
            const alpha = parseFloat(document.getElementById('alpha').value);
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = lmm2D(funcname, step_method, x0, step_length, alpha, tol, max_itr);
            break;
        default:
            console.warn("Unknown optimization method");
            return;
    }

    // Plot data
    const data = [
        {
            x: X,
            y: Y,
            z: Z,
            type: 'surface',
            colorscale: 'Viridis',
            showscale: false,
            opacity: 0.7,
            showlegend: false,
        },
        {
            x: [x_all[0]],
            y: [y_all[0]],
            z: [z_all[0]],
            type: 'scatter3d',
            mode: 'markers',
            marker: { color: 'red', size: 6 },
            showlegend: false,

        },
        {
            x: [],
            y: [],
            z: [],
            type: 'scatter3d',
            mode: 'lines',
            line: { color: 'blue', width: 2 },
            showlegend: false,
        },
        {
            x: [],
            y: [],
            z: [],
            type: 'scatter3d',
            mode: 'lines',
            line: { color: 'green', dash: 'dot', width: 1 },
            showlegend: false,
        }
    ];

    let layout = getLayout(2, plot_name); // 2 is for surface plot in 2d space
    Plotly.newPlot(plot_id, data, layout, { responsive: true, scrollZoom: true });

    const num_steps = Math.ceil(x_all.length / 3);
    layout.sliders[0].steps = createSliderSteps(num_steps);

    Plotly.relayout(plot_id, layout);  

    let frames = [];

    // 0th frame with no projectons  
    frames.push({
        name: `step0`,
        data: [
            { x: X, y: Y, z: Z}, // Surface plot
            { x: [x_all[0]], y: [y_all[0]], z: [z_all[0]] }, // Initial point
            { x: [], y: [], z: [] }, // Placeholder for descent direction
            { x: [], y: [], z: [] } // Placeholder for projection
        ]
    });

    // Display termination message in the right div
    displayTermination(isConverged, num_steps, isDiverged);

    // Data of each frame
    for (let i = 1; i <= num_steps; i++) {
        const currentPointsX = x_all.slice(0, 3 * i);
        const currentPointsY = y_all.slice(0, 3 * i);
        const currentPointsZ = z_all.slice(0, 3 * i);

        const dotX = x_proj.slice(0, 3 * i);
        const dotY = y_proj.slice(0, 3 * i);
        const dotZ = z_proj.slice(0, 3 * i);

        frames.push({
            name: `step${i}`,
            data: [
                { x: X, y: Y, z: Z }, // Surface plot
                { x: currentPointsX, y: currentPointsY, z: currentPointsZ }, // descent points
                { x: currentPointsX, y: currentPointsY, z: currentPointsZ }, // descent line
                { x: dotX, y: dotY, z: dotZ } // Projection points
            ]
        });

        // Append the table row with the current step information
        appendTableRow(table_body, i-1, currentPointsX[3*(i-1)], currentPointsY[3*(i-1)], currentPointsZ[3*(i-1)]);
    }

    Plotly.addFrames(plot_id, frames);

}

/** 
 * Visualize nelder mead method
 */
function visualize_golden() {
    // ACCESS PARAMETERS FROM HTML
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getfunction(funcname, 1).f;
    const a0 = getA0();
    const c0 = getC0();
    const max_itr = 100;

    [a_all, c_all, num_steps, isConverged, isDiverged] = goldenCutMethod(funcname, a0, c0, 1e-2, max_itr);
    const plot_id = 'plot';

    table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    const X = numeric.linspace(-10, 10, 200);
    const Y = X.map(f);

    const yMin = Math.min(...Y);
    const yMax = Math.max(...Y);

    const data = [
        {
            x: X,
            y: Y,
            mode: 'lines',
            name: 'f(x)',
            line: { color: 'black' }
        },
        {
            x: [a_all[0]],
            y: [f(a_all[0])],
            mode: 'markers',
            name: 'a values',
            marker: { color: 'blue', size: 8, symbol: 'circle' }
        },
        {
            x: [c_all[0]],
            y: [f(c_all[0])],
            mode: 'markers',
            name: 'c values',
            marker: { color: 'red', size: 8, symbol: 'diamond' }
        },
        {
            x: [a_all[0], a_all[0]],
            y: [yMin, yMax],
            mode: 'lines',
            name: 'a_k',
            line: { color: 'blue', dash: 'dot' }
        },
        {
            x: [c_all[0], c_all[0]],
            y: [yMin, yMax],
            mode: 'lines',
            name: 'c_k',
            line: { color: 'red', dash: 'dot' }
        }
    ];

    let layout = getLayout(1, 'Golden Section Search');

    layout.sliders[0].steps = createSliderSteps(num_steps);

    Plotly.react(plot_id, data, layout, { responsive: true, scrollZoom: true });

    let frames = [];

    displayTermination(isConverged, num_steps, isDiverged);

    // Data of each frame
    for (let i = 0; i < num_steps; i++) {
        let a = a_all[i];
        let c = c_all[i];

        frames.push({
            name: `step${i}`,
            data: [
                { x: X, y: Y },
                { x: [a], y: [f(a)] },
                { x: [c], y: [f(c)] },
                { x: [a, a], y: [yMin, yMax] },
                { x: [c, c], y: [yMin, yMax] }
            ]
        });

        // Append the table row with the current step information 
        goldenAppendTableRow(table_body, i, a, c, f(a), f(c));       
    }

    Plotly.addFrames(plot_id, frames);

}

function golden_initial() {
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getfunction(funcname, 1).f;
    const a0 = getA0();
    const c0 = getC0();

    const plot_id = 'plot';

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    const X = numeric.linspace(-10, 10, 200);
    const Y = X.map(f);

    const yMin = Math.min(...Y);
    const yMax = Math.max(...Y);

    const data = [
        createLineTrace1D(X, Y, 'black'),
        createMarkerTrace1D([a0], [f(a0)], 'blue', 8),
        createMarkerTrace1D([c0], [f(c0)], 'red', 8),
        createLineTrace1D([a0, a0], [yMin, yMax], 'blue', 2, 'dot'),
        createLineTrace1D([c0, c0], [yMin, yMax], 'red', 2, 'dot'),

    ];

    displayTerminationInitial();
    let layout = getLayout(1, 'Golden Section Search');

    Plotly.react(plot_id, data, layout, { responsive: true, scrollZoom: true });

}


/*
 * Visualize powell method
 */
function visualize_powell() {
    // ACCESS PARAMETERS FROM HTML
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getfunction(funcname, 2).f;
    const x0 = getX0();
    const y0 = getY0();

    const plot_id = 'plot';
    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    const [X, Y, Z] = func2Dplotdata(f, [-5, 5], [-5, 5]);

    const [path, isConverged, isDiverged] = powellMethod(funcname, [x0, y0], 1e-1);

    const data = [
        {
            x: X,
            y: Y,
            z: Z,
            type: 'heatmap',
            colorscale: 'Viridis',
            showscale: true,
            zsmooth: 'best',
            opacity: 0.7,
        },
        {
            x: [path[0][0]],
            y: [path[0][1]],
            // z: [f([path[0][0], path[0][1]])],
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'black', size: 10}
        },
        {
            x: [],
            y: [],
            // z: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'black', width: 2 }
        }
    ];

    let layout = getLayout(1, 'Powell Method');
    Plotly.newPlot(plot_id, data, layout, { responsive: true, scrollZoom: true });


    const num_steps = path.length;
    layout.sliders[0].steps = createSliderSteps(num_steps);
    Plotly.relayout(plot_id, layout);

    let frames = [];

    frames.push({
        name: `step0`,
        data: [
            { x: X, y: Y, z: Z}, // Surface plot
            { x: [path[0][0]], y: [path[0][1]] }, // z: [f([path[0][0], path[0][1]])]
            { x: [], y: [] }, //  z: []
        ]
    });

    // Display termination message in the right div
    displayTermination(isConverged, num_steps, isDiverged);

    for (let i = 0; i < num_steps; i++) {
        const currentPointsX = path.slice(0, i + 1).map(p => p[0]);
        const currentPointsY = path.slice(0, i + 1).map(p => p[1]);
        const currentPointsZ = currentPointsX.map((x, j) => f([x, currentPointsY[j]]));

        frames.push({
            name: `step${i}`,
            data: [
                { x: X, y: Y, z: Z },
                { x: currentPointsX, y: currentPointsY }, // z: currentPointsZ
                { x: currentPointsX, y: currentPointsY }, // , z: currentPointsZ
            ]
        });
        // Append the table row with the current step information
        appendTableRow(table_body, i, currentPointsX[i], currentPointsY[i], currentPointsZ[i]);
    }
    Plotly.addFrames(plot_id, frames);

}

/** 
 * Visualize nelder mead method
 */
function visualize_nelder() {
    // ACCESS PARAMETERS FROM HTML
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getfunction(funcname, 2).f;
    plot_id = 'plot';

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Use as coordinates
    const initialVertices = getNelderMeadInputs();

    const [simplexes, isConverged] = nelderMead2D(funcname, initialVertices, 1e-2);

    // Create surface
    const [X, Y, Z] = func2Dplotdata(f, [-5, 5], [-5, 5]);
    const surfaceTrace = {
        type: "surface",
        x: X,
        y: Y,
        z: Z,
        opacity: 0.8,
        colorscale: 'Viridis',
        showscale: false,
        name: 'Surface',
        showlegend: false
    };

    // Prepare initial data traces
    const firstSimplex = simplexes[0];
    const xInit = firstSimplex.map(p => p[0]).concat(firstSimplex[0][0]);
    const yInit = firstSimplex.map(p => p[1]).concat(firstSimplex[0][1]);
    const zInit = firstSimplex.map(p => f([p[0], p[1]])).concat(f([firstSimplex[0][0], firstSimplex[0][1]]));

    const data = [
        surfaceTrace,
        {
            type: 'scatter3d',
            mode: 'lines+markers',
            x: xInit,
            y: yInit,
            z: zInit,
            marker: { size: 4, color: 'black' },
            line: { width: 2, color: 'black' },
            name: 'Simplex',
            showlegend: false
        }
    ];

    let layout = getLayout(2, 'Nelder Mead');

    Plotly.newPlot(plot_id, data, layout, { responsive: true, scrollZoom: true });

    

    // Updating the frame information
    const frames = simplexes.map((simp, i) => {
        const x = simp.map(p => p[0]).concat(simp[0][0]);
        const y = simp.map(p => p[1]).concat(simp[0][1]);
        const z = simp.map(p => f([p[0], p[1]])).concat(f([simp[0][0], simp[0][1]]));
        
        // Append the table row with the current step information
        nelderMeadTableRow(table_body, i, simp[0][0], simp[0][1], f([simp[0][0], simp[0][1]]));
        nelderMeadTableRow(table_body, '', simp[1][0], simp[1][1], f([simp[1][0], simp[1][1]]));
        nelderMeadTableRow(table_body, '', simp[2][0], simp[2][1], f([simp[2][0], simp[2][1]]));

        return {
            name: `step${i}`,
            data: [
                { x: X, y: Y, z: Z },
                { x, y, z }
            ]
        };
    });

    layout.sliders[0].steps = frames.map((frame, i) => ({
        label: `${i}`,
        method: 'animate',
        args: [[frame.name], {
            mode: 'immediate',
            transition: { duration: 0 },
            frame: { duration: 300, redraw: true }
        }]
    }));

    // Add Termination message in the right div
    displayTermination(isConverged, simplexes.length);

    Plotly.relayout(plot_id, layout);

    Plotly.addFrames(plot_id, frames);
}

function nelder_initial() {
    // ACCESS PARAMETERS FROM HTML
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getfunction(funcname, 2).f;
    plot_id = 'plot';

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Use as coordinates
    const initialVertices = getNelderMeadInputs();
   // Create surface
    const [X, Y, Z] = func2Dplotdata(f, [-5, 5], [-5, 5]);
    const surfaceTrace = {
        type: "surface",
        x: X,
        y: Y,
        z: Z,
        opacity: 0.7,
        colorscale: 'Viridis',
        showscale: false,
        name: 'Surface',
        showlegend: false,
    };

    // Prepare initial data traces
    const firstSimplex = initialVertices;
    const xInit = firstSimplex.map(p => p[0]).concat(firstSimplex[0][0]);
    const yInit = firstSimplex.map(p => p[1]).concat(firstSimplex[0][1]);
    const zInit = firstSimplex.map(p => f([p[0], p[1]])).concat(f([firstSimplex[0][0], firstSimplex[0][1]]));
    
    const data = [
        surfaceTrace,
        {
            type: 'scatter3d',
            mode: 'lines+markers',
            x: xInit,
            y: yInit,
            z: zInit,
            marker: { size: 3, color: 'black' },
            line: { width: 2, color: 'black' },
            name: 'Simplex',
            showlegend: false
        }
    ];

    let layout = getLayout(2, 'Nelder Mead');

    displayTerminationInitial();

    Plotly.newPlot(plot_id, data, layout, { responsive: true, scrollZoom: true });

}

// This function will be moved to visualization.js later. Now it is here for testing purpose
function visualize1D_initial(plot_id, xMin = -10, xMax = 10) {
    const funcname = document.getElementById("objectiveSelect").value.trim();
    const x0 = getX0();

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content
    
    // Check if the function name is valid and get the function
    const f = getfunction(funcname, 1).f;
    if (!f) {
        console.error("Invalid function name:", funcname);
        return;
    }

    const X1 = numeric.linspace(xMin, xMax, 200);
    const Y = X1.map(f);

    const data = [
        createLineTrace1D(X1, Y, 'black'),
        createMarkerTrace1D([x0], [f(x0)], 'red', 8),
    ];

    const layout = {
        title: 'Function Plot with Initial Guess',
        xaxis: { title: 'x', range: [xMin, xMax] },
        yaxis: { title: 'f(x)' },
        margin: { t: 40, b: 40, l: 40, r: 20 },
    };

    displayTerminationInitial();

    Plotly.react(plot_id, data, layout, Config_1D());
}

function visualize2D_initial(plot_id, cameraoverride = null) {

    const funcname = document.getElementById("objectiveSelect").value;
    const x0 = getX0();
    const y0 = getY0();

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Check if the function name is valid and get the function
    const f = getfunction(funcname, 2).f;
    if (!f) {
        console.error("Invalid function name:", funcname);
        return;
    }
    
    let camera = cameraoverride || {
        eye: { x: 1.5, y: 1.5, z: 1.5 } // or your preferred initial view
    };

    const plotElement = document.getElementById(plot_id);
    if (plotElement && plotElement._fullLayout && plotElement._fullLayout.scene) {
        const scene = plotElement._fullLayout.scene;
        if (scene.camera) {
            camera = scene.camera;
        }
    }

    console.log("Camera:", camera); // Check the camera settings

    let X, Y, Z;
    [X, Y, Z] = func2Dplotdata(f, [-5, 5], [-5, 5]);

    const data = [
        {
            x: X,
            y: Y,
            z: Z,
            type: 'surface',
            colorscale: 'Viridis',
            opacity: 0.7,
            showscale: false,
            showlegend: false,
        },
        {
            x: [x0],
            y: [y0],
            z: [f([x0, y0])],
            type: 'scatter3d',
            mode: 'markers',
            marker: { color: 'black', size: 3 },
            showlegend: false,
        }
    ];

    const layout = {
        title: 'Function Plot with Initial Guess',
        scene: {
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
            zaxis: { title: 'f(x,y)' },
            camera: camera,
        },
        margin: { t: 40, b: 40, l: 40, r: 20 },
    };

    displayTerminationInitial();

    Plotly.react(plot_id, data, layout, { responsive: true, scrollZoom: true });
}


function visualize2D_powell_initial(plot_id) {

    const funcname = document.getElementById("objectiveSelect").value;
    const x0 = getX0();
    const y0 = getY0();

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Check if the function name is valid and get the function
    const f = getfunction(funcname, 2).f;
    if (!f) {
        console.error("Invalid function name:", funcname);
        return;
    }


    let X, Y, Z;
    [X, Y, Z] = func2Dplotdata(f, [-5, 5], [-5, 5]);
    const data = [
        {
            x: X,
            y: Y,
            z: Z,
            type: 'heatmap',
            colorscale: 'Viridis',
            showscale: true,
            zsmooth: 'best',
            showlegend: false,
            opacity: 0.7,
        },
        {
            x: [x0],
            y: [y0],
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'black', size: 10 },
            showlegend: false,
        
        }
    ];

    const layout = {
        title: 'Function Plot with Initial Guess',
        scene: {
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
        },
        margin: { t: 40, b: 40, l: 40, r: 20 },
    };

    displayTerminationInitial();

    Plotly.react(plot_id, data, layout, { responsive: true, scrollZoom: true });
}


function createLineTrace1D(x, y, color = 'black', width = 2, dash = null, showlegend = false, hoverinfo = 'x+y') {
    return {
        x, y,
        mode: 'lines',
        line: { color, width, ...(dash && { dash }) },
        showlegend,
        hoverinfo
    };
}

function createMarkerTrace1D(x, y, color = 'red', size = 6, showlegend = false, hoverinfo = 'x+y') {
    return {
        x, y,
        mode: 'markers',
        marker: { color, size },
        showlegend,
        hoverinfo
    };
}


function getLayout(dim, name) {
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
        layout.xaxis = { title: 'x' };
        layout.yaxis = { title: 'f(x)' };
    } else if (dim === 2) {
        layout.scene = {
            xaxis: { title: 'x', showspikes: false },
            yaxis: { title: 'y', showspikes: false },
            zaxis: { title: 'f(x, y)', showspikes: false }
        };
    } else {
        throw new Error("Unsupported dimension: only dim = 1 or 2 supported.");
    }

    return layout;
}

function createSliderSteps(num_steps) {
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


function Config_1D() {
    return {
        responsive: true,
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'hoverCompareCartesian'],
    };
}

function Config_2D(){
    return {
        responsive: true,
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'hoverCompareCartesian'],
    };

}


function getNelderMeadInputs() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
    const x3 = parseFloat(document.getElementById('x3').value);
    const y3 = parseFloat(document.getElementById('y3').value);

    return [[x1, y1], [x2, y2], [x3, y3]];
}

function simplexToXYZ(simplex, f) {
    const x = simplex.map(p => p[0]).concat(simplex[0][0]);
    const y = simplex.map(p => p[1]).concat(simplex[0][1]);
    const z = simplex.map(p => f([p[0], p[1]])).concat(f([simplex[0][0], simplex[0][1]]));
    return { x, y, z };
}

function getX0(){
    return getNumericInput('x0', 3);
}

function getY0(){
    return getNumericInput('y0', 2);
}

function getA0(){
    return getNumericInput('a0', -4);
}

function getC0(){
    return getNumericInput('c0', 4);
}

function getStepLengthValue(){
    return getNumericInput('stepLength', 0.1);
}

function getNumericInput(id, fallback = null) {
    const el = document.getElementById(id);
    if (!el) return fallback;
    const val = parseFloat(el.value);
    // if (isNaN(val)) {
    //     console.warn(`Invalid value for ${id}: ${el.value}`);
    //     el.value = fallback; // Reset to fallback value
    //     return fallback;
    // }
    return val;
}