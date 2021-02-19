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

        function createEl(text, cssClass, el, attrs) {
            const obj = document.createElement(el);
            obj.innerText = text;
            obj.classList.add(cssClass);

            for (let k in attrs) {
                obj.setAttribute(k, attrs[k]);
            }

            return obj;
        }

        function createDetailRow(dat) {
            const {text, data} = dat;

            const div = document.createElement('div');
            const label = createEl(text, 'label', 'label', {});
            const detail = createEl(data, 'detail', 'span', {});

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

    createAdoptButton() {
        const btn = document.createElement('a');
        const container = document.createElement('div');

        container.classList.add('adopt-button-container');
        btn.innerText = 'Posvoji';
        btn.classList.add('btn');

        container.appendChild(btn);

        return container;
    }

    createCard(cat) {
        const img = this.createImgFromCat(cat);

        const container = document.createElement('div');
        const details = this.createDetailsSection(cat);
        const button = this.createAdoptButton();

        container.classList.add('card');

        container.appendChild(img);
        container.appendChild(details);
        container.appendChild(button);

        return container;
    }

    appendNext(num) {
        const start = this.getSize();
        const end = start + num;
        const loaded = this.cats.getNext(start, end);
        const cardCats = loaded.map(c => this.createCard(c));

        cardCats.forEach(c => this.el.appendChild(c));
    }

    sort(orderBy) {
        const loaded = this.getSize();

        this.cats = [...cats].sort(orderBy);
    }
}