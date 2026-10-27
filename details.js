const params = new URLSearchParams(window.location.search);

let encodedName = params.get("name");
let decodedName = decodeURIComponent(encodedName);

let encodedFlag = params.get("flag");
let decodedFlag = decodeURIComponent(encodedFlag);

let encodedCapital = params.get("capital");
let decodedCapital = decodeURIComponent(encodedCapital);

let encodedPopulation = params.get("population");
let decodedPopulation = decodeURIComponent(encodedPopulation);

let encodedRegion = params.get("region");
let decodedRegion = decodeURIComponent(encodedRegion);

let encodedSubRegion = params.get("subregion");
let decodedSubRegion = decodeURIComponent(encodedSubRegion);

let encodedCurrencies = params.get("currencies");
let decodedCurrencies = decodeURIComponent(encodedCurrencies);

let encodedLanguages = params.get("languages");
let decodedLanguages = decodeURIComponent(encodedLanguages);

document.getElementById("country-name").textContent = decodedName;
document.getElementById("country-flag").src = decodedFlag;
document.getElementById("population").textContent = decodedPopulation;
document.getElementById("region").textContent = decodedRegion;
document.getElementById("sub-region").textContent = decodedSubRegion;
document.getElementById("capital").textContent = decodedCapital;
document.getElementById("currencies").textContent = decodedCurrencies;
document.getElementById("languages").textContent = decodedLanguages;

function backButtonHandler() {
    window.location.href = "index.html";
}



document.getElementById("go-back").addEventListener("click", backButtonHandler);