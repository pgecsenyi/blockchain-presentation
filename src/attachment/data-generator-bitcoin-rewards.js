var currentQuantity = 0;
var startQuantity = 50;
var startYear = 2008;
var endYear = 2140;
var period = 4;

// Print labels.
process.stdout.write('labels: [');
for (let year = startYear; year < endYear; year += period) {
    process.stdout.write(year.toString());
    if (year < endYear - 4)
        process.stdout.write(', ');
}
process.stdout.write('];\n\n');

// Print mining rewards.
currentQuantity = startQuantity;
process.stdout.write('data: [')
for (let year = startYear; year < endYear; year += period) {
    process.stdout.write(currentQuantity.toString());
    currentQuantity = currentQuantity / 2;
    if (year < endYear - 4)
        process.stdout.write(', ');
}
process.stdout.write('];\n\n');

// Print bitcoin supply.
currentQuantity = startQuantity;
var currentSupply = 0;
var supplyFactor = period * (365 * 1440) / 10;
process.stdout.write('data: [')
for (let year = startYear; year < endYear; year += period) {
    process.stdout.write(currentSupply.toString());
    currentSupply = currentSupply + currentQuantity * supplyFactor;
    currentQuantity = currentQuantity / 2;
    if (year < endYear - 4)
        process.stdout.write(', ');
}
process.stdout.write('];');
