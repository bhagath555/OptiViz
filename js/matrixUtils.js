/**
 * Inverts a 2x2 matrix.
 * Throws an error if the matrix is singular (determinant is zero).
 * @param {number[][]} m - 2x2 matrix [[a, b], [c, d]]
 * @returns {number[][]} Inverted 2x2 matrix
 */
export function invertMatrix2x2(m) {
    const [ [a, b], [c, d] ] = m;
    const det = a * d - b * c;
    if (det === 0) throw new Error("Matrix is singular and cannot be inverted.");
    return [ [ d/det, -b/det ], [ -c/det, a/det ] ];
}


/**
 * Generates an n x n identity matrix.
 * @param {number} n - Size of the matrix
 * @returns {number[][]} Identity matrix
 */
export function identityMatrix(n) {
    return Array.from({length: n}, (_, i) =>
        Array.from({length: n}, (_, j) => (i === j ? 1 : 0))
    );
}

/**
 * Multiplies a matrix by a vector.
 * @param {number[][]} matrix - m x n matrix
 * @param {number[]} vector - n-dimensional vector
 * @returns {number[]} Resulting m-dimensional vector
 */
export function multiplyMatrixVector(matrix, vector) {
    return matrix.map(row =>
        row.reduce((sum, val, j) => sum + val * vector[j], 0)
    );
}

/**
 * Adds two matrices element-wise.
 * Throws an error if dimensions do not match.
 * @param {number[][]} A - First matrix
 * @param {number[][]} B - Second matrix
 * @returns {number[][]} Sum of matrices
 */
export function matrixAdd(A, B) {
    if (A.length !== B.length) throw new Error("Matrices must have the same number of rows.");
    return A.map((row, i) => {
        if (row.length !== B[i].length)
            throw new Error(`Row ${i} of both matrices must have the same number of columns.`);
        return row.map((val, j) => val + B[i][j]);
    });
}
  
/**
 * Multiplies every element of a matrix by a scalar.
 * @param {number[][]} matrix - Input matrix
 * @param {number} scalar - Scalar value
 * @returns {number[][]} Scaled matrix
 */
export function matrixScale(matrix, scalar) {
    return matrix.map(row => row.map(val => val * scalar));
}

/**
 * Computes the Euclidean norm (length) of a vector.
 * @param {number[]} v - Input vector
 * @returns {number} Norm of the vector
 */
export function vectorNorm(v) {
    return Math.sqrt(vectorNormSquared(v));
}

/**
 * Computes the squared Euclidean norm of a vector.
 * @param {number[]} v - Input vector
 * @returns {number} Squared norm
 */
export function vectorNormSquared(v) {
    return v.reduce((sum, val) => sum + val * val, 0);
}

/**
 * Adds two vectors element-wise.
 * @param {number[]} v1 - First vector
 * @param {number[]} v2 - Second vector
 * @returns {number[]} Sum of vectors
 */
export function vectorAdd(v1, v2) {
    return v1.map((val, i) => val + v2[i]);
}

/**
 * Subtracts the second vector from the first, element-wise.
 * @param {number[]} v1 - First vector
 * @param {number[]} v2 - Second vector
 * @returns {number[]} Difference of vectors
 */
export function vectorSubtract(v1, v2) {
    return v1.map((val, i) => val - v2[i]);
}

/**
 * Multiplies every element of a vector by a scalar.
 * @param {number[]} v - Input vector
 * @param {number} scalar - Scalar value
 * @returns {number[]} Scaled vector
 */
export function vectorScale(v, scalar) {
    return v.map(val => val * scalar);
}

/**
 * Computes the dot product of two vectors.
 * @param {number[]} v1 - First vector
 * @param {number[]} v2 - Second vector
 * @returns {number} Dot product
 */
export function vectorDot(v1, v2) {
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
}
