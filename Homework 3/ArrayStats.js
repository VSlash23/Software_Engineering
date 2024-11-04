class ArrayStats extends Array {
    // Calculate and return the average of the array
    average() {
        const averageValue = this.reduce((a, b) => a + b, 0) / this.length;
        console.log("Average Value: ", averageValue); // Debugging log
        Object.defineProperty(this, "avgVal", {
            value: averageValue, // Add new property to the array
            writable: false // Set avgVal as immutable
        });
        return averageValue;
    }

    // Method to map the variance (replacing the closure)
    mapperVariance(currentVal) {
        if (typeof this.avgVal === 'undefined') {
            throw new Error("Average value is not defined.");
        }
        const variance = (currentVal - this.avgVal) * (currentVal - this.avgVal);
        console.log(`Variance for value ${currentVal}: ${variance}`); // Debugging log
        return variance;
    }

    // Calculate and return the standard deviation using .map() instead of .reduce()
    stdev() {
        if (this.length <= 1) {
            throw new Error("Standard deviation requires at least two data points.");
        }

        // Ensure avgVal is calculated before stdev
        if (typeof this.avgVal === 'undefined') {
            this.average(); // Calculate avgVal if not already calculated
        }

        const variances = this.map(this.mapperVariance, this); // Use .map to calculate the variance for each element
        const totalVariance = variances.reduce((acc, val) => acc + val, 0); // Calculate total variance
        const stdevValue = Math.sqrt(totalVariance / (this.length - 1)); // Calculate standard deviation

        console.log("Standard Deviation Value: ", stdevValue); // Debugging log
        Object.defineProperty(this, "sdevVal", {
            value: stdevValue, // Add new property to the array
            writable: false
        });
        return stdevValue;
    }
}

// Export the ArrayStats class so it can be used in the test file
module.exports = ArrayStats;
