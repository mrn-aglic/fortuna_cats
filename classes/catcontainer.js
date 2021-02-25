'use strict';

export class Cats {
    constructor(cats) {
        this.cats = cats.sort((f, s) => f.compareAge(s));
    }

    sort(orderBy) {
        return [...this.cats].sort(orderBy);
    }

    filter(p) {
        return this.cats.filter(p);
    }

    getSize() {
        return this.cats.length;
    }

    getNext(from, end) {
        return this.cats.slice(from, end);
    }

    getNextForP(from, num, p) {
        return this.cats.filter(p).slice(from, from + num);
    }

    getYoungest(num = 4) {
        return this.getNext(0, num);
    }
}