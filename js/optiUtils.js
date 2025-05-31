import * as matrixUtils from './matrixUtils.js';

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
export function armijoLineSearch(f, dk, xk, beta = 0.5, sigma = 0.5) {
    let tk = 1;
    const fk = f(xk);

    const isVector = Array.isArray(xk);

    let gradDotDir, xNew, f_new, f_appr;

    // 2D case (vector input)
    if (isVector) {
        gradDotDir = matrixUtils.Vecdot(matrixUtils.Vecscale(dk, -1), dk);
        xNew = matrixUtils.Vecadd(xk, matrixUtils.Vecscale(dk, tk));
        f_new = f(xNew);
        f_appr = fk + sigma * tk * gradDotDir;

        while (f_new > f_appr) {
            tk *= beta;
            xNew = matrixUtils.Vecadd(xk, matrixUtils.Vecscale(dk, tk));
            f_new = f(xNew);
            f_appr = fk + sigma * tk * gradDotDir;
        }
    } 

    // 1D case (scalar input)
    else {
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
export function exactLineSearch(f, dk, xk, alphaLow = 0, alphaHigh = 2, tol = 1e-5, maxIter = 50) {

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
export function getStepLength(step_method, f, dk, xk, stepLength) {
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
export function computeBeta2D(method, gk, old_gk, dk_prev) {
    const yk = matrixUtils.vectorSubtract(gk, old_gk);
    switch (method) {
        case 'FR': return matrixUtils.vectorNormSquared(gk) / matrixUtils.vectorNormSquared(old_gk);
        case 'PR': return matrixUtils.vectorDot(gk, yk) / matrixUtils.vectorNormSquared(old_gk);
        case 'HS': return matrixUtils.vectorDot(gk, yk) / (-matrixUtils.vectorDot(dk_prev, yk));
        case 'DY': return matrixUtils.vectorNormSquared(gk) / (-matrixUtils.vectorDot(dk_prev, yk));
        default: return 0;
    }
}

export function computeBeta1D(method, g_new, g_old, d_old = null) {
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