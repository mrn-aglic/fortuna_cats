'use strict';

export class Cats {
    constructor(cats) {
        this.cats = cats.sort((f, s) => f.compareAge(s));
    }

    getSize() {
        return this.cats.length;
    }

    getNext(from = 0, num = 20) {
        return [...this.cats].slice(from, num);
    }

    getYoungest(num = 4) {
        return this.getNext(0, num);
    }
}