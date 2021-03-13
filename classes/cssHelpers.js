'use strict';

export class CssHelpers {

    static hide(el) {
        el?.classList.add('d-none');
    }

    static show(el) {
        el?.classList.remove('d-none');
    }
}