'use strict';

export class CardsContainer {
    constructor(el, cats) {
        console.log(el)
        this.el = el;
        this.cats = cats;
    }

    getSize() {
        return this.el.querySelectorAll('.card').length;
    }

    createImgFromCat(cat) {
        const img = document.createElement('img');
        img.src = cat.url;
        return img;
    }

    createCard(cat) {
        const img = this.createImgFromCat(cat);

        const container = document.createElement('div');
        const details = document.createElement('div');

        const nameNode = document.createElement('h1');
        const ageNode = document.createElement('span');
        const colorNode = document.createElement('span');

        const {years, months} = cat.getAge();

        nameNode.innerText = cat.name;
        ageNode.innerText = `${years} godina i ${months} mjeseci`;
        colorNode.innerText = cat.color;

        container.classList.add('card');

        details.appendChild(nameNode);
        details.appendChild(ageNode);
        details.appendChild(colorNode);

        container.appendChild(img);
        container.appendChild(details);

        return container;
    }

    appendNext(num) {
        const start = this.getSize();
        const loaded = this.cats.getNext(start, num);
        const cardCats = loaded.map(c => this.createCard(c));

        cardCats.forEach(c => this.el.appendChild(c));
    }
}