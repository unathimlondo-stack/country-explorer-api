const countryCardsContainer = document.getElementById(
    "country-cards-container"
);

const countryNameInput = document.getElementById("country-name");

const regionSelect = document.getElementById("region");

const populationInput = document.getElementById("population");

const showMoreButton = document.getElementById("show-more");

let displayCount = 12;

let countries = [];

let allCountries = [];

function fetchData() {

  return fetch("/countries")

     .then(function (response) {

      if (!response.ok) {

        throw new Error("HTTP error! Status:", response.status);

      }

      return response.json();

    })

     .catch(function (error) {

       console.error("Error fetching countries data");

       throw error; // Propagate the error further

    });

}

fetchData().then(function(data) {
        allCountries = data;
        countries = allCountries;
    populateCountryCards(data);

})
.catch(function (error) {
        countryCardsContainer.innerHTML =
            "<p>Failed to load countries. Please try again later.</p>";
    });

function getFormattedNames(items) {
    let formattedNames = "";
    
    for (let i = 0; i < items.length; i++) {

        formattedNames += items [i].name

        if( i < items.length - 1) {
            formattedNames += ", ";
        }
    }

    return formattedNames;
}

function getFormattedCurrencies(currencies) {
    if (!currencies) {
        return "";
    }

    const currencyCodes = Object.keys(currencies);
    let formattedCurrencies = "";

    for (let i = 0; i < currencyCodes.length; i++) {
        formattedCurrencies += currencies[currencyCodes[i]].name;

        if (i < currencyCodes.length - 1) {
            formattedCurrencies += ", ";
        }
    }

    return formattedCurrencies;
}

function getFormattedLanguages(languages) {
    if (!languages) {
        return "";
    }

    const keys = Object.keys(languages);
    let formattedLanguages = "";

    for (let i = 0; i < keys.length; i++) {
        const language = languages[keys[i]];
        formattedLanguages += typeof language === "string" ? language : language.name;

        if (i < keys.length - 1) {
            formattedLanguages += ", ";
        }
    }

    return formattedLanguages;
}

function countryCardHandler(country) {
    let queryString = "?name=" + encodeURIComponent(country.name.official) + 

    "&flag=" +
    encodeURIComponent(country.flags.svg) +

    "&population=" + country.population +

    "&region=" + country.region +

    "&subregion=" +
    encodeURIComponent(country.subregion) +

    "&capital=" +
    encodeURIComponent(country.capital) +

    "&currencies=" +
    encodeURIComponent(getFormattedCurrencies(country.currencies)
) +

    "&languages=" +
    encodeURIComponent(getFormattedLanguages(country.languages)
);
window.location = "details.html" + queryString;

}

document.addEventListener("DOMContentLoaded", function () {
    populateCountryCards();
});

function populateCountryCards() {


    countryCardsContainer.innerHTML = "";

    if (countries.length === 0) {

        countryCardsContainer.innerHTML =
            "<p>No country found matching the search criteria.</p>";

        return;
    }

    const loopCounter = Math.min(displayCount, countries.length);
    for (let i = 0; i < loopCounter; i++) {

        const country = countries[i];

        const card = document.createElement("div");
        card.classList.add("country-card");
        card.addEventListener("click", function() {
            countryCardHandler(country)})

        const flag = document.createElement("img");
        flag.src = country.flags.png;
        flag.alt = `Flag of ${country.name.common}`;

        const cardContent = document.createElement("div");
        cardContent.classList.add("country-card-content");

        const countryName = document.createElement("h2");
        countryName.innerHTML = country.name.common;

        const population = document.createElement("p");
        population.innerHTML =
            `<strong>Population:</strong> ${country.population.toLocaleString()}`;

        const capital = document.createElement("p");
        capital.innerHTML =
            `<strong>Capital:</strong> ${country.capital}`;

        const region = document.createElement("p");
        region.innerHTML =
            `<strong>Region:</strong> ${country.region}`;

        cardContent.appendChild(countryName);
        cardContent.appendChild(population);
        cardContent.appendChild(capital);
        cardContent.appendChild(region);

        card.appendChild(flag);
        card.appendChild(cardContent);

        countryCardsContainer.appendChild(card);
    }

    if (displayCount >= countries.length) {
        showMoreButton.style.display = "none";
    } else {
        showMoreButton.style.display = "block";
    }
}
showMoreButton.addEventListener("click", function () {

    displayCount += 10;

    populateCountryCards();

});

function filterData() {

    const inputValue = countryNameInput.value.trim();

    const selectedRegion = regionSelect.value;

    const populationValue = populationInput.value;

    const countryNameError = document.getElementById("country-name-error");

    const populationError = document.getElementById("population-error");

    let regex = new RegExp(/^[a-zA-Z -]*$/);

    if (!regex.test(inputValue)) {

        countryNameError.textContent =  "Enter valid Country Name.";
        return;
    }

    countryNameError.textContent = "";

    if (
        populationValue !== "" &&
        Number(populationValue) > 1500000000
    ) {

       populationError.textContent = "Country's population cannot be greater than 1.5 billion.";
        return;
    }

    populationError.textContent = "";

    countries = allCountries.filter(function(country) {

        const matchesName =
            country.name.official
                .toLowerCase()
                .includes(inputValue.toLowerCase());

        const matchesRegion =
            selectedRegion === "All Regions" ||
            country.region === selectedRegion;

        const matchesPopulation =
            populationValue === "" ||
            country.population >= Number(populationValue);

        return matchesName &&
               matchesRegion &&
               matchesPopulation;
    });


    displayCount = 12;

    populateCountryCards();
}
countryNameInput.addEventListener("input", filterData);

regionSelect.addEventListener("change", filterData);

populationInput.addEventListener("input", filterData);

document.addEventListener("DOMContentLoaded", function() {

    populateCountryCards();

});