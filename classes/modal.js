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
        document.body.classList.remove('modal-open');
    }

    createHeader() {
        const header = document.createElement('header');
        header.classList.add('modal-header');
        header.innerHTML =
            '<div class="modal-x-btn-container">' +
            '<a class="modal-x">x</a>' +
            '</div>' +
            '<h1>Posvoji mačku</h1>' ;
        const close = header.querySelector('.modal-x');
        close.onclick = () => this.hide();
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
        img.classList.add('full-width');
        img.src = obj == null ? '' : obj.url;

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
        footer.id = 'modal-footer';

        footer.innerHTML = '<div class="modal-footer-btns">' +
            '<div id="modal-ok" class="modal-footer-btn-container">' +
            '<a>Da</a>' +
            '</div>' +
            '<div id="modal-cancel" class="modal-footer-btn-container">' +
            '<a>Odustani</a>' +
            '</div>' +
            '</div>';
        const cancelBtn = footer.querySelector('#modal-cancel');

        cancelBtn.onclick = () => this.hide();
        return footer;
    }

    createTemplate() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.id = 'modal';

        const self = this;
        modal.addEventListener('click', function (e) {
            if(e.target === modal){
                self.hide();
            }
        });

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

        const btn = footer.querySelector('#modal-ok');
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
        document.body.classList.add('modal-open')
    }
}