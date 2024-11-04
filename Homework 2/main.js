const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');

let spreadsheet = [];

// Set up a readline interface to get input from the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Available formulas for user reference
const availableFormulas = [
    "SUM",
    "AVERAGE",
    "MIN",
    "MAX",
    "COUNT"
];

// Function to ask which CSV file to use
function askCSVFile() {
    rl.question('Which CSV file would you like to use? (spreadsheet.csv, new_spreadsheet.csv, blank_spreadsheet.csv): ', (csvFile) => {
        // Load the selected CSV file
        loadCSVFile(csvFile.trim(), () => {
            askFormula();  // After loading the CSV, ask for a formula
        });
    });
}

// Function to ask if user wants to continue or change the CSV file
function askIfContinue() {
    rl.question('Would you like to input another formula? (Yes/No): ', (answer) => {
        if (answer.trim().toLowerCase() === 'yes') {
            askFormula();  // Ask for another formula
        } else {
            rl.question('Would you like to select another CSV file? (Yes/No): ', (answer) => {
                if (answer.trim().toLowerCase() === 'yes') {
                    askCSVFile();  // Ask for CSV file again
                } else {
                    console.log('Goodbye!');
                    rl.close();  // End the program
                }
            });
        }
    });
}

// Function to load a CSV file and process it
function loadCSVFile(csvFile, callback) {
    // Reset the spreadsheet array before loading new CSV
    spreadsheet = [];

    // Check if the file exists
    if (!fs.existsSync(csvFile)) {
        console.log(`Error: ${csvFile} not found!`);
        askCSVFile();
        return;
    }

    // Read and parse the CSV file
    fs.createReadStream(csvFile)
        .pipe(csv())
        .on('data', (row) => {
            // Add row to spreadsheet, handling missing cells
            spreadsheet.push(Object.values(row).map(val => val === '' ? null : val));
        })
        .on('end', () => {
            console.log(`CSV file (${csvFile}) successfully processed`);

            // List available formulas for the user to see
            console.log('\nAvailable formulas:');
            availableFormulas.forEach(formula => console.log(`- ${formula}`));

            // Execute callback after CSV is loaded
            callback();
        });
}

// Function to ask the user for a formula
function askFormula() {
    rl.question('\nEnter a spreadsheet formula (e.g. =SUM(A1:A6)): ', (inputFormula) => {
        let { calc, range } = parseFormula(inputFormula);
        if (!availableFormulas.includes(calc.toUpperCase())) {
            console.log(`Error: Unsupported formula "${calc}".`);
            askIfContinue();  // Ask if they want to continue after an error
            return;
        }
        let values = getRangeValues(range, spreadsheet);
        let result = calculateFormula(calc.toUpperCase(), values);

        console.log(`${inputFormula}: ${result}`);
        askIfContinue();  // After showing the result, ask if they want to continue
    });
}

/**
 * Parse a spreadsheet formula into a calculation type and cell range.
 * Example: "=SUM(A1:A6)" -> { calc: "SUM", range: "A1:A6" }
 */
function parseFormula(formula) {
    if (!formula.startsWith('=')) {
        throw new Error('Formula must start with "="');
    }

    let calc = formula.split('=')[1].split('(')[0]; 
    let range = formula.split('(')[1].split(')')[0];
    return { calc, range };
}

/**
 * Given a range like "A1:A6", extract the values from the spreadsheet.
 * Example: range = "A1:A6" -> [1, 2, 3, 4, 5, 6]
 */
function getRangeValues(range, spreadsheet) {
    let [start, end] = range.split(':');
    let startRow = parseInt(start.slice(1)) - 1;
    let endRow = parseInt(end.slice(1)) - 1;
    let startCol = start.charCodeAt(0) - 'A'.charCodeAt(0);
    let endCol = end.charCodeAt(0) - 'A'.charCodeAt(0);

    let values = [];

    // Iterate over the specified range, row by row or column by column
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            let cellValue = spreadsheet[row] && spreadsheet[row][col];
            // Push null values as null, but exclude undefined values
            if (cellValue === null) {
                values.push(null);
            } else if (cellValue !== undefined) {
                // Ensure valid numbers are pushed
                if (!isNaN(cellValue)) {
                    values.push(parseFloat(cellValue));
                } else {
                    values.push(null);
                }
            }
        }
    }
    
    return values;
}

/**
 * Perform the requested calculation on the list of values.
 * Supported calculations: SUM, AVERAGE, MIN, MAX, COUNT
 */
function calculateFormula(calc, values) {
    // Filter out null or undefined values
    values = values.filter(value => value !== null && value !== undefined);

    if (values.length === 0) {
        return 0;  // Handle empty ranges or all-blank ranges
    }
    
    switch(calc) {
        case 'SUM':
            return values.reduce((a, b) => a + b, 0);
        case 'AVERAGE':
            return values.reduce((a, b) => a + b, 0) / values.length;
        case 'MIN':
            return Math.min(...values);
        case 'MAX':
            return Math.max(...values);
        case 'COUNT':
            return values.length;
        default:
            throw new Error("Unsupported formula");
    }
}

// Export the functions for testing
module.exports = {
    calculateFormula,
    parseFormula,
    getRangeValues
};

// Start the program by asking for a CSV file
askCSVFile();
