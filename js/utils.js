// This file contains utility functions for optimization problems.
// It includes functions to compute the function value, gradient, and Hessian for various test functions.


// --------------- MATRIX FUNCTIONS --------------- //
// 2*2 Matrix inversion function 
function invertMatrix2x2(matrix) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];
    const det = a * d - b * c;
    if (det === 0) {
        throw new Error("Matrix is singular and cannot be inverted.");
    }
    return [[d / det, -b / det], [-c / det, a / det]];
}

function identityMatrix(n) {
    const matrix = new Array(n).fill(0).map(() => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        matrix[i][i] = 1;
    }
    return matrix;
}

// Matrix vector multiplication function
function multiplyMatrixVector(matrix, vector) {
    const result = new Array(matrix.length).fill(0);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}

function matrixAdd(matrixA, matrixB) {
    // Check if both have the same number of rows
    if (matrixA.length !== matrixB.length) {
      throw new Error("Matrices must have the same number of rows.");
    }
  
    // Check if each row has the same number of columns
    for (let i = 0; i < matrixA.length; i++) {
      if (matrixA[i].length !== matrixB[i].length) {
        throw new Error(`Row ${i} of both matrices must have the same number of columns.`);
      }
    }
  
    const result = [];
  
    for (let i = 0; i < matrixA.length; i++) {
      const row = [];
      for (let j = 0; j < matrixA[i].length; j++) {
        row.push(matrixA[i][j] + matrixB[i][j]);
      }
      result.push(row);
    }
  
    return result;
  }
  
// Scale the matrix
function matrixScale(matrix, scalar) {
    return matrix.map(row => row.map(value => value * scalar));
}

function vectorNorm(vector) {
    return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
}

function vectorNormSquared(vector) {
    return vector.reduce((sum, val) => sum + val * val, 0);
}
function vectorAdd(v1, v2) {
    return v1.map((val, i) => val + v2[i]);
}
function vectorSubtract(v1, v2) {
    return v1.map((val, i) => val - v2[i]);
}

function vectorScale(v, scalar) {
    return v.map(val => val * scalar);
}

function vectorDot(v1, v2) {
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
}


// --------------- 1D OPTIMIZATION FUNCTIONS --------------- //
// If new function are added in this section, add them in the getfunction(), 
// and objectiveSelect1D_innerhtml and objectiveSelect2D_innerhtml in page.js.

// Parabola function
// f(x) = 2 + (x - 1)^2
// Gradient: 2 * (x - 1)
// Hessian: 2
const parabola = {
    name: "Parabola",
    description: "f(x) = 2 + (x)^2",
    f: function(x) {
        return 2 + Math.pow(x, 2);
    },
    g: function(x) {
        return 2 * x;
    },
    h: function(x) {
        return 2;
    },
    hessianInv: function(x) {
        return 0.5;
    },
};



// Wavybowl function
// f(x) = 0.05 * x^2 - cos(x)
// Gradient: 0.1 * x + sin(x)
// Hessian: 0.1 - cos(x)
const wavybowl = {
    name: "Wavybowl",
    description: "f(x) = 0.05 * x^2 - cos(x)",
    f: function(x) {
        return 0.05 * x * x - Math.cos(x);
    },
    g: function(x) {
        return 0.1 * x + Math.sin(x);
    },
    h: function(x) {
        return 0.1 + Math.cos(x);
    },
    hessianInv: function(x) {
        return 1 / (0.1 + Math.cos(x));
    },
};


// --------------- 2D OPTIMIZATION FUNCTIONS --------------- //

// Sphere function
// f(x, y) = x^2 + y^2
// Gradient: [2x, 2y]
// Hessian: [[2, 0], [0, 2]]
const sphere = {
    name: "Sphere",
    description: "f(x) = x^2 + y^2",
    f: function(x) {
        return Math.pow(x[0], 2) + Math.pow(x[1], 2);
    },
    g: function(x) {
        return [2 * x[0], 2 * x[1]];

    },
    h: function(x) {
        return [[2, 0], [0, 2]];
    },
    hessianInv: function(x) {
        return [[0.5, 0], [0, 0.5]];
    },
};


// Rosenbrock function
// f(x, y) = (1 - x)^2 + 100 * (y - x^2)^2
// Gradient: [2 * (x - 1) + 400 * (y - x^2) * x, 200 * (y - x^2)]
// Hessian: [[2 + 400 * (y - x^2), -400 * x], [-400 * x, 200]]

const rosenbrock = {
    name: "Rosenbrock",
    description: "f(x, y) = (1 - x)^2 + 100 * (y - x^2)^2",
    f: function(x) {
        return Math.pow(1 - x[0], 2) + 100 * Math.pow(x[1] - Math.pow(x[0], 2), 2);
    },
    g: function(x) {
        return [2 * (x[0] - 1) - 400 * (x[1] - Math.pow(x[0], 2)) * x[0], 200 * (x[1] - Math.pow(x[0], 2))];
    },
    h: function(x) {
        return [[2 - 400 * (x[1] - Math.pow(x[0], 2)), -400 * x[0]], [-400 * x[0], 200]];
    },
    hessianInv: function(x) {
        let hess = this.h(x);
        return invertMatrix2x2(hess);
    },
};


// Himmelblau function
// f(x, y) = (x^2 + y - 11)^2 + (x + y^2 - 7)^2
// Gradient: [4 * (x^2 + y - 11) * x + 2 * (x + y^2 - 7), 2 * (x^2 + y - 11) + 4 * (x + y^2 - 7) * y]
// Hessian: [[12 * x^2 + 2 * y - 42, 4 * x + 4 * y], [4 * x + 4 * y, 12 * y^2 + 2 * x - 26]]

const himmelblau = {
    name: "Himmelblau",
    description: "f(x, y) = (x^2 + y - 11)^2 + (x + y^2 - 7)^2",
    f: function(x) {
        return Math.pow(Math.pow(x[0], 2) + x[1] - 11, 2) + Math.pow(x[0] + Math.pow(x[1], 2) - 7, 2);
    },
    g: function(x) {
        return [4 * (Math.pow(x[0], 2) + x[1] - 11) * x[0] + 2 * (x[0] + Math.pow(x[1], 2) - 7), 2 * (Math.pow(x[0], 2) + x[1] - 11) + 4 * (x[0] + Math.pow(x[1], 2) - 7) * x[1]];
    },
    h: function(x) {
        return [[12 * Math.pow(x[0], 2) + 2 * x[1] - 42, 4 * x[0] + 4 * x[1]], [4 * x[0] + 4 * x[1], 12 * Math.pow(x[1], 2) + 2 * x[0] - 26]];
    },
    hessianInv: function(x) {
        let hess = this.h(x);
        return invertMatrix2x2(hess);
    },
};

// Banana function (Rosenbrock's valley)
// f(x, y) = (1 - x)^2 + 100 * (y - x^2)^2
// Gradient: [2 * (x - 1) + 400 * (y - x^2) * x, 200 * (y - x^2)]
// Hessian: [[2 + 400 * (y - x^2), -400 * x], [-400 * x, 200]]

const banana = {
    name: "Banana",
    description: "f(x, y) = (1 - x)^2 + 100 * (y - x^2)^2",
    f: function(x) {
        return Math.pow(1 - x[0], 2) + 100 * Math.pow(x[1] - Math.pow(x[0], 2), 2);
    },
    g: function(x) {
        return [2 * (x[0] - 1) + 400 * (x[1] - Math.pow(x[0], 2)) * x[0], 200 * (x[1] - Math.pow(x[0], 2))];
    },
    h: function(x) {
        return [[2 + 400 * (x[1] - Math.pow(x[0], 2)), -400 * x[0]], [-400 * x[0], 200]];
    },
    hessianInv: function(x) {
        let hess = this.h(x);
        return invertMatrix2x2(hess);
    },
};


const sinCosBowl = {
    name: "SinCosBowl",
    description: "f(x, y) = sin(x)·cos(y) + 0.1(x² + y²)",

    // Function value
    f: function(x) {
        return Math.sin(x[0]) * Math.cos(x[1]) + 0.1 * (x[0] ** 2 + x[1] ** 2);
    },

    // Gradient
    g: function(x) {
        return [
            Math.cos(x[0]) * Math.cos(x[1]) + 0.2 * x[0],  // df/dx
            -Math.sin(x[0]) * Math.sin(x[1]) + 0.2 * x[1] // df/dy
        ];
    },

    // Hessian matrix
    h: function(x) {
        return [
            [ // d²f/dx²
                -Math.sin(x[0]) * Math.cos(x[1]) + 0.2,
                -Math.cos(x[0]) * Math.sin(x[1])        // d²f/dxdy
            ],
            [ // d²f/dydx, d²f/dy²
                -Math.cos(x[0]) * Math.sin(x[1]),
                -Math.sin(x[0]) * Math.cos(x[1]) + 0.2
            ]
        ];
    },

    // Inverse of the Hessian (optional, using helper function)
    hessianInv: function(x) {
        let hess = this.h(x);
        return invertMatrix2x2(hess);
    },
};

function getArbitraryFunction() {
    const funcStr = document.getElementById("functionInput").value.trim();
    const toggle2D = document.getElementById("toggle2D").checked;
    if (!funcStr) {
        throw new Error("Function input cannot be empty.");
    }

    try {
        const expr = Math.parse(funcStr);

        // If the function is 2D
        if (toggle2D) {
            // Derivatives for 2D functions
            const dfdx = expr.derivative("x");
            const dfdy = expr.derivative("y");

            // Second derivatives for Hessian
            const d2fdx2 = dfdx.derivative("x");
            const d2fdy2 = dfdy.derivative("y");
            const d2fdxdy = dfdx.derivative("y");
            const d2fdydx = dfdy.derivative("x");
            return {
                name: "Arbitrary 2D Function",
                description: funcStr,
                f: (x) => expr.evaluate({ x: x[0], y: x[1] }),
                g: (x) => [dfdx.evaluate({ x: x[0], y: x[1] }), dfdy.evaluate({ x: x[0], y: x[1] })],
                h: (x) => [
                    [d2fdx2.evaluate({ x: x[0], y: x[1] }), d2fdxdy.evaluate({ x: x[0], y: x[1] })],
                    [d2fdydx.evaluate({ x: x[0], y: x[1] }), d2fdy2.evaluate({ x: x[0], y: x[1] })]
                ],
                hessianInv: (x) => invertMatrix2x2(this.h(x))
            };

        }

        // If the function is 1D
        else{
            // Derivative for 1D functions
            const dfdx = expr.derivative("x");

            // Second derivative for Hessian
            const d2fdx2 = dfdx.derivative("x");
            return {
                name: "Arbitrary 1D Function",
                description: funcStr,
                f: (x) => expr.evaluate({ x: x }),
                g: (x) => dfdx.evaluate({ x: x }),
                h: (x) => d2fdx2.evaluate({ x: x }),
                hessianInv: (x) => 1 / d2fdx2.evaluate({ x: x })
            };
        }
    }
    catch (error) {
        throw new Error("Invalid function input: " + error.message);
    }    
}


function getfunction(funcname) {
    switch (funcname) {
        case "parabola":
            return parabola;
        case "wavybowl":
            return wavybowl;
        case "sphere":
            return sphere;
        case "rosenbrock":
            return rosenbrock;
        case "himmelblau":
            return himmelblau;
        case "banana":
            return banana;
        case "sinCosBowl":
            return sinCosBowl;
        default:
            throw new Error("Unknown function name: " + funcname);
    }
}

function func1Dplotdata(funcname, xrange) {
    const f = getfunction(funcname).f;
    const x = xrange[0];
    const xstep = (xrange[1] - xrange[0]) / 100;
    const xdata = [];
    const ydata = [];

    for (let i = x; i <= xrange[1]; i += xstep) {
        xdata.push(i);
        ydata.push(f(i));
    }
    return xdata, ydata;
}

function func2Dplotdata(f, xrange, yrange){
    const x = xrange[0];
    const y = yrange[0];
    const xstep = (xrange[1] - xrange[0]) / 100;
    const ystep = (yrange[1] - yrange[0]) / 100;
    const xdata = [];
    const ydata = [];   
    const zdata = [];

    for (let i = x; i <= xrange[1]; i += xstep) {
        xdata.push(i);
    }
    for (let i = y; i <= yrange[1]; i += ystep) {
        ydata.push(i);
    }
    for (let j = 0; j < ydata.length; j++) {
        const row = [];
        for (let i = 0; i < xdata.length; i++) {
            row.push(f([xdata[i], ydata[j]]));
        }
        zdata.push(row);
    }


    return [xdata, ydata, zdata];
}

// --------------- ARMIJO RULE --------------- //
/**
 * Armijo backtracking line search algorithm.
 * Works with both 1D scalar and nD vector input.
 *
 * @param {Function} f - Objective function.
 * @param {number|number[]} dk - descent direction (negative gradient).
 * @param {number|number[]} xk - Current point.
 * @param {number} [beta=0.5] - Step size reduction factor.
 * @param {number} [sigma=0.5] - Armijo condition constant.
 * @returns {number} Optimal step size α satisfying the Armijo condition.
 */
function armijoLineSearch(f, dk, xk, beta = 0.5, sigma = 0.5) {
    let tk = 1;
    const fk = f(xk);
  
    const isVector = Array.isArray(xk);
  
    const Vecdot = (a, b) => a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const Vecadd = (a, b) => a.map((ai, i) => ai + b[i]);
    const Vecscale = (vec, scalar) => vec.map(v => v * scalar);
  
    let gradDotDir, xNew, f_new, f_appr;
  
    if (isVector) {
      gradDotDir = Vecdot(Vecscale(dk, -1), dk);
      xNew = Vecadd(xk, Vecscale(dk, tk));
      f_new = f(xNew);
      f_appr = fk + sigma * tk * gradDotDir;
  
      while (f_new > f_appr) {
        tk *= beta;
        xNew = Vecadd(xk, Vecscale(dk, tk));
        f_new = f(xNew);
        f_appr = fk + sigma * tk * gradDotDir;
      }
    } else {
      gradDotDir = -1 * dk * dk;
      xNew = xk + tk * dk;
      f_new = f(xNew);
      f_appr = fk + sigma * tk * gradDotDir;
  
      while (f_new > f_appr) {
        tk *= beta;
        xNew = xk + tk * dk;
        f_new = f(xNew);
        f_appr = fk + sigma * tk * gradDotDir;
      }
    }
  
    return tk;
  }
  


// --------------- LINE SEARCH --------------- //
/**
 * Performs exact line search using the Golden Section Search method to find 
 * the optimal step size that minimizes the function along a given search direction.
 *
 * @param {function} f - The objective function to minimize. It accepts either a number or an array.
 * @param {number|number[]} dk - The search direction (negative gradient), scalar for 1D or vector for nD.
 * @param {number|number[]} xk - The current point, scalar or array depending on the problem dimension.
 * @param {number} [alphaLow=0] - The lower bound of the step size interval.
 * @param {number} [alphaHigh=2] - The upper bound of the step size interval.
 * @param {number} [tol=1e-2] - Tolerance for convergence (minimum interval size).
 * @param {number} [maxIter=50] - Maximum number of iterations to perform.
 *
 * @returns {number} The optimal step size α that approximately minimizes f(xk + α * dk).
 *
 * @example
 * // 1D example
 * const f = (x) => (x - 2) ** 2;
 * const alpha = exactLineSearch(f, -2, 0);
 *
 * @example
 * // 2D example
 * const f = (x) => (x[0] - 1)**2 + (x[1] + 2)**2;
 * const grad = [2, 4];
 * const alpha = exactLineSearch(f, grad.map(g => -g), [2, -1]);
 */
function exactLineSearch(f, dk, xk, alphaLow = 0, alphaHigh = 2, tol = 1e-5, maxIter = 50) {

    const phi = (alpha) => {
        // Line search function: f(xk + alpha * dk)
        if (Array.isArray(xk)) {
            const xNew = xk.map((xi, i) => xi + alpha * dk[i]);
            return f(xNew);
        } else {
            return f(xk + alpha * dk);
        }
    };

    const gr = (Math.sqrt(5) + 1) / 2;
    let a = alphaLow;
    let b = alphaHigh;

    let c = b - (b - a) / gr;
    let d = a + (b - a) / gr;

    let iter = 0;

    while (Math.abs(b - a) > tol && iter < maxIter) {
        if (phi(c) < phi(d)) {
            b = d;
        } else {
            a = c;
        }

        c = b - (b - a) / gr;
        d = a + (b - a) / gr;
        iter++;
    }

    return (a + b) / 2;
  }

  
// Step length based on selection linear search method
function getStepLength(step_method, f, dk, xk, stepLength){
    let step_length = 0.1; // Default step length

    switch (step_method) {
        case "exact":
            step_length = exactLineSearch(f, dk, xk);
            break;
        case "armijo":
            step_length = armijoLineSearch(f, dk, xk);
            break;
        case "constant":
            step_length = stepLength;
            break;
        default:
            console.error("Unknown method: " + step_method);
    }

    return step_length;
}

// Conjugate gradient beta calculation
function computeBeta2D(method, gk, old_gk, dk_prev) {
    const yk = vectorSubtract(gk, old_gk);
    switch (method) {
      case 'FR': return vectorNormSquared(gk) / vectorNormSquared(old_gk);
      case 'PR': return vectorDot(gk, yk) / vectorNormSquared(old_gk);
      case 'HS': return vectorDot(gk, yk) / (-vectorDot(dk_prev, yk));
      case 'DY': return vectorNormSquared(gk) / (-vectorDot(dk_prev, yk));
      default: return 0;
    }
  }
  
  function computeBeta1D(method, g_new, g_old, d_old = null) {
    const y = g_new - g_old;
  
    switch (method) {
      case 'FR': // Fletcher–Reeves
        return (g_new * g_new) / (g_old * g_old);
  
      case 'PR': // Polak–Ribière
        return (g_new * y) / (g_old * g_old);
  
      case 'HS': // Hestenes–Stiefel
        if (d_old === 0 || y === 0) return 0;
        return (g_new * y) / (-d_old * y);
  
      case 'DY': // Dai–Yuan
        if (d_old === 0 || y === 0) return 0;
        return (g_new * g_new) / (-d_old * y);
  
      default:
        console.warn("Unknown beta method. Falling back to 0.");
        return 0;
    }
  }
  

  // --------------- TABLE FUNCTIONS --------------- //

// format the value to 3 decimal places if it's a number, otherwise return the value as is
function formatValue(val) {
    return (typeof val === 'number') ? val.toFixed(3) : val;
}

// Append a row to the table with the given values  
function appendTableRow(table_body, itr, x, y, f) {
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
function goldenAppendTableRow(table_body, itr, a, c, fa, fc) {
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


function nelderMeadTableRow(table_body, itr, x, y, f) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itr}</td>
        <td>${formatValue(x)}</td>
        <td>${formatValue(y)}</td>
        <td>${formatValue(f)}</td>
    `;
    table_body.appendChild(row);
}

function displayTermination(isConverged, num_steps, isDiverged=false){
    const Temination = document.getElementById('termination');
    if (isDiverged) {
        Temination.innerHTML = "Termination : Diverging";
        Temination.style.color = "red";
        return;
    }
    if (isConverged) {
        Temination.innerHTML = "Termination : Converged after " + (num_steps - 1) + " steps";
        Temination.style.color = "green";
    } else {
        Temination.innerHTML = "Termination : Maximum number of steps reached";
        Temination.style.color = "blue";
    }
}

function displayTerminationInitial(){
    const Temination = document.getElementById('termination');
    Temination.innerHTML = "Termination : Not started yet";
    Temination.style.color = "black";
}