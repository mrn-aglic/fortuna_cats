'use strict';

export class Cats {
    constructor(cats) {
        this.cats = cats.sort((f, s) => f.compareAge(s));

        this.observers = [];

        this.overrideFuncs();
    }

    isRemoveEvent(event) {
        return event === 'remove';
    }

    isSortEvent(event) {
        return event === 'sort';
    }

    observe(f) {
        this.observers.push(f);
    }

    overrideFuncs() {
        const self = this;
        this.cats.sort = function (orderBy) {

            let result = Array.prototype.sort.call(self.cats, orderBy);
            for (let obs of self.observers) {
                obs(result, 'sort');
            }

            return result;
        }

        this.cats.splice = function (idx, num) {
            const result = Array.prototype.splice.apply(self.cats, [idx, num]);
            for (let obs of self.observers) {
                obs(result, 'remove');
            }

            return result;
        }
    }

    sort(orderBy) {
        return this.cats.sort(orderBy);
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

    getNextForPredicate(from, num, p) {
        return this.cats.filter(p).slice(from, from + num);
    }

    getYoungest(num = 4) {
        return this.getNext(0, num);
    }

    remove(id) {
        const idx = this.cats.findIndex(c => c.id === id);
        this.cats.splice(idx, 1);
    }
}