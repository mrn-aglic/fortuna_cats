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

    createDetailsSection(cat) {

        function createColorBox(color) {
            const box = document.createElement('div');
            box.classList.add('color-box');
            box.style.backgroundColor = color;
            return box;
        }

        function createSpan(text, cssClass) {
            const span = document.createElement('span');
            span.innerText = text;
            span.classList.add(cssClass);
            return span;
        }

        function createDetailRow(dat) {
            const {text, data} = dat;

            const div = document.createElement('div');
            const label = createSpan(text, 'label');
            const detail = createSpan(data, 'detail');

            div.appendChild(label);
            div.appendChild(detail);

            div.classList.add('detail-row');

            return div;
        }

        const details = document.createElement('div');

        const monthsText = m => m === 1 ? 'mjesec' : m < 5 ? 'mjeseca' : 'mjeseci';

        const {years, months} = cat.getAge();
        const yearText = years > 0 ? `${years} godina` : '';
        const monthText = months > 0 ? `${months} ${monthsText(months)}` : '';
        const ageRow = createDetailRow({
            text: 'Dob:',
            data: [yearText, monthText].filter(t => t !== '').join(' i ')
        });

        const colorRow = createDetailRow({
            text: 'Boja:',
            data: cat.color
        })
        const colorBox = createColorBox(cat.color);
        colorRow.lastChild.appendChild(colorBox);

        const nameNode = document.createElement('h1');

        nameNode.classList.add('detail');
        nameNode.innerText = cat.name;

        details.appendChild(nameNode);
        details.appendChild(ageRow);
        details.appendChild(colorRow);

        details.classList.add('details-wrap');

        return details;
    }

    createCard(cat) {
        const img = this.createImgFromCat(cat);

        const container = document.createElement('div');
        const details = this.createDetailsSection(cat);

        container.classList.add('card');

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