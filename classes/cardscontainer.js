'use strict';

import {DOMFactory} from './DOMFactory.js';

class Modal {
    constructor() {
        this.modal = this.createTemplate();
        this.hide(this.modal);
        document.body.appendChild(this.modal);
    }

    hide() {
        this.modal.classList.remove('modal-show');
        this.modal.classList.add('modal-hide');
    }

    createHeader() {
        const header = document.createElement('header');
        header.classList.add('modal-header');

        const closeBtn = document.createElement('a');
        closeBtn.innerText = 'x';
        closeBtn.classList.add('modal-x');

        closeBtn.onclick = () => this.hide();

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('modal-x-btn-container');

        const title = document.createElement('h1');
        title.innerText = 'Posvoji mačku'

        btnContainer.appendChild(closeBtn);
        header.appendChild(btnContainer);
        header.appendChild(title);

        header.id = 'modal-header';

        return header;
    }

    createMainContent(obj) {

        function createDetailRow(text, prop) {

            const label = document.createElement('label');
            const span = document.createElement('span');

            label.innerText = text;
            span.innerText = obj == null || prop == null ? 'placeholder' : obj[prop];

            const row = document.createElement('div');
            row.classList.add('modal-detail-row');

            row.appendChild(label);
            row.appendChild(span);

            return row;
        }

        const details = document.createElement('div');
        details.classList.add('modal-details');

        const nameRow = createDetailRow('Ime:', 'name');
        const ageRow = createDetailRow('Dob:', 'age');

        const question = document.createElement('p');
        question.innerText = 'Jeste li sigurni da želite posvojiti mačića?'

        const img = document.createElement('img');
        img.src = obj == null ? '' : obj.url;
        img.style.width = '100%';

        details.appendChild(img);
        details.appendChild(nameRow);
        details.appendChild(ageRow);
        details.appendChild(question)

        const main = document.createElement('main');
        main.classList.add('modal-main');

        main.id = 'modal-main';
        main.appendChild(details);

        return main;
    }

    createFooter() {
        const footer = document.createElement('footer');
        footer.classList.add('modal-footer');

        const btnOkContainer = document.createElement('div');
        btnOkContainer.classList.add('modal-footer-btn-container');

        const btnCancelContainer = document.createElement('div');
        btnCancelContainer.classList.add('modal-footer-btn-container');

        const okBtn = document.createElement('a');
        okBtn.innerText = 'Da';
        const cancelBtn = document.createElement('a');
        cancelBtn.innerText = 'Odustani';

        btnOkContainer.appendChild(okBtn);
        btnCancelContainer.appendChild(cancelBtn);

        btnCancelContainer.onclick = () => this.hide();

        const btns = document.createElement('div');
        btns.classList.add('modal-footer-btns');

        btns.appendChild(btnOkContainer);
        btns.appendChild(btnCancelContainer);

        footer.appendChild(btns);
        footer.id = 'modal-footer';

        return footer;
    }

    createTemplate() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.id = 'modal';

        const container = document.createElement('div');
        container.classList.add('modal-container');

        const header = this.createHeader();
        const main = this.createMainContent();
        const footer = this.createFooter();

        const els = [header, main, footer];

        for (let el of els) {
            container.appendChild(el);
        }

        modal.appendChild(container);

        return modal;
    }

    show(obj, okCallback) {

        const footer = document.getElementById('modal-footer');
        const main = document.getElementById('modal-main');

        const newMain = this.createMainContent(obj);

        const btn = footer.querySelector('a');
        const self = this;

        btn.onclick = () => {
            okCallback();
            self.hide();
        };

        const modalContainer = this.modal.querySelector('.modal-container');

        modalContainer.removeChild(main);
        modalContainer.insertBefore(newMain, footer);

        this.modal.classList.remove('modal-hide');
        this.modal.classList.add('modal-show');
    }
}

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