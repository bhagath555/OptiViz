

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