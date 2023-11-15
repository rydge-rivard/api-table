const table = document.querySelector("table");

loadIntoTable(
  "https://7my5x8tnra.execute-api.ca-central-1.amazonaws.com/stage/product-lot"
);

async function loadIntoTable(url) {
  const tableHead = document.querySelector("thead");
  const tableBody = document.querySelector("tbody");
  const response = await fetch(url);
  const dataObj = await response.json();
  const dataArray = [];
  const dataArrayFlat = [];

  for (let i in dataObj) {
    dataArray.push([i, dataObj[i]]);
  }

  dataArrayFlat.push(dataArray.flat(2));
  console.log(dataArrayFlat);
  console.log(dataArrayFlat[0][1]);
  const headers = getHeaders(dataArrayFlat[0][1]);
  printHeaders(headers, tableHead);
  console.log("top level const for print: " + headers);
  console.log(getRows(dataArrayFlat[0][1]));
  console.log(printRows(dataArrayFlat[0], tableBody));

  //   for (const key in dataArrayFlat[0][1]) {
  //     if (typeof dataArrayFlat[0][1][key] === "object") {
  //       for (const nestedKey in dataArrayFlat[0][1][key]) {
  //         if (typeof dataArrayFlat[0][1][key][nestedKey] === "object") {
  //           for (const doubleNestedKey in dataArrayFlat[0][1][key][nestedKey]) {
  //             const headerElement = document.createElement("th");
  //             headerElement.textContent = `${key}_${nestedKey}_${doubleNestedKey}`;
  //             tableHead.appendChild(headerElement);
  //           }
  //         }
  //         const headerElement = document.createElement("th");
  //         headerElement.textContent = `${key}_${nestedKey}`;
  //         tableHead.appendChild(headerElement);
  //       }
  //     } else {
  //       const headerElement = document.createElement("th");
  //       headerElement.textContent = [key];
  //       tableHead.appendChild(headerElement);
  //     }
  //   }

  //   for (let j = 1, i = 0; j < dataArrayFlat[i].length; j++) {
  //     const obj = dataArrayFlat[i][j];

  //     const rowElement = document.createElement("tr");
  //     for (const key in dataArrayFlat[i][j]) {
  //       if (typeof dataArrayFlat[i][j][key] === "object") {
  //         for (const nestedKey in dataArrayFlat[i][j][key]) {
  //           if (typeof dataArrayFlat[i][j][key][nestedKey] === "object") {
  //             for (const doubleNestedKey in dataArrayFlat[i][j][key][nestedKey]) {
  //               const objKeyPair =
  //                 dataArrayFlat[i][j][key][nestedKey][doubleNestedKey];
  //               const cellElement = document.createElement("td");
  //               cellElement.textContent = objKeyPair;
  //               rowElement.appendChild(cellElement);
  //             }
  //           }
  //           const objKeyPair = dataArrayFlat[i][j][key][nestedKey];
  //           const cellElement = document.createElement("td");
  //           cellElement.textContent = objKeyPair;
  //           rowElement.appendChild(cellElement);
  //           nestedKey === "name" && key === "location"
  //             ? cellElement.classList.add("location")
  //             : false;
  //           nestedKey === "custom_code" && key === "product"
  //             ? cellElement.classList.add("p-custom-code")
  //             : false;
  //         }
  //       } else {
  //         const objKeyPair = dataArrayFlat[i][j][key];
  //         const cellElement = document.createElement("td");
  //         key === "planned_plant_week"
  //           ? cellElement.classList.add("plant-week")
  //           : false;
  //         cellElement.textContent = objKeyPair;
  //         rowElement.appendChild(cellElement);
  //       }
  //       tableBody.appendChild(rowElement);
  //     }
  //   }
  getSelectorOptions(".p-custom-code", productCustomCodeSelect);
  getSelectorOptions(".plant-week", plantWeekSelect);
  getSelectorOptions(".location", locationSelect);
}

function getSelectorOptions(cssClass, selectElement) {
  const tr = table.querySelectorAll("tr");
  let optionsArray = [];
  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].querySelector(cssClass);
    optionsArray.push(td.textContent);
  }
  let uniqueArray = optionsArray.filter(
    (item, i, ar) => ar.indexOf(item) === i
  );
  uniqueArray.forEach((option) => createSelectOptions(selectElement, option));
}

function createSelectOptions(selectElement, option) {
  const optionElement = document.createElement("option");
  optionElement.textContent = option;
  selectElement.appendChild(optionElement);
}

const locationSelect = document.querySelector("#location");
locationSelect.addEventListener("change", () =>
  filterSelectors(".location", locationSelect)
);

const plantWeekSelect = document.querySelector("#planned-plant-week");
plantWeekSelect.addEventListener("change", () =>
  filterSelectors(".plant-week", plantWeekSelect)
);

const productCustomCodeSelect = document.querySelector("#product-custom-code");
productCustomCodeSelect.addEventListener("change", () =>
  filterSelectors(".p-custom-code", productCustomCodeSelect)
);

function filterSelectors(cssClass, selectElement) {
  const tr = table.querySelectorAll("tr");
  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].querySelector(cssClass);
    if (selectElement.value === "all") {
      tr[i].style.display = "";
      console.log(`All rows have been selected.`);
    } else if (td.textContent === selectElement.value) {
      tr[i].style.display = "";
      console.log(`Rows with ${td.textContent} have been selected.`);
    } else {
      tr[i].style.display = "none";
    }
  }
}

const btn = document.querySelector(".reset");
btn.addEventListener("click", resetFilters);

function resetFilters() {
  const tr = table.querySelectorAll("tr");
  for (let i = 0; i < tr.length; i++) {
    tr[i].style.display = "";
  }
  locationSelect.value = "all";
  productCustomCodeSelect.value = "all";
  plantWeekSelect.value = "all";
  console.log(`Filters have been reset.`);
}

function getHeaders(obj, headers = []) {
  for (const key in obj) {
    if (typeof obj[key] !== "object") {
      headers.push(key);
    }
  }
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      getHeaders(obj[key], headers);
    }
  }
  return headers;
}

function printHeaders(headers, tHead) {
  headers.forEach((th) => {
    const headerElement = document.createElement("th");
    headerElement.textContent = th;
    tHead.appendChild(headerElement);
  });
}

function getRows(obj, row = []) {
  for (const key in obj) {
    if (typeof obj[key] !== "object") {
      row.push(obj[key]);
    }
  }
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      getRows(obj[key], row);
    }
  }
  return row;
}

function printRows(data, tableBody) {
  for (let i = 1; i < data.length; i++) {
    const rowElement = document.createElement("tr");
    const row = getRows(data[i]);
    row.forEach((cell) => {
      const cellElement = document.createElement("td");
      cellElement.textContent = cell;
      rowElement.appendChild(cellElement);
      tableBody.appendChild(rowElement);
    });
  }
}
