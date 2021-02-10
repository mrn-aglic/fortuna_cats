'use strict';

export class Cats {
    constructor(cats) {
        this.cats = cats;
    }

    getYoungest(num = 4) {
        return [...this.cats].sort((f, s) => f.compareAge(s)).slice(0, num);
    }
}