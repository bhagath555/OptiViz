import * as viz from './visualization.js';


// Making DOM Content Loaded before any action on the page - MAIN FUNCTION OF DYANMICS ACCESS.

document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;
    console.log('Page loaded:', page); // Check if the page is loaded
    // Selecting the container that are general in steepst, conjugate, newton and lmm pages
    const toggle2D_container = document.getElementById("toggle2D_container");

    const obj_selector_container = document.getElementById("objectiveSelect_container");

    const obj_container = document.getElementById("objective_container");
    const line_search_container = document.getElementById("line_search_container");
    const x0_container = document.getElementById("x0_container");
    const y0_container = document.getElementById("y0_container");
    const step_length_container = document.getElementById("step_length_container");
    const calc_container = document.getElementById("calculate_container");
    calc_container.innerHTML = calculator_innerhtml(); // show calculate button

    // Plot id
    const plot_id = "plot";

    // 1st and 2nd order methods pages
    if (page === "steepest" || page === "conjugate" || page === "newton" || page === "lmm") {
        // inject toggle and x0 which is common for all pages
        toggle2D_container.innerHTML = toggle2D_innerhtml(); // show 2D toggle
        x0_container.innerHTML = x0_innerhtml(); // show x0 input

        // Differentiating newton from other pages
        if (page !== "newton") {
            // lineaerch and step length inputs for steepst, conjugate and lmm pages
            line_search_container.innerHTML = lineSearchSelect_innerhtml(); // show line search select
            step_length_container.innerHTML = stepLength_innerhtml(); // show step length input
        }
    }

    else if (page === "golden") {

        obj_selector_container.innerHTML = generateObjectiveSelect1D(); // show objective select for 1D functions

        // obj_container.innerHTML = custom_objective1D_innerhtml();


        // a0 and c0 inputs for golden section search
        const a0_container = document.getElementById("a0_container");
        const c0_container = document.getElementById("c0_container");

        a0_container.innerHTML = number_innerhtml("a0", 1, 0.1); // show a0 input
        c0_container.innerHTML = number_innerhtml("c0", 4, 0.1); // show c0 input
    }
    else if (page === "powell" || page === "nelder") {

        obj_selector_container.innerHTML = generateObjectiveSelect2D();

        if (page === "powell") {
            const x0_container = document.getElementById("x0_container");
            const y0_container = document.getElementById("y0_container");
            x0_container.innerHTML = number_innerhtml("x0", 1, 0.1); // show x0 input
            y0_container.innerHTML = number_innerhtml("y0", 4, 0.1); // show y0 input
        }
        else { // page === "nelder"
            const ids = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'];
            const values = {};

            ids.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    values[id] = parseFloat(input.value);
                } else {
                    console.warn(`Input with ID "${id}" not found.`);
                }
            });

        }

    }

    eventListeners();




});



function eventListeners() {
    const page = document.body.dataset.page;
    const plot_id = "plot"; // Common plot id for all pages

    // Page is one of the 1st or 2nd order methods
    if (page === "steepest" || page === "conjugate" || page === "newton" || page === "lmm") {
        const toggle2D = document.getElementById("toggle2D");

        if (page !== "newton") {
            const lineSearchSelect = document.getElementById("lineSearchSelect");
            // Event listener for line search select
            lineSearchSelect.addEventListener("change", function () {
                const lineSearch = lineSearchSelect.value; // get the selected value
                const step_length_container = document.getElementById("step_length_container");
                if (lineSearch === "constant") {
                    step_length_container.innerHTML = stepLength_innerhtml(); // show step length input
                } else {
                    step_length_container.innerHTML = ''; // hide step length input
                }
            });

        }

        // toggle2D event
        toggle2DEvents(); // show/hide y0 and objective select for 2D functions
        toggle2D.addEventListener("change", function () {
            toggle2DEvents(); // show/hide y0 and objective select for 2D functions
        });

        // Calculate event listener
        const calculator = document.getElementById("calculateBtn");
        calculator.addEventListener("click", function () {
            const page = document.body.dataset.page; // Get the current page from the body data attribute
            const toggle2D = document.getElementById("toggle2D");
            if (toggle2D.checked) {
                viz.visualize2d(page);
            }
            else {
                viz.visualize1d(page);
            }
        });

    }
    // Page is golden section search
    else if (page === "golden") {
        const calculateBtn = document.getElementById("calculateBtn");
        // Event listener for calculate button
        calculateBtn.addEventListener("click", function () {
            viz.visualize_golden(); // plot the function with initial guess
        })

        // Event listener for objective select
        const obj_selector = document.getElementById("objectiveSelect");
        obj_selector.addEventListener("change", function () {
            objectiveSelect_eventListener(); // update the objective select
        });

        // Event listener for a0
        const a0 = document.getElementById("a0");
        a0.addEventListener("input", function () {
            viz.golden_initial();
        });

        const c0 = document.getElementById("c0");
        c0.addEventListener("input", function () {
            viz.golden_initial();
        });

        viz.golden_initial(); // plot the function with initial guess

    }
    // Page is powell or nelder mead
    else if (page === "powell") {
        // Event listener for objective select
        const obj_selector = document.getElementById("objectiveSelect");
        obj_selector.addEventListener("change", function () {
            objectiveSelect_eventListener(); // update the objective select
        });

        // Event listener for x0
        const x0 = document.getElementById("x0");
        x0.addEventListener("input", function () {
            viz.visualize2D_initial(plot_id); // plot the function with initial guess
        });

        // Event listener for y0
        const y0 = document.getElementById("y0");
        y0.addEventListener("input", function () {
            viz.visualize2D_initial(plot_id); // plot the function with initial guess
        });

        const calculateBtn = document.getElementById("calculateBtn");
        calculateBtn.addEventListener("click", function () {
            viz.visualize_powell(); // plot the function with initial guess
        });

        viz.visualize2D_initial(plot_id); // plot the function with initial guess

    }

    else if (page === "nelder") {

        // Event listener for objective select
        const obj_selector = document.getElementById("objectiveSelect");

        obj_selector.addEventListener("change", function () {
            objectiveSelect_eventListener(); // update the objective select
        });

        // Event listener for x0,y0,x1,y1,x2,y2,x3,y3
        const inputs = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            // Event listeners for each input
            input.addEventListener("input", function () {
                viz.nelder_initial();
            });
        });

        const calculateBtn = document.getElementById("calculateBtn");
        calculateBtn.addEventListener("click", function () {
            viz.visualize_nelder(); // plot the function with initial guess
        });

        viz.nelder_initial(); // plot the function with initial guess
    }
}

function objectiveSelect_eventListener() {
    const page = document.body.dataset.page; // Get the current page from the body data attribute
    const toggle2D = document.getElementById("toggle2D");
    const objective = document.getElementById("objectiveSelect").value; // get the selected value
    const obj_container = document.getElementById("objective_container");
    if (objective === "custom") {
        // updating the function based on the page
        if (page === "nelder" || page === "powell") {
            obj_container.innerHTML = custom_objective2D_innerhtml(); // show custom objective input
        }
        else if (page === "golden") {
            obj_container.innerHTML = custom_objective1D_innerhtml(); // show custom objective input
        }
        else if (page === "steepest" || page === "conjugate" || page === "newton" || page === "lmm") {
            if (toggle2D.checked) {
                obj_container.innerHTML = custom_objective2D_innerhtml(); // show custom objective input
            } else {
                obj_container.innerHTML = custom_objective1D_innerhtml(); // show custom objective input
            }
        }

        // Add event listener for custom objective input
        const custom_objective = document.getElementById("custom_objective");
        custom_objective.addEventListener("change", function () {
            if (page === "steepest" || page === "conjugate" || page === "newton" || page === "lmm") {
                if (toggle2D.checked) {
                    viz.visualize2D_initial("plot"); // plot the function with initial guess
                }
                else {
                    viz.visualize1D_initial("plot"); // plot the function with initial guess
                }
            }
            else if (page === "golden") {
                viz.golden_initial(); // plot the function with initial guess
            }
            else if (page === "powell") {
                viz.visualize2D_initial("plot"); // plot the function with initial guess
            }
            else if (page === "nelder") {
                viz.nelder_initial(); // plot the function with initial guess
            }
        });


    } else {
        obj_container.innerHTML = ''; // hide custom objective input
    }

    if (page === "steepest" || page === "conjugate" || page === "newton" || page === "lmm") {
        if (toggle2D.checked) {
            viz.visualize2D_initial("plot"); // plot the function with initial guess
        }
        else {
            viz.visualize1D_initial("plot"); // plot the function with initial guess
        }
    }
    else if (page === "golden") {
        viz.golden_initial(); // plot the function with initial guess
    }
    else if (page === "powell") {
        viz.visualize2D_initial("plot"); // plot the function with initial guess
    }
    else if (page === "nelder") {
        viz.nelder_initial(); // plot the function with initial guess
    }
}
// Event listeners that creates the dynamic html for 2D toggle and objective select
function toggle2DEvents() {
    const page = document.body.dataset.page; // Get the current page from the body data attribute
    const plot_id = "plot";
    const toggle2D = document.getElementById("toggle2D");
    // If 2D toggle is checked, show y0 and objective select for 2D functions
    const x0_container = document.getElementById("x0_container");
    const y0_container = document.getElementById("y0_container");
    const obj_container = document.getElementById("objective_container");

    const obj_selector_container = document.getElementById("objectiveSelect_container");

    // Also, update their event listeners
    if (toggle2D.checked) {

        x0_container.innerHTML = x0_innerhtml(); // show x0 input
        y0_container.innerHTML = y0_innerhtml(); // show y0 input

        obj_selector_container.innerHTML = generateObjectiveSelect2D(); // show objective select for 2D functions

        // Event listener for objective select
        const obj_selector = document.getElementById("objectiveSelect");
        obj_selector.addEventListener("change", function () {
            objectiveSelect_eventListener(); // update the objective select
        });

        // Event listener for x0
        const x0 = document.getElementById("x0");
        x0.addEventListener("input", function () {
            const plotElement = document.getElementById(plot_id);
            let camera = { eye: { x: 1.5, y: 1.5, z: 1.5 } };

            const sceneId = Object.keys(plotElement._fullLayout || {}).find(k => k.startsWith("scene"));
            if (sceneId && plotElement._fullLayout[sceneId]?.camera) {
                camera = plotElement._fullLayout[sceneId].camera;
            }

            viz.visualize2D_initial(plot_id, camera);

        });

        // Event listener for y0
        const y0 = document.getElementById("y0");
        y0.addEventListener("input", function () {
            const plotElement = document.getElementById(plot_id);
            let camera = { eye: { x: 1.5, y: 1.5, z: 1.5 } };

            const sceneId = Object.keys(plotElement._fullLayout || {}).find(k => k.startsWith("scene"));
            if (sceneId && plotElement._fullLayout[sceneId]?.camera) {
                camera = plotElement._fullLayout[sceneId].camera;
            }

            viz.visualize2D_initial(plot_id, camera); // plot the function with initial guess
        });

        // ------------------------------------------------------
        viz.visualize2D_initial(plot_id); // plot the function with initial guess


    } else { // 1D

        obj_selector_container.innerHTML = generateObjectiveSelect1D(); // show objective select for 1D functions

        x0_container.innerHTML = x0_innerhtml(); // show x0 input
        y0_container.innerHTML = ''; // hide

        // Event listener for objective select
        const obj_selector = document.getElementById("objectiveSelect");
        obj_selector.addEventListener("change", function () {
            objectiveSelect_eventListener(); // update the objective select
        });


        // Event listener for x0
        const x0 = document.getElementById("x0");
        x0.addEventListener("input", function () {
            viz.visualize1D_initial(plot_id); // plot the function with initial guess
        });

        // Note : y0 is not used in 1D, so no need to add event listener for y0

        // Initial plot with default values
        // ---------------------------------------------------------------------
        viz.visualize1D_initial(plot_id); // plot the function with initial guess

    }
}


//
// InnerHTML creating functions
//
function toggle2D_innerhtml() {
    return `
        <label for="toggle2D" class="form-label mb-0">2D</label>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="toggle2D" check>
        </div>`;
}


function generateObjectiveSelectHTML(options = []) {
    const optionHTML = options.map(([value, label]) =>
        `<option value="${value}">${label}</option>`
    ).join('\n');

    return `
        <label for="objectiveSelect" class="form-label mb-0">Function</label>
        <select class="form-select w-auto" id="objectiveSelect" style="width: 100px;">
            ${optionHTML}
        </select>`;
}

function generateObjectiveSelect1D() {
    return generateObjectiveSelectHTML([
        ["parabola", "Parabola"],
        ["wavybowl", "Wavy bowl"],
        ["custom", "custom"],
    ]);
}

function generateObjectiveSelect2D() {
    return generateObjectiveSelectHTML([
        ["sphere", "Sphere"],
        ["rosenbrock", "Rosenbrock"],
        ["himmelblau", "Himmelblau"],
        ["custom", "custom"],
    ]);
}


// If new functions are added in utils.js, add them here as well.
function custom_objective1D_innerhtml() {
    return `
        <input type="text" class="form-control" id="custom_objective" value="x^2" style="max-width: 200px;"> `
};

function custom_objective2D_innerhtml() {
    return ` 
        <input type="text" class="form-control" id="custom_objective" value="x^2 + y^2" style="max-width: 200px;"> `
};


function lineSearchSelect_innerhtml() {
    return `
        <label for="lineSearchSelect" class="form-label mb-0">LineSearch</label>
        <select class="form-select w-auto" id="lineSearchSelect" style="width: 100px;">
            <option value="constant">Constant</option>
            <option value="armijo">Armijo Rule</option>
            <option value="exact">Exact Line Search</option>
        </select>`;
}

function x0_innerhtml() {
    return `
        <label for="x0" class="form-label mb-0">X0</label>
        <input type="number" class="form-control" id="x0" value="2" step="0.1" min="-10" max="10" style="max-width: 100px;">`;
}

function y0_innerhtml() {
    return `
        <label for="y0" class="form-label mb-0">Y0</label>
        <input type="number" class="form-control" id="y0" value="2" step="0.1" min="-10" max="10" style="max-width: 100px;">`
}

function stepLength_innerhtml() {
    return `
        <label for="stepLength" class="form-label mb-0">StepLength</label>
        <input type="number" class="form-control" id="stepLength" value="0.6" step="0.1" min="-10" max="10" style="max-width: 100px;">`;
}

function number_innerhtml(name, value, step) {
    return `
        <label for="${name}" class="form-label mb-0">${name}</label>
        <input type="number" class="form-control" id="${name}" value="${value}" step="${step}" style="max-width: 100px;">`;
}

function calculator_innerhtml() {
    return `<button type="button" class="btn btn-primary" id="calculateBtn">Calculate</button>`
}
