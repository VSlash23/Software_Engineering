// Importing the functions from hw1.js for unit testing.
// This allows us to test the individual functions like promptInterface, readFile, and prettyPrintTable.
const { promptInterface, readFile, prettyPrintTable } = require('../hw1.js');

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

describe('CSV Reader', function () {

    // Test 1: It should handle non-CSV files
    it('should throw error for non-CSV file', function (done) {
        exec('node hw1.js', (error, stdout) => {
            expect(stdout).toContain('The file must be a CSV.');
            done();
        }).stdin.write('./test.txt\n');
    });

    // Test 2: It should print the pizza menu CSV file correctly
    it('should print pizza menu CSV file content correctly', function (done) {
        exec('node hw1.js', (error, stdout) => {
            expect(stdout).toContain('Pizza       | Toppings                    | Calories');
            expect(stdout).toContain('Pepperoni   | Mozzarella Cheese            | 300');
            expect(stdout).toContain('Veggie      | Mushrooms;Onions             | 250');
            expect(stdout).toContain('BBQ Chicken | Grilled Chicken;BBQ Sauce    | 450');
            done();
        }).stdin.write('./pizza_menu.csv\n');
    });

    // Test 3: It should print the book store CSV file correctly
    it('should print book store CSV file content correctly', function (done) {
        exec('node hw1.js', (error, stdout) => {
            expect(stdout).toContain('Title            | Author               | Price');
            expect(stdout).toContain('The Great Gatsby | F. Scott Fitzgerald  | 10.99');
            expect(stdout).toContain('War and Peace    | Leo Tolstoy          | 12.50');
            done();
        }).stdin.write('./book_store.csv\n');
    });

    // Test 4: It should handle an empty CSV file
    it('should handle empty CSV content gracefully', function (done) {
        const emptyCSV = '';
        fs.writeFileSync('./empty.csv', emptyCSV);

        exec('node hw1.js', (error, stdout) => {
            expect(stdout).toContain('No data to display.');
            done();
        }).stdin.write('./empty.csv\n');
    });

    // Test 5: It should print error when file is not found
    it('should print error for a non-existing file', function (done) {
        exec('node hw1.js', (error, stdout) => {
            expect(stdout).toContain('Error reading file: ENOENT');
            done();
        }).stdin.write('./non_existing_file.csv\n');
    });
});
