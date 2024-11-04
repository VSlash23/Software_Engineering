const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Function for the prompt interface
function promptInterface() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askForFilePath() {
        rl.question('Enter file path (or "exit" to quit): ', async (filePath) => {
            if (filePath.toLowerCase() === 'exit') {
                console.log('Exiting program.');
                rl.close();
            } else {
                try {
                    const data = await readFile(filePath);
                    prettyPrintTable(data);
                } catch (error) {
                    console.error('Error reading file:', error.message);
                }
                askForFilePath(); // Prompt again after reading file
            }
        });
    }

    askForFilePath();
}

// Function to read the CSV file
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const ext = path.extname(filePath);
        if (ext !== '.csv') {
            return reject(new Error('The file must be a CSV.'));
        }

        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let data = [];
        rl.on('line', (line) => {
            const values = line.split(',');
            data.push(values);
        });

        rl.on('close', () => resolve(data));
        rl.on('error', (err) => reject(err));
    });
}

// Function for pretty printing the CSV data in a table
function prettyPrintTable(data) {
    if (data.length === 0) {
        console.log('No data to display.');
        return;
    }

    // Calculate column widths based on the maximum length of data in each column
    const columnWidths = data[0].map((_, colIndex) =>
        Math.max(...data.map(row => (row[colIndex] || '').length))
    );

    // Print each row, aligning columns based on the calculated widths
    data.forEach(row => {
        const formattedRow = row
            .map((cell, i) => cell.padEnd(columnWidths[i]))
            .join(' | ');
        console.log(formattedRow);
    });
    console.log('Finished reading the file.');
}

// Start the program
promptInterface();

exports.promptInterface = promptInterface;
exports.readFile = readFile;
exports.prettyPrintTable = prettyPrintTable;
