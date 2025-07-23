
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
// f(x) = 0.05 * x^2 + cos(x)
// Gradient: 0.1 * x - sin(x)
// Hessian: 0.1 - cos(x)
const wavybowl = {
    name: "Wavybowl",
    description: "f(x) = 1 * x^2 - cos(x)",
    f: function(x) {
        return x * x + 3 * Math.cos(3 * x);
    },
    g: function(x) {
        return 2 * x - 6 * Math.sin(3 * x);
    },
    h: function(x) {
        return 2 - 18 * Math.cos(3 * x);
    },
    hessianInv: function(x) {
        return 1 / (2 - 18 * Math.cos(3 * x));
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





// Define allowed math functions and operators for safety
const ALLOWED_FUNCTIONS = new Set(['sin', 'cos', 'tan', 'log', 'exp', 'sqrt', 'abs', 'asin', 'acos', 'atan', 'pow']);
const ALLOWED_OPERATORS = new Set(['+', '-', '*', '/', '^']);


/**
 * Recursively validate the AST node to ensure only allowed functions, operators, and variables are used.
 * @param {Object} node - AST node from math.js
 * @param {number} dims - Number of dimensions (1 for x, 2 for x and y)
 * @returns {boolean} True if node is safe, false otherwise
 */
function validateNode(node, dims) {
    switch (node.type) {
        case 'ConstantNode': // Only allow numeric constants
            return typeof node.value === 'number';

        case 'SymbolNode': // Only allow 'x' (1D) or 'x'/'y' (2D) as variables
            return dims === 1 ? node.name === 'x' : node.name === 'x' || node.name === 'y';

        case 'FunctionNode': // Only allow whitelisted functions and validate all arguments
            return ALLOWED_FUNCTIONS.has(node.name) && node.args.every(arg => validateNode(arg, dims));

        case 'OperatorNode': // Only allow whitelisted operators and validate all arguments
            return ALLOWED_OPERATORS.has(node.op) && node.args.every(arg => validateNode(arg, dims));

        case 'ParenthesisNode': // Validate content inside parentheses
            return validateNode(node.content, dims);

        default: // Disallow all other node types
            return false;
    }
}

/**
 * Checks if a math expression string is safe for evaluation.
 * Only allows certain functions, operators, and variables.
 * @param {string} expr - The math expression as a string
 * @param {number} dims - Number of dimensions (1 or 2)
 * @returns {boolean} True if safe, false otherwise
 */
export function isSafeMathInput(expr, dims = 1) {
    // Quick regex check for allowed characters
    if (!/^[0-9A-Za-z+\-*/^(),.\s]*$/.test(expr)) return false;
    try {
        // Parse and validate the AST
        return validateNode(math.parse(expr), dims);
    }
    catch (e) {
        console.error("Error parsing math expression:", e);
        return false;
    }
}


/**
 * Builds a function, its gradient, and Hessian for 1D or 2D input.
 * @param {string} funcStr - The function as a string (e.g., 'x^2 + y^2')
 * @param {number} dims - Number of dimensions (1 or 2)
 * @returns {Object} Object with f (function), g (gradient), h (Hessian)
 */
export function getFunction(funcStr, dims) {

    if (funcStr === "parabola") {
        return parabola;
    }
    else if (funcStr === "wavybowl") {
        return wavybowl;
    }
    else if (funcStr === "sphere") {
        return sphere;
    }
    else if (funcStr === "rosenbrock") {
        return rosenbrock;
    }
    else if (funcStr === "himmelblau") {
        return himmelblau;
    }
    else if (funcStr === "banana") {
        return banana;
    }
    else if (funcStr === "sinCosBowl") {
        return sinCosBowl;
    }   

    // Validate the function string for safety
    if (!isSafeMathInput(funcStr, dims)) {
        console.log("Unsafe math input detected:", funcStr);
        return null;
    }

    const expr = math.parse(funcStr);

    // Helper to compute derivatives
    const derive = (e, varName) => math.derivative(e, varName);
    if (dims === 2) {
        // For 2D: compute partial derivatives and Hessian matrix
        const dfdx = derive(expr, 'x'), dfdy = derive(expr, 'y');
        return {
            f: ([x, y]) => expr.evaluate({ x, y }), // Function value
            g: ([x, y]) => [dfdx.evaluate({ x, y }), dfdy.evaluate({ x, y })], // Gradient vector
            h: ([x, y]) => { // Hessian matrix
                const d2xx = derive(dfdx, 'x'), d2yy = derive(dfdy, 'y');
                const d2xy = derive(dfdx, 'y'), d2yx = derive(dfdy, 'x');
                return [
                    [d2xx.evaluate({ x, y }), d2xy.evaluate({ x, y })],
                    [d2yx.evaluate({ x, y }), d2yy.evaluate({ x, y })]
                ];
            }
        };
    } else {
        // For 1D: compute first and second derivatives
        const d1 = derive(expr, 'x'), d2 = derive(d1, 'x');
        return {
            f: x => expr.evaluate({ x }), // Function value
            g: x => d1.evaluate({ x }),  // First derivative
            h: x => d2.evaluate({ x })   // Second derivative
        };
    }
}
