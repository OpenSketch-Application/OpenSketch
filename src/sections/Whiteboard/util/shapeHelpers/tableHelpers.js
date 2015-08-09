// // Table Interface
// //

// tbMatrix = [
//     [{
//         width: 200,
//         height: 100
//     }, {
//         width: 400,
//         height: 150
//     }],
//     [{
//         width: 350,
//         height: 450
//     }, {
//         width: 460,
//         height: 240
//     }],
//     [{
//         width: 230,
//         height: 140
//     }, {
//         width: 125,
//         height: 346
//     }]
// ];

// getWidestCellRow(cellRow);
// getHighestCellRow(cellRow);

// getWidestCellColumn(cells);
// getHighestCellColumn(cells);

// tbMatrix = [
//     [{
//         width: 200,
//         height: 100
//     }, {
//         width: 400,
//         height: 150
//     }],
//     [{
//         width: 350,
//         height: 450
//     }, {
//         width: 460,
//         height: 240
//     }],
//     [{
//         width: 230,
//         height: 140
//     }, {
//         width: 125,
//         height: 346
//     }]
// ];

// function TextBox() {
//     this.width = Math.floor(Math.random() * 100 + 20);
//     this.height = Math.floor(Math.random() * 100 + 40);
// }

// TextBox.prototype.stringify = function() {
//     return {
//         width: this.width,
//         height: this.height
//     }
// };

// function createTextMatrix(rows, cols) {
//     var matrix = [];
//     for(var r = 0; r < rows; r++) {
//         matrix[r] = [];
//         for(var c = 0; c < cols; c++) {
//             matrix[r][c] = new TextBox();
//         }
//     }

//     return matrix;
// }

// //var tbMatrix = createTextMatrix(24,8);

// function getWidestCellColumns(cells) {

//     var cellWidths = cells[0].map(function(column, index) {

//         return cells.reduce(function(prevCell, curRow) {
//             if(prevCell && prevCell[index]) prevCell = prevCell[index];
//             return curRow[index].width > prevCell.width
//                                        ? curRow[index]
//                                        : prevCell;
//         });
//     });

//     return cellWidths.sort(function(a,b) {
//         return a.width - b.width;
//     });
// }

// function getHighestCellRows(cells) {
//     return cells.map(function(row) {
//         return row.reduce(function(prev, curr) {
//             return prev.height > curr.height
//                                ? prev
//                                : curr;
//         })
//     }).sort(function(a,b) {
//         return a.height - b.height;
//     })
// }


// console.log(getWidestCellColumns(tbMatrix));

// console.log(getHighestCellRow(tbMatrix));

// function getWidestCellColumn(cells) {

// }

// getTableHeight() {

// }

// getTableWidth() {

// }
