'use strict';

export class Cat {
    constructor(name, url, age, color) {
        this.name = name;
        this.url = url;
        this.age = age; // dob mačića je u mjesecima
        this.color = color;
    }

    ageToYears() {
        return Math.floor(this.age / 12);
    }

    getAge() {

        const years = this.ageToYears();
        const months = this.age - (years * 12);
        return {years: years, months: months};
    }

    compareAge(other){
        return this.age < other.age ? -1 : this.age === other.age ? 0 : 1;
    }
}