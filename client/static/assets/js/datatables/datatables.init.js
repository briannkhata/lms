/*
Template Name: Tailwick - Admin & Dashboard Template
Author: Themesdesign
Version: 1.1.0
Website: https://themesdesign.in/
Contact: Themesdesign@gmail.com
File: Main Js File
*/

//row Borders example
new DataTable("#rowBorder");

//Alternative pagination
// new DataTable("#alternativePagination", {
//   pagingType: "full_numbers",
// });

//Hidden columns
// new DataTable("#hiddenColumns", {
//   columnDefs: [
//     {
//       target: 2,
//       visible: false,
//       searchable: false,
//     },
//     {
//       target: 3,
//       visible: false,
//     },
//   ],
// });

//Row selection and deletion (single row)

// const rowSelectionDeletion = new DataTable("#rowSelectionDeletion");

// rowSelectionDeletion.on("click", "tbody tr", (e) => {
//   let classList = e.currentTarget.classList;

//   if (classList.contains("selected")) {
//     classList.remove("selected");
//   } else {
//     rowSelectionDeletion
//       .rows(".selected")
//       .nodes()
//       .each((row) => row.classList.remove("selected"));
//     classList.add("selected");
//   }
// });

//Custom filtering - range search
// const minEl = document.querySelector("#min");
// const maxEl = document.querySelector("#max");

// // Custom range filtering function
// DataTable.ext.search.push(function (settings, data, dataIndex) {
//   //let min = parseInt(minEl.value, 10);
//   //let max = parseInt(maxEl.value, 10);
//   //let age = parseFloat(data[3]) || 0; // use data for the age column

//   if (
//     (isNaN(min) && isNaN(max)) ||
//     (isNaN(min) && age <= max) ||
//     (min <= age && isNaN(max)) ||
//     (min <= age && age <= max)
//   ) {
//     return true;
//   }

//   return false;
// });

// const customFiltering = new DataTable("#customFiltering");
