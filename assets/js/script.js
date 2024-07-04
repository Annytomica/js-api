const API_KEY = 'KpdYW2tSG-oEt0dtgJBX7cA7q04';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

// function to convert options (eg. ES6, ES8) into a comma seperated list as required by API
function processOptions(form) {

    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === 'options') {   //so only create list with options not other entries in object
            optArray.push(entry[1]); //just add the value of entry to list array
        }
    }
    form.delete('options'); // deletes all the entries in data object with key of 'options'

    form.append('options', optArray.join()); //adds back the new array, but as comma seperated list using .join

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
        })
    
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`; //.names are coming from the FormData object

    if (data.total_errors === 0) {
        results = `<div class='no_errors'>No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class='error_count'>${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class='line'>${error.line}</span>, `;
            results += `column <span class='column'>${error.col}</span></div>`;
            results += `<div class='error'>${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString); //using await as is returning a promise

    const data = await response.json(); //using await as is returning a promise

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {

    let heading = 'API Key Status';
    let results = `<div>Your key is valid until</div>`;
    results += `<div class='key-status'>${data.expiry}</div>`;

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

