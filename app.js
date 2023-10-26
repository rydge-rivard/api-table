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
                const headerElement = document.createElement('th');
                headerElement.textContent = [nestedKey];
                tableHead.appendChild(headerElement);
            }
        } else {
            const objKeyPair = dataArrayFlat[0][1][key];
            const headerElement = document.createElement('th');
            headerElement.textContent = [key];
            tableHead.appendChild(headerElement);
        }
    }

    for (let j = 1, i = 0; j < dataArrayFlat[i].length; j++) {
        const obj = dataArrayFlat[i][j];

        const rowElement = document.createElement('tr');
        for (const key in dataArrayFlat[i][j]) {
            if (Object.hasOwnProperty.call(dataArrayFlat[i][j], key)) {
                const objKeyPair = dataArrayFlat[i][j][key];
                const cellElement = document.createElement('td');
                cellElement.textContent = objKeyPair;
                rowElement.appendChild(cellElement); 
            }
            tableBody.appendChild(rowElement);
        }
    }
};

const table = document.querySelector('table');

loadIntoTable('https://7my5x8tnra.execute-api.ca-central-1.amazonaws.com/stage/product-lot', table);