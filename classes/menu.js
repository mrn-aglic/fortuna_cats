'use strict';

import {CssHelpers} from './cssHelpers.js';

export class Menu {
    constructor(menuContainer, cats, getResultNum) {
        this.el = menuContainer;
        this.cats = cats;
        this.getResultNum = getResultNum;

        const self = this;
        this.cats.observe((state, event) => {

            if (self.cats.isLoadMoreEvent(event)) {
                self.updateResultNum();
                self.resetSortMenu();
            }
        });

        this.initMenu()
    }

    createSortMenu() {
        const parser = new DOMParser();
        const sortMenuTemplate = `<div id="sort-menu" class="sub-menu">
            <div id="sort-by">
                <span class="menu-label">Sortiraj prema:</span>
                <div class="radio-control">
                    <input name="feature" id="name-radio" value="name" type="radio"/>
                    <label for="name-radio">Imenu</label>
                </div>
                <div class="radio-control">
                    <input name="feature" id="age-radio" value="age" type="radio" checked/>
                    <label for="age-radio">Dobi</label>
                </div>
            </div>
            <div id="sort-order">
                <span class="menu-label"> Sortiraj: </span>
                <div class="radio-control">
                    <input name="order" id="order-asc" value="<" type="radio" checked/>
                    <label for="order-asc">Uzlazno</label>
                </div>
                <div class="radio-control">
                    <input name="order" id="order-desc" value=">" type="radio"/>
                    <label for="order-desc">Silazno</label>
                </div>
            </div>
        </div>`;

        return parser.parseFromString(sortMenuTemplate, 'text/html').body.children[0];
    }

    createFilterMenu() {
        const parser = new DOMParser();
        const filterMenuTemplate = `<div id="filter-menu" class="sub-menu">
            <div class="flex-row">
                <span>Rezultata:</span>
                <span id="result"></span>
            </div>
            <div class="filters">
                <span class="menu-item"> Prikaži samo: </span>
                <div class="checkbox-container">
                    <label class="checkbox-label">
                        <input id="age6" name="filter" value="age<=6" type="checkbox"/>
                        <span class="checkbox-box">Mačić je mlađi od 6 mjeseci</span>
                    </label>
                </div>
                <div class="checkbox-container">
                    <label class="checkbox-label">
                        <input id="age12" name="filter" value="age<=12" type="checkbox"/>
                        <span class="checkbox-box">Mačić je mlađi od 12 mjeseci</span>
                    </label>
                </div>
                <div class="checkbox-container">
                    <label class="checkbox-label">
                        <input id="color" name="filter" value="color==='black'" type="checkbox"/>
                        <span class="checkbox-box">Mačić je crne boje</span>
                    </label>
                </div>
            </div>
        </div>`;
        return parser.parseFromString(filterMenuTemplate, 'text/html').body.children[0];
    }

    createSearch() {
        const parser = new DOMParser();
        const searchMenuTemplate = `<div id="search-menu" class="sub-menu">
            <input type="text" placeholder="Pretraga po imenu"/>
        </div>`;
        return parser.parseFromString(searchMenuTemplate, 'text/html').body.children[0];
    }

    initMenu() {

        console.log(this.el)
        this.el.appendChild(this.createSortMenu());
        this.el.appendChild(this.createFilterMenu());
        this.el.appendChild(this.createSearch());

        this.ageRadio = this.el.querySelector('#age-radio');
        this.orderRadio = this.el.querySelector('#order-asc');

        const filters = [...this.el.querySelectorAll('[name=filter]')];
        const searchBox = this.el.querySelector('#search-menu').children[0];

        const sortByFeatureInputs = [...this.el.querySelectorAll('[name=feature]')];
        const sortOrderInputs = [...this.el.querySelectorAll('[name=order]')];

        for (let filter of filters) {
            filter.onchange = () => this.filter();
        }
        searchBox.onkeyup = () => this.filter();

        for (let sort of sortByFeatureInputs.concat(sortOrderInputs)) {
            sort.onchange = () => this.sort();
        }

        this.resetSortMenu();
    }

    resetSortMenu() {
        this.ageRadio.checked = true;
        this.orderRadio.checked = true;
        this.sort();
    }

    getQueries() {
        const checked = [...this.el.querySelectorAll('[name=filter]')].filter(c => c.checked);

        const idsToFilters = {
            'age6': c => c.age <= 6,
            'age12': c => c.age <= 12,
            'color': c => c.color === 'black'
        }

        const queries = [];
        for (let ch of checked) {
            queries.push(idsToFilters[ch.id]);
        }
        return queries;
    }

    createPredicateFunctionFromCheckboxes() {
        const queries = this.getQueries();

        return c => {
            let result = true;
            for (let f of queries) {
                result = result && f(c);
            }
            return result;
        };
    }

    getFilterFunction() {
        const searchbox = this.el.querySelector('#search-menu > input');
        const searchstring = searchbox.value.toLowerCase();

        const searchFilter = c => c.name.toLowerCase().includes(searchstring);

        const f = this.createPredicateFunctionFromCheckboxes();

        return c => searchFilter(c) && f(c);
    }

    updateResultNum() {
        const resultNum = this.getResultNum();
        const result = this.el.querySelector('#result');
        result.innerText = resultNum;

        const cardsResult = this.el.querySelector('#cards-result');

        if (resultNum === 0) {
            CssHelpers.show(cardsResult);
        } else {
            CssHelpers.hide(cardsResult);
        }
    }

    getOrderBy() {
        const comparisonFunctions = {
            '<': (a, b) => isNaN(a) ? a.localeCompare(b) : a - b,
            '>': (a, b) => isNaN(a) ? b.localeCompare(a) : b - a
        };

        const orderByFeatureValue = this.el.querySelector('input[name="feature"]:checked').value;
        const orderDirection = this.el.querySelector('input[name="order"]:checked').value;

        const byFeature = c => c[orderByFeatureValue];
        const order = comparisonFunctions[orderDirection];

        return (a, b) => order(byFeature(a), byFeature(b));
    }

    sort() {
        const orderBy = this.getOrderBy();

        this.cats.sort(orderBy);
    }

    filter() {
        const predicate = this.getFilterFunction();
        this.cats.filter(predicate);
    }
}