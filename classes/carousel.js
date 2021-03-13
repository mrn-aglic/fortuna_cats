'use strict'

import {DOMFactory} from "./DOMFactory.js";

export class Carousel {
    constructor(carousel, cats) {
        const currentIndex = 0;

        this.carousel = carousel;
        this.cats = cats;

        const self = this;
        cats.observe((result, event) => {
            if (cats.isRemoveEvent(event)) {
                self.removeSlide(result);
            }
        });

        const objects = cats.getYoungest(4);
        this.populateCarousel(objects);

        const [left, right] = this.getLeftAndRight(currentIndex, this.slides);
        this.current = this.slides[currentIndex];
        this.left = left;
        this.right = right;

        this.initSlides();
        this.initButtons();
    }

    asSlide(slide) {
        slide.classList.remove('slide-preview');
        slide.classList.add('slide');
    }

    preview(slide) {
        slide.classList.add('slide-preview');
        this.show(slide);
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
        this.show(slide);
    }

    removeActiveState(slide) {
        slide.classList.remove('active');
    }

    leftPreview(slide) {
        slide.classList.add('slide-preview-left');
        this.preview(slide);
    }

    rightPreview(slide) {
        slide.classList.add('slide-preview-right');
        this.preview(slide);
    }

    previewBoth(left, right) {
        this.leftPreview(left);
        this.rightPreview(right);
    }

    isSlide(el) {
        return el.matches('.slide');
    }

    hide(el) {
        el?.classList.add('d-none');
    }

    show(el) {
        el.classList.remove('d-none');
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

        const adoptBtn = DOMFactory.createAdoptButton(cat.id, () => this.cats.remove(cat.id));

        this.asSlide(container);
        this.hide(container);

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

        this.leftPreview(this.left);
        this.rightPreview(this.right);

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

    getLeftAndRight(idx, slides) {
        const current = slides[idx];
        const left = this.getLeft(current);
        const right = this.getRight(current);

        return [left, right];
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
        this.hide(preview);
    }

    refreshDisplay() {

        this.setActive(this.current);

        if (this.left !== this.right) { // if we have two slides, then left is equal to right
            this.previewBoth(this.left, this.right);
        } else {
            if (this.left !== this.current) this.hide(this.left); // if we have one slide, then that slide is left, right and current

            this.current.classList.remove('active-hover');
        }
    }

    removeSlide(result) {

        for (let cat of result) {

            const id = cat.id;
            const btn = this.carousel.querySelector(`[data-id="${id}"]`);

            if (btn == null) return;

            const slide = btn.closest('.slide');

            if (slide === null) return;

            this.carousel.removeChild(slide);

            const slides = this.carousel.getElementsByClassName('slide');

            this.removePreview(this.left);
            this.removePreview(this.right);

            if (slides.length < 3) {
                const nextActive = this.right;

                if (this.left !== nextActive) {
                    this.carousel.appendChild(this.left);
                }
                this.right = this.left;
                this.current = nextActive;

                this.refreshDisplay()
            } else {
                const nextActive = this.right;
                const nextRight = nextActive.nextElementSibling;
                this.current = nextActive;
                this.right = nextRight;

                this.display(this.current, this.left, this.right);
            }
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