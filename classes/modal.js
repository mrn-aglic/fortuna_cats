'use strict';

export class Modal {
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

        function createDetailRow(text, f) {

            const label = document.createElement('label');
            const span = document.createElement('span');

            label.innerText = text;
            span.innerText = obj == null || f == null ? 'placeholder' : f(obj);

            const row = document.createElement('div');
            row.classList.add('modal-detail-row');

            row.appendChild(label);
            row.appendChild(span);

            return row;
        }

        const details = document.createElement('div');
        details.classList.add('modal-details');

        const nameRow = createDetailRow('Ime:', obj => obj.name);
        const ageRow = createDetailRow('Dob:', obj => obj.getAgeText());

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