const https = require("https");
require('dotenv').config();
const API_KEY = process.env.API_KEY;
console.log("Key loaded:", !!API_KEY, "| length:", API_KEY && API_KEY.length);
const BASE_URL = "https://api.restcountries.com/countries/v5";
const PAGE_SIZE = 100;

let cachedCountries = null;

function nameOf(item) {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
        return item.name || item.english_name || item.english || item.common || "";
    }
    return "";
}

function toNameList(value) {
    if (!value) return [];
    const items = Array.isArray(value) ? value : Object.values(value);
    return items
        .map(function (item) { return { name: nameOf(item) }; })
        .filter(function (item) { return item.name !== ""; });
}

function toLegacyShape(c) {
    return {
        name: {
            common: c.names && c.names.common,
            official: c.names && c.names.official
        },
        capital: (c.capitals || []).map(nameOf),
        flags: {
            png: c.flag && c.flag.url_png,
            svg: c.flag && c.flag.url_svg
        },
        population: c.population || 0,
        region: c.region || "",
        subregion: c.subregion || "",
        currencies: toNameList(c.currencies),
        languages: toNameList(c.languages)
    };
}

function getPage(offset) {
    return new Promise(function (resolve, reject) {
        const url = BASE_URL + "?limit=" + PAGE_SIZE + "&offset=" + offset +
                    "&response_fields_omit=names.translations";

        const options = { headers: { Authorization: "Bearer " + API_KEY } };

        let req = https.get(url, options, function (res) {
            let data = "";

            res.on("data", function (chunk) {
                data += chunk;
            });

            res.on("end", function () {
                if (res.statusCode !== 200) {
                    return reject(new Error("API returned " + res.statusCode + ": " + data.substring(0, 200)));
                }
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on("error", function (error) {
            reject(error);
        });

        req.end();
    });
}

function fetchCountries() {
    return new Promise(function (resolve, reject) {
        if (cachedCountries) {
            return resolve(cachedCountries);
        }

        const all = [];

        function loadPage(offset) {
            getPage(offset)
                .then(function (body) {
                    if (!body.data || !Array.isArray(body.data.objects)) {
                        return reject(new Error("Unexpected response shape"));
                    }

                    body.data.objects.forEach(function (country) {
                        all.push(toLegacyShape(country));
                    });

                    if (body.data.meta && body.data.meta.more) {
                        loadPage(offset + PAGE_SIZE);
                    } else {
                        cachedCountries = all;
                        resolve(all);
                    }
                })
                .catch(reject);
        }

        loadPage(0);
    });
}

module.exports = fetchCountries;