'use strict';

import {DOMFactory} from './DOMFactory.js';
import {Modal} from './modal.js';
import {CssHelpers} from './cssHelpers.js';

export class CardsContainer {
    constructor(el, cats) {
        this.el = el;
        this.cats = cats;

        this.loadBy = 20;
        this.loadClicks = 0;
        this.predicate = (_ => true);

        const self = this;

        this.cats.observe(function (state, event) {

            if (self.cats.isRemoveEvent(event)) {
                self.remove(state);
                self.fillGap(state);
            } else if (self.cats.isSortEvent(event)) {
                self.refreshView(state.predicate);
            } else if (self.cats.isFilterEvent(event)) {
                self.refreshView(state.predicate);
                self.manageLoadMoreBtn(state);
            } else if (self.cats.isLoadMoreEvent(event)) {
                self.clickAppend(self.loadBy, state.predicate);
                self.manageLoadMoreBtn(state);
            }
        })

        this.modal = new Modal();

        const loadBtn = document.querySelector('#btn-load > a');
        loadBtn.onclick = () => this.loadMore();
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
        const colorValueContainer = colorRow.lastChild;
        colorValueContainer.appendChild(colorBox);

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
        const button = DOMFactory.createAdoptButton(cat.id, () =>
            self.modal.show(cat, () => {
                self.cats.removeById(cat.id)
            }));

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

    getNextForPredicate(start, end, p) {
        const pred = p || (_ => true);
        this.predicate = pred; // store for fillGaps method
        return this.cats.getNextForPredicate(start, end, pred);
    }

    clickAppend(num, p) {
        const start = this.getSize();
        const loaded = this.getNextForPredicate(start, num, p);
        this.appendCats(loaded);

        this.loadClicks += 1;
    }

    refreshView(p) {
        this.clear();
        const numLoaded = this.getLoadedNum();
        const cats = this.getNextForPredicate(0, numLoaded, p);

        this.appendCats(cats);

        const cardsResult = document.getElementById('cards-result');

        if (this.getSize() === 0) {
            CssHelpers.show(cardsResult);
        } else {
            CssHelpers.hide(cardsResult);
        }
    }

    remove(state) {
        const cats = state.result;
        for (let cat of cats) {
            const btn = this.el.querySelector(`[data-id="${cat.id}"]`);
            const card = btn.closest('.card');
            this.el.removeChild(card);
        }
    }

    fillGap(state) {
        const num = state.result.length;
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

    loadMore() {
        this.cats.loadMore(this.getSize(), this.loadBy);
    }

    manageLoadMoreBtn(state) {
        const predicate = state.predicate;
        const moreToLoad = this.getSize() < state.allCats.filter(predicate).length;

        const loadBtn = document.getElementById('btn-load');
        if (moreToLoad) {
            CssHelpers.show(loadBtn);
        } else {
            CssHelpers.hide(loadBtn);
        }
    }
}