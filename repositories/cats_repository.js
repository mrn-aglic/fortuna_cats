'use strict';

import {Cat} from '../classes/cat.js';

const url = 'https://api.thecatapi.com/v1/images/search';
const apikey = 'ade56f1e-bc79-4912-a4f7-2a60f553f7a4';

const catnames = ['Willow', 'Baby', 'Gracie', 'Mittens', 'Midnight', 'Oreo', 'Toby', 'Zoey', 'Chloe', 'Bubba', 'Garfield', 'Casper', 'Abby', 'Harley', 'Boo', 'Peanut', 'Callie', 'Simon', 'Tigger', 'Fluffy', 'Peanut', 'Oreo', 'Casper', 'Kiki', 'Lily', 'Jasmine', 'Sophie', 'Leo', 'Midnight', 'Chester', 'Felix', 'Misty', 'Miss kitty', 'Missy', 'Molly', 'Chester', 'Lucy', 'Felix', 'George', 'Nala', 'Jasper', 'Toby', 'Sammy', 'Callie', 'Maggie', 'Zoe', 'Mimi', 'Peanut', 'Tinkerbell', 'Bob', 'Bubba', 'Coco', 'Snowball', 'Sammy', 'Abby', 'Lola', 'Rocky', 'Oliver', 'Muffin', 'Pepper', 'Miss kitty', 'Luna', 'Willow', 'Smokey', 'Cookie', 'Patches', 'Lola', 'Misty', 'Peanut', 'Scooter', 'Bob', 'Boo', 'Trouble', 'Lucy', 'Angel', 'Callie', 'Midnight', 'Angel', 'Milo', 'Muffin', 'Lola', 'Ginger', 'Mimi', 'Gizmo', 'Lucky', 'Jasper', 'Sammy', 'Bear', 'Rascal', 'Jack'];
const colors = ['blue', 'yellow', 'green', 'red', 'black', 'white', 'spots'];

function choice(n, upper = colors.length) {
    const max = Math.floor(upper);
    const getidx = () => Math.floor(Math.random() * max)

    return [...Array(n).keys()].map(_ => colors[getidx()]);
}

function paramsToQueryString(params) {
    return Object.entries(params).map(p => `${p[0]}=${p[1]}`).join('&');
}

async function getCatsFromApi(num) {
    const qsurl = `${url}?${paramsToQueryString({limit: num})}`;
    const response = await fetch(qsurl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-api-key': apikey
        }
    });

    return await response.json();
}

async function loadFromLocal(num) {

    async function sendHttpRequest() {
        const Http = new XMLHttpRequest();
        const url = '/imgs';
        Http.open("GET", url);
        Http.send();

        if (Http.readyState === XMLHttpRequest.DONE) {
            return Http;
        }

        let res;
        const p = new Promise((r) => res = r);
        Http.onreadystatechange = () => {
            if (Http.readyState === XMLHttpRequest.DONE) {
                res(Http);
            }
        }
        return p;
    }

    const p = await sendHttpRequest(num);
    const text = p.responseText;
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const as = [...doc.getElementsByTagName('a')];
    return as.slice(0, num).map(a => {
        return {url: `imgs/${a.innerText}`}
    });
}

async function getCats(localimgs = false, num = 90) {

    const colors = choice(num);

    const result = localimgs ? await loadFromLocal(num) : await getCatsFromApi(num);

    return result.map((j, i) => new Cat(catnames[i], j.url, Math.floor(Math.random() * Math.floor(191)) + 2, colors[i]));
}

export default getCats;