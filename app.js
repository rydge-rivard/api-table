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
  printRows(dataArrayFlat[0], tableBody);

  getSelectorOptions(".product_custom_code", productCustomCodeSelect);
  getSelectorOptions(".planned_plant_week", plantWeekSelect);
  getSelectorOptions(".location_name", locationSelect);
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
  filterSelectors(".location_name", locationSelect)
);

const plantWeekSelect = document.querySelector("#planned-plant-week");
plantWeekSelect.addEventListener("change", () =>
  filterSelectors(".planned_plant_week", plantWeekSelect)
);

const productCustomCodeSelect = document.querySelector("#product-custom-code");
productCustomCodeSelect.addEventListener("change", () =>
  filterSelectors(".product_custom_code", productCustomCodeSelect)
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

function getHeaders(obj, headers = [], parent = "") {
  for (const key in obj) {
    if (typeof obj[key] !== "object") {
      headers.push(`${parent}${key}`);
    } else {
      const parent = `${key}_`;
      getHeaders(obj[key], headers, parent);
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
    } else {
      getRows(obj[key], row);
    }
  }
  return row;
}

function printRows(data, tableBody) {
  for (let i = 1; i < data.length; i++) {
    const rowElement = document.createElement("tr");
    const row = getRows(data[i]);
    for (let i = 0; i < row.length; i++) {
      const cell = row[i];
      const cellElement = document.createElement("td");
      i === 13 ? cellElement.classList.add("location_name") : false;
      i === 3 ? cellElement.classList.add("product_custom_code") : false;
      i === 10 ? cellElement.classList.add("planned_plant_week") : false;
      cellElement.textContent = cell;
      rowElement.appendChild(cellElement);
      tableBody.appendChild(rowElement);
    }
  }
}
