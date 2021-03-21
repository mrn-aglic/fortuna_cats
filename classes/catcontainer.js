'use strict';

export class Cats {
    constructor(cats) {
        const myCats = cats.sort((f, s) => f.compareAge(s));

        const predicate = (_ => true);
        this.state = {
            result: myCats,
            allCats: myCats,
            predicate: predicate
        };

        this.events = {
            sort: 'sort',
            filter: 'filter',
            remove: 'remove',
            loadMore: 'loadMore'
        };

        this.observers = [];
    }

    updateState(updateObj) {
        this.state = {
            ...this.state
        };

        for (let key of Object.keys(updateObj)) {
            this.state[key] = updateObj[key];
        }
    }

    notifyObservers(event) {
        for (let obs of this.observers) {
            obs(this.state, event);
        }
    }

    cats() {
        return this.state.allCats;
    }

    isRemoveEvent(event) {
        return event === this.events.remove;
    }

    isSortEvent(event) {
        return event === this.events.sort;
    }

    isFilterEvent(event) {
        return event === this.events.filter;
    }

    isLoadMoreEvent(event){
        return event === this.events.loadMore;
    }

    observe(f) {
        this.observers.push(f);
    }

    sort(orderBy) {
        let result = Array.prototype.sort.call(this.cats(), orderBy);

        this.updateState({
            result: result,
            allCats: this.cats(),
            predicate: this.state.predicate
        });

        this.notifyObservers(this.events.sort);
        return result;
    }

    filter(p) {
        let result = Array.prototype.filter.call(this.cats(), p);

        this.updateState({
            result: result,
            allCats: this.cats(),
            predicate: p
        });

        this.notifyObservers(this.events.filter);
        return result;
    }

    remove(idx, num) {
        const result = Array.prototype.splice.apply(this.cats(), [idx, num]);

        this.updateState({
            result: result,
            allCats: this.cats(),
            predicate: this.state.predicate
        })

        this.notifyObservers(this.events.remove);
        return result;
    }

    loadMore(from, num) {
        const result = this.getNextForPredicate(from, num, this.state.predicate);
        this.updateState({
           result: result,
           allCats: this.cats(),
           predicate: this.state.predicate
        });

        this.notifyObservers(this.events.loadMore);
        return result;
    }

    getSize() {
        return this.cats().length;
    }

    getNext(from, end) {
        return this.cats().slice(from, end);
    }

    getNextForPredicate(from, num, p) {
        return this.cats().filter(p).slice(from, from + num);
    }

    getYoungest(num = 4) {
        return this.getNext(0, num);
    }

    removeById(id) {
        const idx = this.cats().findIndex(c => c.id === id);
        this.remove(idx, 1);
    }
}