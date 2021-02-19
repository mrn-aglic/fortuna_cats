'use strict';

export class Cats {
    constructor(cats) {
        this.cats = cats.sort((f, s) => f.compareAge(s));
    }

    getSize() {
        return this.cats.length;
    }

    getNext(from, end) {
        return [...this.cats].slice(from, end);
    }

    getYoungest(num = 4) {
        return this.getNext(0, num);
    }
}