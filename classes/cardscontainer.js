'use strict';

import {DOMFactory} from './DOMFactory.js';
import {Modal} from './modal.js';

export class CardsContainer {
    constructor(el, cats) {
        this.el = el;
        this.cats = cats;

        this.loadBy = 20;
        this.loadClicks = 0;
        this.predicate = (_ => true);

        const self = this;

        this.cats.observe(function (result, event) {

            if (self.cats.isRemoveEvent(event)) {
                self.remove(result);
                self.fillGap(result.length);
            }
        })

        this.modal = new Modal();
    }

    getLoadedNum() {
        return this.loadClicks * this.loadBy;
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

        const ageRow = createDetailRow({
            text: 'Dob:',
            data: cat.getAgeText()
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

        const self = this;
        const button = DOMFactory.createAdoptButton(cat.id, () => self.modal.show(cat, () => self.cats.remove(cat.id)));

        container.classList.add('card');

        container.appendChild(img);
        container.appendChild(details);
        container.appendChild(button);

        return container;
    }

    appendCats(cats) {
        const cardCats = cats.map(c => this.createCard(c));
        cardCats.forEach(c => this.el.appendChild(c));
    }

    moreToLoad(p) {
        const predicate = p || (_ => true);
        return this.getSize() < this.cats.filter(predicate).length;
    }

    getNextForP(start, end, p) {
        const pred = p || (_ => true);
        this.predicate = pred; // store for fillGaps method
        return this.cats.getNextForP(start, end, pred);
    }

    clickAppend(num, p) {
        const start = this.getSize();
        const loaded = this.getNextForP(start, num, p);
        this.appendCats(loaded);

        // možda poslat obavijest o tome koliko mačića je dodano. Pa ako je 0 ispisat poruku o tome
        this.loadClicks += 1;

        return this.moreToLoad(p);
    }

    refreshView(p) {
        this.clear();
        const numLoaded = this.getLoadedNum();
        const cats = this.getNextForP(0, numLoaded, p);

        this.appendCats(cats);
    }

    remove(cats) {

        for (let cat of cats) {
            const btn = this.el.querySelector(`[data-id="${cat.id}"]`);
            const card = btn.closest('.card');
            this.el.removeChild(card);
        }
    }

    fillGap(num) {
        const currNum = this.getSize();
        const nextCats = this.cats.filter(this.predicate).slice(currNum, currNum + num);

        if (nextCats.length === 0) return;
        this.appendCats(nextCats);
    }

    clear() {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
    }
}