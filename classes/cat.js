'use strict';

export class Cat {
    constructor(id, name, url, age, color) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.age = age; // cat age is stored in months
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

    getAgeText(){
        const monthsText = m => m === 1 ? 'mjesec' : m < 5 ? 'mjeseca' : 'mjeseci';
        const {years, months} = this.getAge();
        const yearText = years > 0 ? `${years} godina` : '';
        const monthText = months > 0 ? `${months} ${monthsText(months)}` : '';

        return [yearText, monthText].filter(t => t !== '').join(' i ')
    }

    compareAge(other) {
        return this.age < other.age ? -1 : this.age === other.age ? 0 : 1;
    }
}