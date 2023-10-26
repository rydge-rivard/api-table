async function loadIntoTable(url, table) {
    const tableHead = table.querySelector('thead');
    const tableBody = table.querySelector('tbody');
    const response = await fetch(url);
    const dataObj = await response.json();
    const dataArray = []; 
    const dataArrayFlat = [];

    for(let i in dataObj) { 
        dataArray.push([i,dataObj[i]]); 
    }; 

    dataArrayFlat.push(dataArray.flat(2));
    console.log(dataArrayFlat);


    for (let i = 0; i < dataArrayFlat.length; i++) {
        for (let j = 0; j < dataArrayFlat[i].length; j++) {
            console.log(dataArrayFlat[i][j])
            const obj = dataArrayFlat[i][j];
            console.log(obj.id);
        }
    }


    // data.forEach(obj => {
    //     alert(obj);
    //     // const rowElement = document.createElement('tr');
    //     // const cellElement = document.createElement('td');
    //     // cellElement.textContent = obj;
    //     // rowElement.appendChild(cellElement);
    //     // tableBody.appendChild(rowElement);
    // });

};

const table = document.querySelector('table');

loadIntoTable('https://7my5x8tnra.execute-api.ca-central-1.amazonaws.com/stage/product-lot', table);