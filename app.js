async function loadIntoTable(url, table) {
    const tableHead = document.querySelector('thead');
    const tableBody = document.querySelector('tbody');
    const response = await fetch(url);
    const dataObj = await response.json();
    const dataArray = []; 
    const dataArrayFlat = [];

    for(let i in dataObj) { 
        dataArray.push([i,dataObj[i]]); 
    }; 

    dataArrayFlat.push(dataArray.flat(2));
    console.log(dataArrayFlat);

    for (const key in dataArrayFlat[0][1]) {
        if (typeof dataArrayFlat[0][1][key] === 'object') {
            for (const nestedKey in dataArrayFlat[0][1][key]) {
                if (typeof dataArrayFlat[0][1][key][nestedKey] === 'object') {
                    for (const doubleNestedKey in dataArrayFlat[0][1][key][nestedKey]) {
                        const headerElement = document.createElement('th');
                        headerElement.textContent = `${key}_${nestedKey}_${doubleNestedKey}`;
                        tableHead.appendChild(headerElement);
                    }
                }
                const headerElement = document.createElement('th');
                headerElement.textContent = `${key}_${nestedKey}`;
                tableHead.appendChild(headerElement);
            }
        } else {
            const headerElement = document.createElement('th');
            headerElement.textContent = [key];
            tableHead.appendChild(headerElement);
        }
    }

    for (let j = 1, i = 0; j < dataArrayFlat[i].length; j++) {
        const obj = dataArrayFlat[i][j];

        const rowElement = document.createElement('tr');
        for (const key in dataArrayFlat[i][j]) {
            if (typeof dataArrayFlat[i][j][key] === 'object') {
                for (const nestedKey in dataArrayFlat[i][j][key]) {
                    if (typeof dataArrayFlat[i][j][key][nestedKey] === 'object') {
                        for (const doubleNestedKey in dataArrayFlat[i][j][key][nestedKey]) {
                            const objKeyPair = dataArrayFlat[i][j][key][nestedKey][doubleNestedKey];
                            const cellElement = document.createElement('td');
                            cellElement.textContent = objKeyPair;
                            rowElement.appendChild(cellElement);
                        }
                    }
                    const objKeyPair = dataArrayFlat[i][j][key][nestedKey];
                    const cellElement = document.createElement('td');
                    cellElement.textContent = objKeyPair;
                    rowElement.appendChild(cellElement);
                    nestedKey === 'name' && key === 'location' ? 
                    cellElement.classList.add('location') : false ;
                    nestedKey === 'custom_code' && key === 'product' ? 
                    cellElement.classList.add('p-custom-code') : false ;
                }
            } else {
                const objKeyPair = dataArrayFlat[i][j][key];
                const cellElement = document.createElement('td');
                key === 'planned_plant_week' ? cellElement.classList.add('plant-week') : false ;
                cellElement.textContent = objKeyPair;
                rowElement.appendChild(cellElement); 
            }
            tableBody.appendChild(rowElement);
        }
    }
    addPlantWeekOptions ();
    addPCustomCodeOptions ();
};

const table = document.querySelector('table');

loadIntoTable('https://7my5x8tnra.execute-api.ca-central-1.amazonaws.com/stage/product-lot', table);

const locationSelect = document.querySelector('#location');
locationSelect.addEventListener('change', () => filterOnLocation());

function filterOnLocation () {
    const tr = table.querySelectorAll('tr');
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].querySelector('.location');
        if (locationSelect.value === 'all') {
            tr[i].style.display = "";
            console.log(`All rows have been selected.`)
        } else if (td.textContent === locationSelect.value) {
            tr[i].style.display = "";
            console.log(`Rows with ${td.textContent} have been selected.`)
        } else {
            tr[i].style.display = "none";
        }
    }
};

//get array of possible values
//loop array and create options under select for each

const plantWeekOptions = [];
function addPlantWeekOptions () {
    const plantWeekSelect = document.querySelector('#planned-plant-week');
    const tr = table.querySelectorAll('tr');
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].querySelector('.plant-week');
        plantWeekOptions.push(td.textContent);
    }
    let uniquePlantWeekOptions = plantWeekOptions.filter((item, i, ar) => ar.indexOf(item) === i);
    uniquePlantWeekOptions.forEach(option => {
        createSelectOptions(plantWeekSelect, option);
    });
};

function createSelectOptions (selectElement, option) {
    const optionElement = document.createElement('option');
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
};

const plantWeekSelect = document.querySelector('#planned-plant-week');
plantWeekSelect.addEventListener('change', () => filterOnPlantWeek());

function filterOnPlantWeek () {
    const tr = table.querySelectorAll('tr');
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].querySelector('.plant-week');
        if (plantWeekSelect.value === 'all') {
            tr[i].style.display = "";
            console.log(`All rows have been selected.`)
        } else if (td.textContent === plantWeekSelect.value) {
            tr[i].style.display = "";
            console.log(`Rows with ${td.textContent} have been selected.`)
        } else {
            tr[i].style.display = "none";
        }
    }
};

const productCustomCodeSelect = document.querySelector('#product-custom-code');
productCustomCodeSelect.addEventListener('change', () => filterOnProductCustomCode());

const pCustomCodeOptions = [];
function addPCustomCodeOptions () {
    const productCustomCodeSelect = document.querySelector('#product-custom-code');
    const tr = table.querySelectorAll('tr');
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].querySelector('.p-custom-code');
        pCustomCodeOptions.push(td.textContent);
    }
    let uniquePCustomCodeOptions = pCustomCodeOptions.filter((item, i, ar) => ar.indexOf(item) === i);
    uniquePCustomCodeOptions.forEach(option => {
        createSelectOptions(productCustomCodeSelect, option);
    });
};

function filterOnProductCustomCode () {
    const tr = table.querySelectorAll('tr');
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].querySelector('.p-custom-code');
        if (productCustomCodeSelect.value === 'all') {
            tr[i].style.display = "";
            console.log(`All rows have been selected.`)
        } else if (td.textContent === productCustomCodeSelect.value) {
            tr[i].style.display = "";
            console.log(`Rows with ${td.textContent} have been selected.`)
        } else {
            tr[i].style.display = "none";
        }
    }
};