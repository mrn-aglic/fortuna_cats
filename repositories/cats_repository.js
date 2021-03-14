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
    const response = await fetch('/imgs', {
        headers: {
            'method': 'GET',
            'Content-Type': 'img/jpg',
            'Accept': 'img/jpg'
        }
    });
    const responseText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, 'text/html');
    const files = [...doc.querySelectorAll('.file')];
    return files.slice(0, num).map(f => {
        return {url: f.href};
    });
}

function createCatInstance(index, url, num) {
    const colors = choice(num);

    const upperAgeLimit = 191;
    const lowerAgeLimit = 2;
    const randomAge = Math.floor(Math.random() * upperAgeLimit) + lowerAgeLimit;
    const color = colors[index];
    const name = catnames[index];
    return new Cat(index, name, url, randomAge, color);
}

async function getCats(localimgs = false, num = 90) {

    const result = localimgs ? await loadFromLocal(num) : await getCatsFromApi(num);
    return result.map((j, i) => createCatInstance(i, j.url, num));
}

export default getCats;