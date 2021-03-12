'use strict';

import {DOMFactory} from './DOMFactory.js';
import {Modal} from './modal.js';

export class CardsContainer {
    constructor(el, cats) {
        this.el = el;
        this.cats = cats;

        this.loadBy = 20;
        this.loadClicks = 0;

        const self = this;

        this.cats.observe(function (result, evt) {

            if (self.cats.isRemoveEvt(evt)) {
                self.remove(result);
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

    // createAdoptButton(cat) {
    //     const btn = document.createElement('a');
    //     const container = document.createElement('div');
    //
    //     container.classList.add('adopt-button-container');
    //     btn.innerText = 'Posvoji';
    //     btn.classList.add('btn');
    //     btn.setAttribute('data-id', cat.id);
    //
    //     const self = this;
    //     btn.onclick = () => self.modal.show(cat, () => self.cats.remove(cat.id));
    //
    //     container.appendChild(btn);
    //
    //     return container;
    // }

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

    getNextForP(start, end, sorted, p) {
        const pred = p || (_ => true);
        const filtered = sorted.filter(pred)
        const moreToLoad = filtered.length > (end - start);
        return [sorted.filter(pred).slice(start, end), moreToLoad];
    }

    clickAppend(num, orderby, p) {
        const start = this.getSize();
        const end = start + num;
        const [loaded, moreToLoad] = this.getNextForP(start, end, this.cats.sort(orderby), p);
        this.appendCats(loaded);

        // možda poslat obavijest o tome koliko mačića je dodano. Pa ako je 0 ispisat poruku o tome
        this.loadClicks += 1;

        return [loaded, moreToLoad];
    }

    refreshView(cats) {
        this.clear();
        this.appendCats(cats);
    }

    remove(cats) {

        for (let cat of cats) {
            const btn = this.el.querySelector(`[data-id="${cat.id}"]`);
            const card = btn.closest('.card');
            this.el.removeChild(card);
        }
    }

    clear() {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
    }

    sort(orderBy, filter) {

        const p = filter || (_ => true);

        const numLoaded = this.getLoadedNum();

        const sorted = this.cats.sort(orderBy);
        const [loaded, _] = this.getNextForP(0, numLoaded, sorted, p);

        this.refreshView(loaded)
    }

    filter(p, orderBy) {

        const numLoaded = this.getLoadedNum();

        const sorted = this.cats.sort(orderBy);
        const [cats, moreToLoad] = this.getNextForP(0, numLoaded, sorted, p);
        // const cats = this.cats.filter(p).slice(0, numLoaded); // assume we keep the number of loaded cats

        this.refreshView(cats);

        return moreToLoad;
    }
}