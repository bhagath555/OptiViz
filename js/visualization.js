import { getFunction } from './functionUtils.js';
import * as opti from './optimization.js'
import * as vizUtils from './vizUtils.js';


export function getNelderMeadInputs() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
    const x3 = parseFloat(document.getElementById('x3').value);
    const y3 = parseFloat(document.getElementById('y3').value);

    return [[x1, y1], [x2, y2], [x3, y3]];
}

export function simplexToXYZ(simplex, f) {
    const x = simplex.map(p => p[0]).concat(simplex[0][0]);
    const y = simplex.map(p => p[1]).concat(simplex[0][1]);
    const z = simplex.map(p => f([p[0], p[1]])).concat(f([simplex[0][0], simplex[0][1]]));
    return { x, y, z };
}

export function getX0(){
    return getNumericInput('x0', 3);
}

export function getY0(){
    return getNumericInput('y0', 2);
}

export function getA0(){
    return getNumericInput('a0', -4);
}

export function getC0(){
    return getNumericInput('c0', 4);
}

export function getStepLengthValue(){
    return getNumericInput('stepLength', 0.1);
}

export function getNumericInput(id, fallback = null) {
    const el = document.getElementById(id);
    if (!el) return fallback;
    const val = parseFloat(el.value);
    return val;
}

// Initial plot viewer for each problem

// This function will be moved to visualization.js later. Now it is here for testing purpose
export function visualize1D_initial(plot_id, x_min = -10, x_max = 10) {
    const funcname = document.getElementById("objectiveSelect").value.trim();
    const x0 = getX0();

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content
    
    // Check if the function name is valid and get the function
    const f = getFunction(funcname, 1).f;
    if (!f) {
        console.error("Invalid function name:", funcname);
        return;
    }

    const { X, Y } = vizUtils.get1dPlotData(f, x0);

    // Get the data for plotting
    const data = vizUtils.plotly_1d_initial_data(X, Y, x0, f(x0));

    vizUtils.displayTerminationInitial();

    const layout = vizUtils.getLayout(1, 'Function with Initial Guess');

    Plotly.react(plot_id, data, layout, vizUtils.Config_1D());
}

export function visualize1d(optimizer, x_min = -10, x_max = 10) {

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

    let plot_name, isConverged, isDiverged;
    const f = getFunction(funcname, 1).f;
    const { X, Y } = vizUtils.get1dPlotData(f, x0);

    // Optimization Algorithm
    let x_all = [], f_all = [], x_dot = [], f_dot = [];


    switch (optimizer) {
        case 'steepest':
            plot_name = "Steepest descent";
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = opti.steepestDescent1D(funcname, step_method, x0, step_length, tol, max_itr);
            break;
        case 'conjugate':
            plot_name = "Conjugate gradient";
            const beta_method = document.getElementById('betaSelect').value;
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = opti.conjugateGradient1D(funcname, step_method, beta_method, x0, step_length, tol, max_itr);
            break;
        case 'newton':
            plot_name = "Newton";
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = opti.newton1D(funcname, x0, tol, max_itr);
            break;
        case 'lmm':
            plot_name = "LMM";
            const alpha = parseFloat(document.getElementById('alpha').value);
            [x_all, f_all, x_dot, f_dot, isConverged, isDiverged] = opti.lmm1D(funcname, step_method, x0, step_length, alpha, tol, max_itr);
            break;
        default:
            console.warn("Unknown optimization method");
            return;
    }

    // Get the data for plotting
    const data = vizUtils.plotly_1d_initial_data(X, Y, x0, f(x0));

    // Get the layout for plotting
    let layout = vizUtils.getLayout(1, plot_name);

    const num_steps = Math.ceil(x_all.length / 3);
    layout.sliders[0].steps = vizUtils.createSliderSteps(num_steps);

    Plotly.react(plot_id, data, layout, vizUtils.Config_1D());

    // Display termination message in the right div
    vizUtils.displayTermination(isConverged, num_steps, isDiverged);

    // Frame animation setup
    let frames = [];

    // 0th frame with no projections line.
    frames.push({
        name: `step0`,
        data: [
            { x: X, y: Y },
            { x: [x_all[0]], y: [f_all[0]] },
            { x: [], y: [] },
            { x: [], y: [] }
        ]
    });

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

        vizUtils.appendTableRow(table_body, i-1, currentPointsX[3*(i-1)], '-', currentPointsY[3*(i-1)]);
    }

    Plotly.addFrames(plot_id, frames);
}


export function visualize2D_initial(plot_id, cameraoverride = null) {

    const funcname = document.getElementById("objectiveSelect").value;
    const x0 = getX0();
    const y0 = getY0();

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Check if the function name is valid and get the function
    const f = getFunction(funcname, 2).f;
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

    const { X, Y, Z } = vizUtils.get2dPlotData(f, [x0, y0]);

    const data = vizUtils.plotly2DInitialData(X, Y, Z, x0, y0, f([x0, y0]));

    const layout = vizUtils.getLayout(2, 'Function Plot with Initial Guess');

    vizUtils.displayTerminationInitial();

    Plotly.react(plot_id, data, layout, vizUtils.Config_2D());
}

export function visualize2d(optimizer) {
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

    let plot_name, isConverged, isDiverged;
    const f = getFunction(funcname, 2).f;

    const { X, Y, Z } = vizUtils.get2dPlotData(f, x0);

    // Optimization Algorithm
    let x_all = [], y_all = [], z_all = [], x_proj = [], y_proj = [], z_proj = [];

    switch (optimizer) {
        case 'steepest':
            plot_name = "Steepest descent";
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = opti.steepestDescent2D(funcname, step_method, x0, step_length, tol, max_itr);
            break;
        case 'conjugate':
            plot_name = "Conjugate gradient";
            const beta_method = document.getElementById('betaSelect').value;
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = opti.conjugateGradient2D(funcname, step_method, beta_method, x0, step_length, tol, max_itr);
            break;
        case 'newton':
            plot_name = "Newton";
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = opti.newton2D(funcname, x0, tol, max_itr);
            break;
        case 'lmm':
            plot_name = "LMM";
            const alpha = parseFloat(document.getElementById('alpha').value);
            [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged] = opti.lmm2D(funcname, step_method, x0, step_length, alpha, tol, max_itr);
            break;
        default:
            console.warn("Unknown optimization method");
            return;
    }

    // Plot data
    const data = vizUtils.plotly2DInitialData(X, Y, Z, x0, y0, f(x0));

    let layout = vizUtils.getLayout(2, plot_name); // 2 is for surface plot in 2d space

    Plotly.newPlot(plot_id, data, layout, vizUtils.Config_2D());

    const num_steps = Math.ceil(x_all.length / 3);
    layout.sliders[0].steps = vizUtils.createSliderSteps(num_steps);

    Plotly.relayout(plot_id, layout);


    // Display termination message in the right div
    vizUtils.displayTermination(isConverged, num_steps, isDiverged);

    let frames = [];
    // 0th frame with no projections
    frames.push({
        name: `step0`,
        data: [
            { x: X, y: Y, z: Z}, // Surface plot
            { x: [x_all[0]], y: [y_all[0]], z: [z_all[0]] }, // Initial point
            { x: [], y: [], z: [] }, // Placeholder for descent direction
            { x: [], y: [], z: [] } // Placeholder for projection
        ]
    });


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
        vizUtils.appendTableRow(table_body, i-1, currentPointsX[3*(i-1)], currentPointsY[3*(i-1)], currentPointsZ[3*(i-1)]);
    }

    Plotly.addFrames(plot_id, frames);

}


export function golden_initial() {
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getFunction(funcname, 1).f;
    const a0 = getA0();
    const c0 = getC0();
    const plot_id = 'plot';
    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = "";


    const { X, Y } = vizUtils.get1dPlotData(f, Math.max(Math.abs(a0), Math.abs(c0)) );

    const yMin = 1.5 * (Math.min(...Y) - 5);
    const yMax = 1.5 * (Math.max(...Y) + 5);

    const data = vizUtils.createGoldenSectionData(f, X, Y, a0, c0, yMin, yMax);

    vizUtils.displayTerminationInitial();
    let layout = vizUtils.getLayout(1, 'Golden Section Search');
    Plotly.react(plot_id, data, layout, { responsive: true, scrollZoom: true });
}

export function visualize_golden() {

    const funcname = document.getElementById('objectiveSelect').value;
    const f = getFunction(funcname, 1).f;
    const a0 = getA0();
    const c0 = getC0();
    const plot_id = 'plot';

    const max_itr = 100;
    const [a_all, c_all, num_steps, isConverged, isDiverged] = opti.goldenCutMethod(funcname, a0, c0, 1e-2, max_itr);

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = "";

    const { X, Y } = vizUtils.get1dPlotData(f, Math.max(Math.abs(a0), Math.abs(c0)) );
    const yMin = 1.5 * (Math.min(...Y) - 5);
    const yMax = 1.5 * (Math.max(...Y) + 5);

    const data = vizUtils.createGoldenSectionData(f, X, Y, a_all[0], c_all[0], yMin, yMax);

    let layout = vizUtils.getLayout(1, 'Golden Section Search');
    layout.sliders[0].steps = vizUtils.createSliderSteps(num_steps);

    Plotly.react(plot_id, data, layout, vizUtils.Config_1D());

    vizUtils.displayTermination(isConverged, num_steps, isDiverged);

    let frames = [];
    for (let i = 0; i < num_steps; i++) {
        frames.push({
            name: `step${i}`,
            data: vizUtils.createGoldenSectionData(f, X, Y, a_all[i], c_all[i], yMin, yMax)
        });
        vizUtils.goldenAppendTableRow(table_body, i, a_all[i], c_all[i], f(a_all[i]), f(c_all[i]));
    }
    Plotly.addFrames(plot_id, frames);
}


export function visualize_powell() {
    // ACCESS PARAMETERS FROM HTML
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getFunction(funcname, 2).f;
    const x0 = getX0();
    const y0 = getY0();

    const plot_id = 'plot';
    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    const { X, Y, Z } = vizUtils.get2dPlotData(f, [x0, y0]);

    const [path, isConverged, isDiverged] = opti.powellMethod(funcname, [x0, y0], 1e-1);

    const data = [
        vizUtils.plotly_2d_surface_data(X, Y, Z),
        vizUtils.create_line_2d([path[0][0]], [path[0][1]], [f([path[0][0], path[0][1]])], 
                                'scatter3d', 'lines+markers', 'black', 2, null, 4),
    ];

    let layout = vizUtils.getLayout(2, 'Powell Method');
    Plotly.newPlot(plot_id, data, layout, vizUtils.Config_2D());


    const num_steps = path.length;
    layout.sliders[0].steps = vizUtils.createSliderSteps(num_steps);
    Plotly.relayout(plot_id, layout);

    // Display termination message in the right div
    vizUtils.displayTermination(isConverged, num_steps, isDiverged);

    let frames = [];

    frames.push({
        name: `step0`,
        data: [
            { x: X, y: Y, z: Z}, // Surface plot
            { x: [path[0][0]], y: [path[0][1]], z: [f([path[0][0], path[0][1]])] },
        ]
    });

    for (let i = 0; i < num_steps; i++) {
        const currentPointsX = path.slice(0, i + 1).map(p => p[0]);
        const currentPointsY = path.slice(0, i + 1).map(p => p[1]);
        const currentPointsZ = currentPointsX.map((x, j) => f([x, currentPointsY[j]]));

        frames.push({
            name: `step${i}`,
            data: [
                { x: X, y: Y, z: Z },
                { x: currentPointsX, y: currentPointsY, z: currentPointsZ }
            ]
        });
        // Append the table row with the current step information
        vizUtils.appendTableRow(table_body, i, currentPointsX[i], currentPointsY[i], currentPointsZ[i]);
    }
    Plotly.addFrames(plot_id, frames);

}

// -------------------- NELDER MEAD -------------------- //
export function visualize_nelder() {
    // ACCESS PARAMETERS FROM HTML
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getFunction(funcname, 2).f;
    const plot_id = 'plot';

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Use as coordinates
    const initialVertices = getNelderMeadInputs();

    const [simplexes, isConverged, operations] = opti.nelderMead2D(funcname, initialVertices, 1e-2);

    // Create surface
    const { X, Y, Z } = vizUtils.get2dPlotData(f, vizUtils.nelder_max_x0(initialVertices));


    // Prepare initial data traces
    const firstSimplex = simplexes[0];
    const xInit = firstSimplex.map(p => p[0]).concat(firstSimplex[0][0]);
    const yInit = firstSimplex.map(p => p[1]).concat(firstSimplex[0][1]);
    const zInit = firstSimplex.map(p => f([p[0], p[1]])).concat(f([firstSimplex[0][0], firstSimplex[0][1]]));

    const data = [
        vizUtils.plotly_2d_surface_data(X, Y, Z),
        vizUtils.create_line_2d(xInit, yInit, zInit, 'scatter3d', 'lines+markers', 'black', 2, null, 4)
    ];

    let layout = vizUtils.getLayout(2, 'Nelder Mead method');

    Plotly.newPlot(plot_id, data, layout, { responsive: true, scrollZoom: true });

    
    // Updating the frame information
    const frames = simplexes.map((simp, i) => {
        const x = simp.map(p => p[0]).concat(simp[0][0]);
        const y = simp.map(p => p[1]).concat(simp[0][1]);
        const z = simp.map(p => f([p[0], p[1]])).concat(f([simp[0][0], simp[0][1]]));
        
        // Append the table row with the current step information
        vizUtils.nelderMeadTableRow(table_body, i, simp[0][0], simp[0][1], f([simp[0][0], simp[0][1]]));
        
        if (i == 0) {
            vizUtils.nelderMeadTableRow(table_body, '', simp[1][0], simp[1][1], f([simp[1][0], simp[1][1]]));
        }
        else {
            vizUtils.nelderMeadTableRow(table_body, operations[i-1], simp[1][0], simp[1][1], f([simp[1][0], simp[1][1]]));
        }
        vizUtils.nelderMeadTableRow(table_body, '', simp[2][0], simp[2][1], f([simp[2][0], simp[2][1]]));

        return {
            name: `step${i}`,
            data: [
                { x: X, y: Y, z: Z },
                { x:x, y:y, z:z }
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
    vizUtils.displayTermination(isConverged, simplexes.length);

    Plotly.relayout(plot_id, layout);

    Plotly.addFrames(plot_id, frames);
}

export function nelder_initial() {
    // ACCESS PARAMETERS FROM HTML
    const funcname = document.getElementById('objectiveSelect').value;
    const f = getFunction(funcname, 2).f;
    const plot_id = 'plot';

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Use as coordinates
    const initialVertices = getNelderMeadInputs();

   // Create surface
    const { X, Y, Z } = vizUtils.get2dPlotData(f, vizUtils.nelder_max_x0(initialVertices));


    // Prepare initial data traces
    const firstSimplex = initialVertices;
    const xInit = firstSimplex.map(p => p[0]).concat(firstSimplex[0][0]);
    const yInit = firstSimplex.map(p => p[1]).concat(firstSimplex[0][1]);
    const zInit = firstSimplex.map(p => f([p[0], p[1]])).concat(f([firstSimplex[0][0], firstSimplex[0][1]]));
    
    const data = [
        vizUtils.plotly_2d_surface_data(X, Y, Z),
        vizUtils.create_line_2d(xInit, yInit, zInit, 'scatter3d', 'lines+markers', 'black', 2, null, 3)
    ];

    let layout = vizUtils.getLayout(2, 'Nelder Mead Initial');

    vizUtils.displayTerminationInitial();

    Plotly.newPlot(plot_id, data, layout, vizUtils.Config_2D());

}




export function visualize2D_powell_initial(plot_id) {

    const funcname = document.getElementById("objectiveSelect").value;
    const x0 = getX0();
    const y0 = getY0();

    const table_body = document.getElementById('optTableBody');
    table_body.innerHTML = ""; // Clear the previous table content

    // Check if the function name is valid and get the function
    const f = getFunction(funcname, 2).f;
    if (!f) {
        console.error("Invalid function name:", funcname);
        return;
    }

    const { X, Y, Z } = vizUtils.get2dPlotData(f, [x0, y0]);
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

    const layout = vizUtils.getLayout(1, 'Function with Initial Guess');

    vizUtils.displayTerminationInitial();

    Plotly.react(plot_id, data, layout, { responsive: true, scrollZoom: true });
}

