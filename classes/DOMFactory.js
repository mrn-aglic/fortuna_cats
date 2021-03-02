'use strict';

export class DOMFactory {

    static createAdoptButton(id, onclick) {
        const btn = document.createElement('a');
        const container = document.createElement('div');

        container.classList.add('adopt-button-container');
        btn.innerText = 'Posvoji';
        btn.classList.add('btn');
        btn.setAttribute('data-id', id)

        btn.onclick = onclick;

        container.appendChild(btn);

        return container;
    }
}