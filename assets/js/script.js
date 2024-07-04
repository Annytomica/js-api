const API_KEY = 'KpdYW2tSG-oEt0dtgJBX7cA7q04';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));

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