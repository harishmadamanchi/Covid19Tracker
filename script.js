let covidJson;
const states = {
    "AN":"Andaman and Nicobar Islands",
    "AP":"Andhra Pradesh",
    "AR":"Arunachal Pradesh",
    "AS":"Assam",
    "BR":"Bihar",
    "CH":"Chandigarh",
    "CT":"Chhattisgarh",
    "DN":"Dadra and Nagar Haveli",
    "DL":"Delhi",
    "GA":"Goa",
    "GJ":"Gujarat",
    "HR":"Haryana",
    "HP":"Himachal Pradesh",
    "JK":"Jammu and Kashmir",
    "JH":"Jharkhand",
    "KA":"Karnataka",
    "KL":"Kerala",
    "LA":"Ladakh",
    "LD":"Lakshadweep",
    "MP":"Madhya Pradesh",
    "MH":"Maharashtra",
    "MN":"Manipur",
    "ML":"Meghalaya",
    "MZ":"Mizoram",
    "NL":"Nagaland",
    "OR":"Odisha",
    "PY":"Puducherry",
    "PB":"Punjab",
    "RJ":"Rajasthan",
    "SK":"Sikkim",
    "TN":"Tamil Nadu",
    "TG":"Telangana",
    "TR":"Tripura",
    "UP":"Uttar Pradesh",
    "UT":"Uttarakhand",
    "WB":"West Bengal"
}

const getCovidStats = async() => {
    const apiURI = 'https://api.covid19india.org/v4/min/data.min.json';
    let covidResponse = await fetch(apiURI);
    covidJson = await covidResponse.json();
    console.log(covidJson);
    console.log(covidJson['AP'].districts.Guntur.total.confirmed);
}



const loadStates = () => {
    let selectTag = document.getElementById('stateSelect');
    let optionTag1 = document.createElement('option');
    optionTag1.value = 'ALL';
    optionTag1.innerHTML = 'ALL India';
    selectTag.append(optionTag1);
    Object.keys(states).forEach(element => {
        let optionTag = document.createElement('option');
        optionTag.value = element;
        optionTag.innerHTML = states[element];
        selectTag.append(optionTag);
    });

}



let loadData = (stateCode) => {
    let infected = document.getElementById('infected');
    let death = document.getElementById('deaths');
    let recovered = document.getElementById('recovered');
    if(stateCode === 'ALL'){
        let totInfected = 0;
        let totDeath = 0;
        let totRecovered = 0;
        Object.keys(states).forEach(element => {
            totInfected = totInfected + covidJson[element].total.confirmed;
            totDeath = totDeath + covidJson[element].total.deceased;
            totRecovered = totRecovered + covidJson[element].total.recovered;
        })
        infected.setAttribute('data-target', totInfected);
        death.setAttribute('data-target', totDeath);
        recovered.setAttribute('data-target', totRecovered);
    }
    else {
        infected.setAttribute('data-target', covidJson[stateCode].total.confirmed);
        death.setAttribute('data-target', covidJson[stateCode].total.deceased);
        recovered.setAttribute('data-target', covidJson[stateCode].total.recovered);
    }
    infected.innerText = 0;
    death.innerText = 0;
    recovered.innerText = 0;

    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    console.log(counters);
    counters.forEach(element => {
        const updateValues = () => {
            const TargetValue = +element.getAttribute('data-target');
            const countValue = +element.innerText;
            const increment = Math.ceil(TargetValue / speed);

            if(countValue < TargetValue){
                element.innerText = countValue + increment;
                setTimeout(updateValues,10);
            }else {
                countValue.innerText = TargetValue;
            }
        }
        updateValues();
    })
    createTable(stateCode);
}

let selectedTag = document.getElementById('stateSelect');

selectedTag.addEventListener('change', async(event) => {
    try {
        await getCovidStats();
        loadData(event.target.value);
    } catch (error) {
        console.log(error);
    }
    
})


const createTable = (stateCode) => {
    if(document.getElementById('table').innerHTML !== ''){
        document.getElementById('table').innerHTML = '';
    }
    let table = document.createElement('table');
    table.setAttribute('class','table');
    let thead = document.createElement('thead');
    let theadRow = document.createElement('tr');
    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    let th4 = document.createElement('th');
    th2.innerHTML = 'Total Infected';
    th3.innerHTML = 'Total Deaths';
    th4.innerHTML = 'Total Recovered';
    theadRow.append(th1,th2,th3,th4);
    let tbody = document.createElement('tbody');
    if(stateCode === 'ALL') {
        th1.innerHTML = 'State';
        Object.keys(states).forEach(element => {
            let tbodyRow = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');
            td1.innerHTML = states[element];
            td2.innerHTML = covidJson[element].total.confirmed;
            td3.innerHTML = covidJson[element].total.deceased;
            td4.innerHTML = covidJson[element].total.recovered;
            tbodyRow.append(td1,td2,td3,td4);
            tbody.append(tbodyRow);
        })
    }else {
        th1.innerHTML = 'District';
        const districts = covidJson[stateCode].districts;
        const ArrayOfDistricts = Object.keys(districts);
        ArrayOfDistricts.forEach(element => {
            let tbodyRow = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');
            td1.innerHTML = element;
            td2.innerHTML = districts[element].total.confirmed;
            td3.innerHTML = districts[element].total.deceased;
            td4.innerHTML = districts[element].total.recovered;
            tbodyRow.append(td1,td2,td3,td4);
            tbody.append(tbodyRow);
        })
    }
    thead.append(theadRow);
    table.append(thead,tbody);
    document.getElementById('table').append(table);
}

const firstLoading = async() => {
    loadStates();
    await getCovidStats();
    loadData('ALL');
}

firstLoading();


