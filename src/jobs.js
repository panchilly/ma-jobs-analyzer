const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const path = require('path');
const appRoot = require('app-root-path');
const utils = require('./utils.js');

function loadMaPricesMap() {
    const pricesPath = path.resolve(appRoot.path, './data/ma_prices_2018.csv');
    const csvRaw = fs.readFileSync(pricesPath, 'utf8');
    const records = parse(csvRaw, {
        columns: true,
        skip_empty_lines: true
    });
    const r = new Map();
    records.forEach(rec => {
        const t = rec.town.toLowerCase().trim();
        r.set(t, rec);
    });
    return r;
}

function buildTownGeoMap() {
    const r = new Map();
    const townsPath = path.resolve(appRoot.path, './data/gbtowns.csv');
    const townsCsvRaw = fs.readFileSync(townsPath, 'utf8');
    const geoRecords = parse(townsCsvRaw, {
        columns: true,
        skip_empty_lines: true
    }).filter(tr => tr.primary === "1");
    geoRecords.forEach(gr => {
        r.set(gr.geoId, gr);
    });
    return r;
}

function toH1bKey(state, town) {
    return `${state.toUpperCase()}_${town.toLowerCase()}`;
}

function buildH1bMap() {
    const r = new Map();
    const h1bpath = path.resolve(appRoot.path, './data/h1b_2018_ma_ri_nh.csv');
    const raw = fs.readFileSync(h1bpath, 'utf8');
    const records = parse(raw, {
        columns: true,
        skip_empty_lines: true
    });
    records.forEach(rec => {
        var a = true;
        const workTown = rec.WORKSITE_CITY.toLowerCase().trim();
        const workState = rec.WORKSITE_STATE.toLowerCase().trim();

        var wsCount = parseInt(rec.TOTAL_WORKERS);
        wsCount = 1;

        const key = toH1bKey(workState, workTown);
        if (!r.has(key)) {
            r.set(key, {
                totalSalary: 0,
                jobCount: 0,
                jobsWithSalary: 0
            });
        }

        const obj = r.get(key);
        obj.jobCount += wsCount;
    });
    return r;
}

function printH1bMap(h1bMap) {
    var h = Array.from(h1bMap.keys());
    h = h.sort((a,b) => {
        return h1bMap.get(b).jobCount - h1bMap.get(a).jobCount;
    });
    var sum = 0;
    h.forEach(r => {
        const numJobs = h1bMap.get(r).jobCount;
        console.log(`${r} ${numJobs}`);
        sum+=numJobs;
    });
    console.log('total: ' + sum);
}

const h1bMap = buildH1bMap();
printH1bMap(h1bMap);

const geoIdToLoc = buildTownGeoMap();

const geoIdToJobCount = new Map();
geoIdToLoc.forEach((loc, geoId) => {
    const h1bKey = toH1bKey(loc.state, loc.town);
    const h1brec = h1bMap.get(h1bKey);
    if (!h1brec) {
        console.log('no rec for: ' + h1bKey);
        return;
    }
    geoIdToJobCount.set(geoId, h1brec.jobCount);
    console.log(`${h1bKey} ${h1brec.jobCount}`);
});


// get average coordinates
let sLat = 0;
let sLong = 0;
let totalJobs = 0;
geoIdToJobCount.forEach((numJobs, geoId) => {
    const loc = geoIdToLoc.get(geoId);
    if (numJobs) {
        totalJobs += numJobs;
        sLat += (numJobs * loc.lat);
        sLong += (numJobs * loc.lng);
    }
});
sLat = sLat / totalJobs;
sLong = sLong / totalJobs;
console.log('total jobs in DB: ' + totalJobs);
console.log(`average coordinates: ${sLat} ${sLong}`);


function distanceToScore(distance) {
    const fullValueDistance = 15;
    const reductionPerMile = .06;
    if (distance <= fullValueDistance) {
        return 1.0;
    }
    var reduction = (distance - fullValueDistance) * reductionPerMile;
    if (reduction >= 1) {
        return 0;
    }
    return 1.0 - reduction;
}

function computeTownScore(rec, geoMap, geoToJobScore) {
    let sum = 0;
    geoToJobScore.forEach((jobScore, geoId) => {
        if (geoId === rec.geoId) {
            sum += jobScore;
        } else {
            const a = geoMap.get(rec.geoId);
            const b = geoMap.get(geoId);
            const distance = utils.latLongDistance(a.lat, a.lng, b.lat, b.lng, 'n');
            sum += distanceToScore(distance) * jobScore;
        }
    });
    return sum;
}

function removeCommas(str) {
    return (str.replace(/,/g, ''));
}

var maTownNameToPriceData = loadMaPricesMap();
const data = [];
geoIdToLoc.forEach(rec => {
    const score = computeTownScore(rec, geoIdToLoc, geoIdToJobCount);
    rec.score = score;
    // link price data if available
    const townName = rec.town.toLowerCase();
    if (rec.state === 'MA' && maTownNameToPriceData.has(townName)) {
        const priceData = maTownNameToPriceData.get(townName);
        const price2018 = parseInt(removeCommas(priceData.median2018));
        rec.scorePerDollar = score / price2018;
    } else {
        rec.scorePerDollar = 0;
    }
    data.push(rec);
});

data.sort((a, b) => {
    return b.score - a.score;
});

var rank = 1;
var max = data[0].score;
data.forEach(d => {
    console.log(`#${rank} ${d.score / max} ${d.state},${d.town} ${d.score} ${d.scorePerDollar}`);
    rank++;
});
