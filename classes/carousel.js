'use strict'

import {DOMFactory} from './DOMFactory.js';
import {CssHelpers} from './cssHelpers.js';

export class Carousel {
    constructor(carousel, cats) {
        const startIndex = 0;

        this.numCatsInCarousel = 4;
        this.carousel = carousel;
        this.cats = cats;

        const self = this;
        cats.observe((state, event) => {
            if (cats.isRemoveEvent(event)) {
                self.updateCarousel(state);
            }
        });

        const carouselCats = cats.getYoungest(this.numCatsInCarousel);
        this.populateCarousel(carouselCats);

        this.current = this.slides[startIndex];
        this.left = this.getLeft(this.current);
        this.right = this.getRight(this.current);

        this.initSlides();
        this.initButtons();
    }

    asSlide(slide) {
        slide.classList.remove('slide-preview');
        slide.classList.add('slide');
    }

    removePreview(slide) {
        slide?.classList.remove('slide-preview');
        slide?.classList.remove('slide-preview-left');
        slide?.classList.remove('slide-preview-right');
    }

    setActive(slide) {
        slide.classList.add('active');
        slide.classList.add('active-hover');
        this.removePreview(slide);
        CssHelpers.show(slide);
    }

    removeActiveState(slide) {
        slide.classList.remove('active');
        slide.classList.remove('active-hover');
    }

    leftPreview(slide) {
        slide.classList.add('slide-preview');
        slide.classList.add('slide-preview-left');
        CssHelpers.show(slide);
    }

    rightPreview(slide) {
        slide.classList.add('slide-preview');
        slide.classList.add('slide-preview-right');
        CssHelpers.show(slide);
    }

    previewBoth(left, right) {
        this.leftPreview(left);
        this.rightPreview(right);
    }

    isSlide(el) {
        return el.matches('.slide');
    }

    createImgFromObject(obj) {
        const img = document.createElement('img');
        img.src = obj.url;
        return img;
    }

    createSlide(cat) {
        const img = this.createImgFromObject(cat);

        const container = document.createElement('div');
        const textNode = document.createElement('div');
        textNode.innerText = cat.name;

        const adoptBtn = DOMFactory.createAdoptButton(cat.id, () => this.cats.removeById(cat.id));

        this.asSlide(container);
        CssHelpers.hide(container);

        textNode.classList.add('slide-text');

        container.appendChild(img);
        container.appendChild(adoptBtn);
        container.appendChild(textNode);

        return container;
    }

    populateCarousel(objects) {
        const slides = objects.map(o => this.createSlide(o));
        for (let slide of slides) {
            this.carousel.appendChild(slide);
        }
        this.slides = slides;
    }

    initSlides() {
        this.display(this.current, this.left, this.right);
        this.previewBoth(this.left, this.right);
        this.carousel.insertBefore(this.left, this.current);
    }

    initButtons() {
        const container = this.carousel.closest('div#carousel-container');
        const prevBtn = container.querySelector('.btn-prev');
        const nextBtn = container.querySelector('.btn-next');

        const self = this;

        prevBtn.onclick = () => self.moveLeft();
        nextBtn.onclick = () => self.moveRight();
    }

    getRight(active) {
        const next = active.nextElementSibling;
        return next === null || !this.isSlide(next) ? active.parentNode.firstElementChild : next;
    }

    getLeft(active) {
        const prev = active.previousElementSibling;
        return prev === null || !this.isSlide(prev) ? active.parentNode.lastElementChild : prev;
    }

    display(current, left, right) {
        this.setActive(current);

        if (left !== null && right !== null) {
            this.previewBoth(left, right);
        } else {
            if (left === null) {
                this.setActive(right);
            }
            if (right === null) {
                this.setActive(left);
            }
        }
    }

    hidePreview(preview) {
        this.removePreview(preview);
        CssHelpers.hide(preview);
    }

    refreshDisplay() {
        this.setActive(this.current);

        if (this.left !== this.right) { // if we have two slides, then left is equal to right
            this.previewBoth(this.left, this.right);
        } else {
            if (this.left !== this.current) CssHelpers.hide(this.left); // if we have one slide, then that slide is left, right and current
            this.current.classList.remove('active-hover');
        }
    }

    updateCarousel(state) {
        const result = state.result;
        for (let cat of result) {
            const id = cat.id;
            const btn = this.carousel.querySelector(`[data-id="${id}"]`);
            if (btn === null) return;
            const slide = btn.closest('.slide');
            if (slide === null) return;

            const newCat = this.loadNewCat();
            const newSlide = this.createSlide(newCat);
            this.updateSlides(slide, newSlide);
        }
    }

    loadNewCat() {
        const slideIds = [...this.carousel.querySelectorAll('[data-id]')]
            .map(el => parseInt(el.getAttribute('data-id')));
        const slideCats = this.cats.getYoungestAfter(slideIds);
        return slideCats[0];
    }

    updateSlides(slide, newSlide) {
        this.carousel.removeChild(slide);

        if (this.left === slide) {
            this.carousel.insertBefore(newSlide, this.current);
            this.left = newSlide;
            this.leftPreview(newSlide);
        } else {
            this.carousel.appendChild(newSlide);
            if (this.current === slide) {
                this.current = this.right;
            }
            this.right = this.current.nextElementSibling;
            this.rightPreview(this.right);
            this.setActive(this.current);
        }
    }

    moveRight() {
        if (this.left === this.current) return;
        this.removeActiveState(this.current);
        this.hidePreview(this.left);
        this.carousel.appendChild(this.left);

        const oldRight = this.right;

        this.left = this.current;
        this.current = oldRight;
        this.right = this.current.nextElementSibling ?? this.left;

        this.refreshDisplay();
    }

    moveLeft() {
        if (this.left === this.current) return;
        this.removeActiveState(this.current);
        this.hidePreview(this.right);

        const newLeft = this.carousel.querySelector('.slide:last-child');
        this.carousel.insertBefore(newLeft, this.left);

        const oldLeft = this.left;

        this.left = oldLeft === newLeft ? this.current : newLeft;
        this.right = this.current;
        this.current = oldLeft;

        this.refreshDisplay();
    }

    run() {
        const intervalTime = 2000;
        const self = this;

        setInterval(function () {

            const active = document.querySelector('.active:hover');
            const isActiveHovered = active !== null;

            if (!isActiveHovered) {
                self.moveRight();
            }
        }, intervalTime);
    }
}