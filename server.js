const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");

let adatok = [];
fs.readFile("nevnap.csv", "utf-8", (error, data) => {
    if (error) console.log(error);
    else {
        let sorok = data.split("\r\n");
        for (let sor of sorok) {
            let s = sor.split(";");
            adatok.push({nev:s[0], datum:s[1]});
        }
        console.log(adatok.length);
    }
});

let server = http.createServer((request, response) => {
    let rUrl = url.parse(request.url, true);
    let pathname = rUrl.pathname;
    let query = rUrl.query;

    response.writeHead(200, "OK", {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*"
    });

    let urls = [
        "/nev/?kezd=Bal -> [ {név1, dátum1}, {név2, dátum2}, ... ]",
        "/nev/?nap=HHNN -> [ {név1, dátum1}, {név2, dátum2}, ... ]"
    ];
    let json = { Error : "Invalid Request", urls };

    if (pathname == "/nev" && query.kezd) json = nev(query);
    if (pathname == "/nev" && query.nap) json = nap(query);


    response.end(JSON.stringify(json));
});

server.listen(88);
console.log("Server started, port 88");

function nev(query) {
    let d = [];
    for (let adat of adatok) {
        if (adat.nev.includes(query.kezd)) {
            d.push(adat);
        }
    }
    if (d.length == 0) return {error : "Nincs név" };
    return d;
}

function nap(query) {
    let d = [];
    for (let adat of adatok) {
        if (adat.datum.includes(query.nap)) {
            d.push(adat);
        }
    }
    if (d.length == 0) return {error : "Nincs név" };
    return [ ...d ];
}