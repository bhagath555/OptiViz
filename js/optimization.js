
function optimize1D(funcname, x0, descentFunc, stepFunc, tol, maxIter, extraParams) {
    const func = getfunction(funcname, 1);
    const f = func.f;
    const g = func.g;
    const h = func.h;
    let isConverged = false;
    let isDiverged = false;

    let xk = x0;
    let k = 0;
    let x_all = [], f_all = [], x_dot = [], f_dot = [];
    let gk, dk, f_old, x_old, yk;

    // For storing state between iterations (used in CG)
    let gk_old = null, dk_old = null;

    while (k < maxIter) {
        f_old = f(xk);
        x_old = xk;
        x_all.push(xk);
        f_all.push(f_old);

        gk = g(xk);
        dk = descentFunc(f, g, h, xk, gk, gk_old, dk_old, k, extraParams);

        let step_length = extraParams.step_length;
        if (stepFunc !== null) {
            step_length = stepFunc(f, dk, xk, step_length);
        }
        else { step_length = 1.0; }


        xk = xk + step_length * dk;
        yk = gk * (xk - x_old) + f_old;

        x_all.push(xk); f_all.push(yk);
        x_all.push(null); f_all.push(null);
        x_dot.push(xk); f_dot.push(yk);
        x_dot.push(xk); f_dot.push(f(xk));
        x_dot.push(null); f_dot.push(null);

        gk_old = gk;
        dk_old = dk;

        if (Math.abs(gk) < tol) {
            // If the gradient is small enough, we can stop
            isConverged = true;
            break;
        }

        // Divergence check
        if (!isFinite(f(xk)) || !isFinite(xk)) {
            isDiverged = true;
            break;
        }


        k++;
    }

    if ((f(xk) - f_old) > 0) {
        // If the function value increases significantly, we might be diverging
        isDiverged = true;
    }

    return [x_all, f_all, x_dot, f_dot, isConverged, isDiverged];
}

// Steepest descent 
// helper function
function descentSteepest1D(f, g, h, xk, gk, gk_old, dk_old, k, extra) {
    return -gk;
}
// Main algorithm
function steepestDescent1D(funcname, step_method, x0, step_length, tol, max_itr) {
    const extra = { step_length };
    return optimize1D(funcname, x0, descentSteepest1D, getStepLengthWrapper(step_method), tol, max_itr, extra);
}

// Conjugate gradient
// helper function
function descentCG1D(f, g, h, xk, gk, gk_old, dk_old, k, extra) {
    if (k === 0) return -gk;
    const beta = computeBeta1D(extra.beta_method, gk, gk_old, dk_old);
    return -gk + beta * dk_old;
}
// Main algorithm
function conjugateGradient1D(funcname, step_method, beta_method, x0, step_length, tol, max_itr) {
    const extra = { step_length, beta_method };
    return optimize1D(funcname, x0, descentCG1D, getStepLengthWrapper(step_method), tol, max_itr, extra);
}

// Newton method
// helper function
function descentNewton1D(f, g, h, xk, gk, gk_old, dk_old, k, extra) {
    const hk = h(xk);
    return -(1 / hk) * gk;
}
// Main algorithm
function newton1D(funcname, x0, tol, max_itr) {
    const extra = {};
    return optimize1D(funcname, x0, descentNewton1D, null, tol, max_itr, extra);
}

// LMM
// helper function
function descentLMM1D(f, g, h, xk, gk, gk_old, dk_old, k, extra) {
    const hk = h(xk);
    const mixhessian = extra.alpha + hk;
    return -(1 / mixhessian) * gk;
}
// Main algorithm
function lmm1D(funcname, step_method, x0, step_length, alpha, tol, max_itr) {
    const extra = { step_length, alpha };
    return optimize1D(funcname, x0, descentLMM1D, getStepLengthWrapper(step_method), tol, max_itr, extra);
}

function getStepLengthWrapper(step_method) {
    return function (f, dk, xk, step_length) {
        return getStepLength(step_method, f, dk, xk, step_length);
    };
}

//
//      Golden Cut method
//

function goldenCutMethod(funname, a0, c0, tol = 1e-3, max_itr = 100) {

    const f = getfunction(funname, 1).f;
    let a = a0;
    let c = c0;
    let fa = f(a);
    let fc = f(c);
    const a_all = [];
    const c_all = [];
    let k = 0;
    let isConverged = true;
    let isDiverged = false;
    const m = 0.382; // Golden ratio constant
    // if (fa === fc && a !== c) {
    //     const d = a + m * (c - a);
    //     a = d;
    //     a_all.push(a);
    //     c_all.push(c);
    // }

    // fa = f(a);
    // fc = f(c);
    while (Math.abs(c - a) > tol) {
        a_all.push(a);
        c_all.push(c);
        const d = a + m * (c - a);
        const b = a + (1 - m) * (c - a);
        const fd = f(d);
        const fb = f(b);
        if (fd <= fb) {
            c = b;
        } else {
            a = d;
        }
        fa = f(a);
        fc = f(c);
        k++;
        // Check for divergence
        if (!isFinite(fa) || !isFinite(fc)) {
            isDiverged = true;
            break;
        }
        //   if (Math.abs(fa - fc) < tol) break;
        if (k > max_itr) // Prevent infinite loop  
        {
            isConverged = false;
            break;
        }

    }


    return [a_all, c_all, k, isConverged, isDiverged];
}


//
//    
//                 2D Methods
//
// 
function optimize2D(funcname, x0, descentFunc, stepFunc, tol, maxIter = 100, extraParams = {}) {
    const { f, g, h } = getfunction(funcname, 2);

    let xk = x0.slice();
    let k = 0;
    let x_all = [], y_all = [], z_all = [];
    let x_proj = [], y_proj = [], z_proj = [];
    let gk, dk, f_old, x_old, y_old, gk_old = null, dk_old = null;
    let isConverged = false;
    let isDiverged = false;

    while (k < maxIter) {
        f_old = f(xk);
        [x_old, y_old] = xk;

        x_all.push(x_old);
        y_all.push(y_old);
        z_all.push(f_old);

        gk = g(xk);
        dk = descentFunc(f, g, h, xk, gk, gk_old, dk_old, k, extraParams);

        let step_length = extraParams.step_length;
        if (stepFunc !== null) {
            step_length = stepFunc(f, dk, xk, step_length);
        }
        else { step_length = 1.0; }

        xk = vectorAdd(xk, vectorScale(dk, step_length));

        const temp_z = f_old - vectorDot(dk, [xk[0] - x_old, xk[1] - y_old]);

        x_all.push(xk[0]);
        y_all.push(xk[1]);
        z_all.push(temp_z);

        x_all.push(null); y_all.push(null); z_all.push(null);
        x_proj.push(xk[0], xk[0], null);
        y_proj.push(xk[1], xk[1], null);
        z_proj.push(temp_z, f(xk), null);

        gk_old = gk;
        dk_old = dk;

        // Divergence check
        if (!isFinite(f(xk)) || !isFinite(xk[0]) || !isFinite(xk[1])) {
            isDiverged = true;
            break;
        }
        // Check for divergence
        if (vectorNorm(gk) < tol) {
            // If the gradient is small enough, we can stop
            isConverged = true;
            break;
        }
        k++;
    }

    if ((f(xk) - f_old) > 0) {
        // If the function value increases significantly, we might be diverging
        isDiverged = true;
    }

    return [x_all, y_all, z_all, x_proj, y_proj, z_proj, isConverged, isDiverged];
}

// Steepest Descent 2D
function descentSteepest2D(f, g, h, xk, gk) {
    return gk.map(v => -v);
}

function steepestDescent2D(funcname, step_method, x0, step_length = 0.1, tol, max_itr) {
    const extra = { step_length };
    return optimize2D(funcname, x0, descentSteepest2D, getStepLengthWrapper(step_method), tol, max_itr, extra);
}

// Conjugate Gradient 2D
function descentCG2D(f, g, h, xk, gk, gk_old, dk_old, k, extra) {
    if (k === 0 || !gk_old || !dk_old) return gk.map(v => -v);
    const beta = computeBeta2D(extra.beta_method, gk, gk_old, dk_old);
    return vectorAdd(vectorScale(gk, -1), vectorScale(dk_old, beta));
}

function conjugateGradient2D(funcname, step_method, beta_method, x0, step_length = 0.1, tol, max_itr) {
    const extra = { step_length, beta_method };
    return optimize2D(funcname, x0, descentCG2D, getStepLengthWrapper(step_method), tol, max_itr, extra);
}

// Newton 2D
function descentNewton2D(f, g, h, xk, gk) {
    const hk = h(xk);
    const invH = invertMatrix2x2(hk);
    return vectorScale(multiplyMatrixVector(invH, gk), -1);
}

function newton2D(funcname, x0, tol, max_itr) {
    const extra = {};
    return optimize2D(funcname, x0, descentNewton2D, null, tol, max_itr, extra);
}

// LMM 2D
function descentLMM2D(f, g, h, xk, gk, gk_old, dk_old, k, extra) {
    const hk = h(xk);
    const mixHessian = matrixAdd(hk, matrixScale(identityMatrix(2), extra.alpha));
    const mixHessianInv = invertMatrix2x2(mixHessian);
    return vectorScale(multiplyMatrixVector(mixHessianInv, gk), -1);
}

function lmm2D(funcname, step_method, x0, step_length = 0.1, alpha, tol, max_itr) {
    const extra = { step_length, alpha };
    return optimize2D(funcname, x0, descentLMM2D, getStepLengthWrapper(step_method), tol, max_itr, extra);
}

// Step length wrapper (same as 1D)
function getStepLengthWrapper(step_method) {
    return function (f, dk, xk, step_length) {
        return getStepLength(step_method, f, dk, xk, step_length);
    };
}



//
//    Powell
//
function goldenCut2DHelper(funcname, fixedIndex, fixedValue, tol, a0 = -5, c0 = 5) {
    const f = getfunction(funcname, 2).f;
    const m = 0.382; // Golden ratio constant
    let a = a0, c = c0;
    let fa = fixedIndex === 0 ? f([a, fixedValue]) : f([fixedValue, a]);
    let fc = fixedIndex === 0 ? f([c, fixedValue]) : f([fixedValue, c]);
    let b, d, fb, fd;

    // If fa == fc, consider the midpoint as optimal
    if (fa === fc) {
        d = a0;
    }
    while (Math.abs(fa - fc) > tol) {
        d = a + m * (c - a);
        b = a + (1 - m) * (c - a);
        fd = fixedIndex === 0 ? f([d, fixedValue]) : f([fixedValue, d]);
        fb = fixedIndex === 0 ? f([b, fixedValue]) : f([fixedValue, b]);
        if (fd < fb) c = b; else a = d;
        fa = fixedIndex === 0 ? f([a, fixedValue]) : f([fixedValue, a]);
        fc = fixedIndex === 0 ? f([c, fixedValue]) : f([fixedValue, c]);
    }

    return (c + d) / 2;
}

function powellMethod(funcname, x0, tol) {
    const f = getfunction(funcname, 2).f;
    let x = [...x0];
    let fk = 0;
    const path = [x0];
    let step = 0;
    let isConverged = false;
    let isDiverged = false;
    while (step < 100) {
        fk = f(x);
        // -----------------------First direction optimization------------------------------ 
        x[0] = goldenCut2DHelper(funcname, 0, x[1], tol);
        path.push([...x]);
        step++;
        // First direction optimization check
        fk_new = f(x);
        if (Math.abs(fk - fk_new) < tol) {
            isConverged = true;
            break;
        }

        // Divergence check
        if (!isFinite(fk_new) || !isFinite(x[0]) || !isFinite(x[1])) {
            isDiverged = true;
            break;
        }
        
        // -----------------------Second direction optimization------------------------------ 
        fk = fk_new;
        x[1] = goldenCut2DHelper(funcname, 1, x[0], tol);
        path.push([...x]);
        step++;
        fk_new = f(x);
        if (Math.abs(fk - fk_new) < tol) {
            isConverged = true;
            break;
        }

        // Divergence check
        if (!isFinite(fk_new) || !isFinite(x[0]) || !isFinite(x[1])) {
            isDiverged = true;
            break;
        }
    }
    return [path, isConverged, isDiverged];
}



//
//    NELDER MEAD METHOD
//

function vectorOp(centroid, worst, mu) {
    return [
        (1 + mu) * centroid[0] - mu * worst[0],
        (1 + mu) * centroid[1] - mu * worst[1]
    ];
}

function shrink(vertices) {
    const best = vertices[0];
    for (let i = 1; i < vertices.length; i++) {
        vertices[i][0] = best[0] - (vertices[i][0] - best[0]) / 2;
        vertices[i][1] = best[1] - (vertices[i][1] - best[1]) / 2;
    }
}

function stdDev(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length);
}

function nelderMead2D(funcname, initialVertices, tolerance = 1e-9, maxIter = 100) {
    const func = getfunction(funcname, 2).f; // Function to minimize

    let vertices = initialVertices.map(p => [...p]); // deep copy
    let n = 2; // 2D
    let m = 3; // 3 points (simplex)
    let fvals = vertices.map(p => func(p));

    // Sort vertices by function value
    const sortVertices = () => {
        const zipped = vertices.map((v, i) => ({ v, f: fvals[i] }));
        zipped.sort((a, b) => a.f - b.f);
        vertices = zipped.map(z => z.v);
        fvals = zipped.map(z => z.f);
    };

    iverts = vertices.map(p => [...p]); // deep copy for initial vertices
    sortVertices();
    const allVertices = [vertices.map(p => [...p])];


    console.log("initial sorted vertices", iverts);
    console.log("initial fvals", fvals);

    const mu_ic = -0.5, mu_oc = 0.5, mu_r = 1, mu_e = 2;

    let isConverged = false;

    let iter = 0;
    while (stdDev(fvals) > tolerance && iter < maxIter) {
        iter++;

        // Compute centroid of best and second best
        const x_bar = [
            (vertices[0][0] + vertices[1][0]) / 2,
            (vertices[0][1] + vertices[1][1]) / 2
        ];

        const reflect = vectorOp(x_bar, vertices[2], mu_r);
        const f_r = func(reflect);

        if (fvals[0] <= f_r && f_r < fvals[1]) {
            vertices[2] = reflect;

        } else if (f_r < fvals[0]) {
            const expand = vectorOp(x_bar, vertices[2], mu_e);
            const f_e = func(expand);
            vertices[2] = (f_e < f_r) ? expand : reflect;
        } else if (fvals[1] <= f_r && f_r < fvals[2]) {
            const contract = vectorOp(x_bar, vertices[2], mu_oc);
            const f_oc = func(contract);
            if (f_oc < f_r) {
                vertices[2] = contract;

            } else {
                shrink(vertices);

            }
        } else if (f_r >= fvals[2]) {
            const contract = vectorOp(x_bar, vertices[2], mu_ic);
            const f_ic = func(contract);
            if (f_ic < fvals[2]) {
                vertices[2] = contract;

            } else {
                shrink(vertices);
            }
        }

        fvals = vertices.map(p => func(p));
        sortVertices();
        allVertices.push(vertices.map(p => [...p]));
    }

    if (iter >= maxIter) {
        isConverged = false;
    } else {
        isConverged = true;
    }


    return [allVertices, isConverged];
}
