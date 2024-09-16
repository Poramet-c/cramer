function createTable(n) {
    let tableDiv = document.getElementById('input-table');
    let vectorDiv = document.getElementById('input-vector');
    
    // Clear previous content
    tableDiv.innerHTML = '';
    vectorDiv.innerHTML = '';

    // Create the square matrix table
    let table = document.createElement('table');
    for (let i = 0; i < n; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < n; j++) {
            let cell = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'text';
            input.id = `input-${i}-${j}`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    tableDiv.appendChild(table);

    // Create the column vector table
    let vectorTable = document.createElement('table');
    for (let i = 0; i < n; i++) {
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        let input = document.createElement('input');
        input.type = 'text';
        input.id = `vector-${i}`;
        input.style.width = '100px'; // Adjust width as needed
        cell.appendChild(input);
        row.appendChild(cell);
        vectorTable.appendChild(row);
    }
    vectorDiv.appendChild(vectorTable);

    // Show the submit button
    document.getElementById('submit-data').style.display = 'inline';
}

document.getElementById('submit-data').addEventListener('click', function() {
    let n = document.getElementById('n-value').value;
    let data = [];
    let vector = [] ;
    
    // Show the spinner and loading text
    document.getElementById('spinner').style.display = 'inline-block';
    document.getElementById('loading-text').style.display = 'block';
    document.getElementById('result-text').style.display = 'none'; // Hide result text initially

    // Collect the data from the table
    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            let value = document.getElementById(`input-${i}-${j}`).value;

            if (value === '') value = '0'; // Default value if empty
            
            row.push(Number(value)); // Convert to number
        }
        data.push(row);
    }

    // Collect the vector from the vector table
    for (let i = 0; i < n; i++) {
        let value = document.getElementById(`vector-${i}`).value;
        if (value === '') value = '0'; // Default value if empty
        vector.push(Number(value));
    }
    
    setTimeout(function() {
        // Calculate the determinant
        let det = determinant(data);
        console.log("2D Array:", data);
        console.log("Determinant:", det);

        // Hide the spinner and loading text
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('loading-text').style.display = 'none';
        
        // Show the result
        document.getElementById('result-text').style.display = 'block';
        document.getElementById('result-value').textContent = det.toFixed(3);
    }, 100); // Small timeout to allow the spinner to appear

    displayAdjoint(data);
    displayInverse(data);
    displayMatrixVectorResult(inverse(data),vector)
});

document.getElementById('n-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let n = document.getElementById('n-value').value;
    createTable(n);
});

function determinant(matrix) {
    const n = matrix.length;

    // Base case for 2x2 matrix
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;
    
    // Loop through the first row to expand by minors
    for (let j = 0; j < n; j++) {
        const subMatrix = getSubMatrix(matrix, 0, j);
        det += matrix[0][j] * Math.pow(-1, j) * determinant(subMatrix);
    }

    return det;
}

// Helper function to get the submatrix by excluding a specific row and column
function getSubMatrix(matrix, rowToRemove, colToRemove) {
    const subMatrix = matrix
        .filter((_, rowIndex) => rowIndex !== rowToRemove) // Exclude the specific row
        .map(row => row.filter((_, colIndex) => colIndex !== colToRemove)); // Exclude the specific column
    return subMatrix;
}

// Function to compute the adjoint matrix
function adjoint(matrix) {
    const n = matrix.length;
    const adj = [];

    for (let i = 0; i < n; i++) {
        adj[i] = [];
        for (let j = 0; j < n; j++) {
            const subMatrix = getSubMatrix(matrix, i, j);
            adj[i][j] = Math.pow(-1, i + j) * determinant(subMatrix);
        }
    }

    return transpose(adj);
}

// Function to transpose a matrix
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Function to display the adjoint matrix in HTML
function displayAdjoint(matrix) {
    const adjMatrix = adjoint(matrix);
    const adjointDiv = document.getElementById('adjoint-matrix');
    adjointDiv.innerHTML = ''; // Clear previous content

    let table = document.createElement('table');
    for (let i = 0; i < adjMatrix.length; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < adjMatrix[i].length; j++) {
            let cell = document.createElement('td');
            cell.textContent = adjMatrix[i][j].toFixed(2);
            cell.style.padding = '5px';
            cell.style.border = '1px solid #ddd';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    adjointDiv.appendChild(table);

    // Show the adjoint matrix container
    document.getElementById('adjoint-text').style.display = 'block';
    document.getElementById('adjoint-matrix').style.display = 'block';
}

// Function to compute the inverse matrix
function inverse(matrix) {
    const det = determinant(matrix);
    if (det === 0) {
        console.error("Matrix is singular and cannot be inverted.");
        return null;
    }
    const adjMatrix = adjoint(matrix);
    return adjMatrix.map(row => row.map(value => value / det));
}

// Function to display the inverse matrix in HTML
// Function to display the inverse matrix in HTML
function displayInverse(matrix) {
    const invMatrix = inverse(matrix);
    const inverseDiv = document.getElementById('inverse-matrix');
    const inverseText = document.getElementById('inverse-text');
    const singularText = document.getElementById('singular-text');

    if (invMatrix === null) {
        // Hide inverse matrix and show singular message
        inverseDiv.style.display = 'none';
        inverseText.style.display = 'none';
        singularText.style.display = 'block'; // Show the singular matrix message
        return;
    }

    inverseDiv.innerHTML = ''; // Clear previous content

    let table = document.createElement('table');
    for (let i = 0; i < invMatrix.length; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < invMatrix[i].length; j++) {
            let cell = document.createElement('td');
            cell.textContent = invMatrix[i][j].toFixed(2); // Display with 2 decimal places
            cell.style.padding = '5px';
            cell.style.border = '1px solid #ddd';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    inverseDiv.appendChild(table);

    // Show the inverse matrix container
    inverseText.style.display = 'block';
    inverseDiv.style.display = 'block';
    singularText.style.display = 'none'; // Hide the singular matrix message
}

// Function to multiply an n x n matrix with an n x 1 column vector
function multiplyMatrixVector(matrix, vector) {
    const n = matrix.length;
    let result = [];

    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result.push(sum);
    }

    return result;
}

// Function to display the result matrix (n x 1) in HTML
function displayMatrixVectorResult(matrix, vector) {
    const result = multiplyMatrixVector(matrix, vector);
    const resultDiv = document.getElementById('result-vector');

    // Clear previous content
    resultDiv.innerHTML = '';

    let table = document.createElement('table');
    for (let i = 0; i < result.length; i++) {
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.textContent = result[i].toFixed(2); // Display with 2 decimal places
        cell.style.padding = '5px';
        cell.style.border = '1px solid #ddd';
        row.appendChild(cell);
        table.appendChild(row);
    }
    resultDiv.appendChild(table);

    // Show the result matrix container
    document.getElementById('result-vector-text').style.display = 'block';
    resultDiv.style.display = 'block';
}