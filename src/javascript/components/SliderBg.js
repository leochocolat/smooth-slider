import _ from 'underscore';
import { TweenLite, Power3, TimelineLite } from 'gsap';
import Hammer from 'hammerjs';
import Lerp from '../utils/Lerp';
import Slide from './Slide';

const DURATION = 1;
const EASE = Power2.easeInOut;

class SliderBg {
    constructor(el) {
        _.bindAll(this, '_dragHandler', '_dragEndHandler', '_clickHandler', '_updateBackground');

        this.el = el;

        this.ui = {
            slideContainer: this.el.querySelector('.js-slide-container'),
            slides: this.el.querySelectorAll('.js-slide')
        }

        this._tweenObj = {
            index: 0,
            activeIndex: 0
        };

        this._setup();
    }

    _setup() {
        this._loadBackgrounds();
        this._clone();
        this._createSlides();
        this._appendSlides();
        this._updateSlides();
        this._setupTweens();
        this._setupHammer();
        this._setupEventListeners();
    }

    _loadBackgrounds() {
        let promises = [];
        let img;
        
        for (let i = 0; i < this.ui.slides.length; i++) {
            let url = this.ui.slides[i].dataset.background;
            img = new Image();
            img.src = url;
            let promise = new Promise((resolve, reject) => {
                img.addEventListener('load', resolve(img));
                img.addEventListener('error', () => {
                reject(new Error(`Failed to load image's URL: ${url}`));
                });
            });
            promises.push(promise);
        }

        Promise.all(promises).then(result => {
            this._backgrounds = result;
        });
    }

    _clone() {
        this._items = this.ui.slides;

        if (this.ui.slides.length > 3) return;
        
        const items = Array.prototype.slice.call(this.ui.slides);

        while (items.length < 4){
            for (let i = 0, len = items.length; i < len; i++) {
                items.push(items[i].cloneNode(true));
            }
        }

        this._items = items;
    }

    _createSlides() {
        this._slides = [];
        for (let i=0; i<4; i++) {
            this._slides.push(this._createSlide(i));
        }
    }

    _createSlide(i) {
        return new Slide(i, 'slide');
    }

    _appendSlides() {
        const slides = document.createElement('div');
        slides.className = 'slides-container';

        for (let i=0, len = this._slides.length; i < len; i++) {
            slides.appendChild(this._slides[i].el);
        }

        const parent = this.ui.slideContainer.parentNode;
        parent.insertBefore(slides, this.ui.slideContainer);
        parent.removeChild(this.ui.slideContainer);
    }

    _updateSlides() {
        const mapSlidesIndices = {
            0: 0,
            1: 1,
            2: -2, 
            3: -1
        };

        const index = this._items.length - Math.floor(this._tweenObj.index);

        for (let i = 0, len = this._slides.length; i < len; i++) {
            const itemIndex = this._mod(index + mapSlidesIndices[i], this._items.length);
            this._updateSlide(this._slides[i], itemIndex);
        }
    }

    _updateSlide(slide, itemIndex) {
        let item = this._items[itemIndex];
        slide.setItem(itemIndex, item);
    }

    _updateBackground() {
        if (this._tweenObj.index === this._tweenObj.currentSlide) return;

        let currentSlide = this.ui.slides[this._mod(this._tweenObj.activeIndex, this.ui.slides.length)];
        let background = currentSlide.dataset.background;
        let image = this._backgrounds[this._mod(this._tweenObj.activeIndex, this.ui.slides.length)];
        this.el.style.backgroundImage = `url(${background})`;
    }

    _setupTweens() {
        const xMovement = 100;

        this._timeline = new TimelineLite({ paused: true });

        this._timeline.fromTo(this._slides[0].el, 5, { x: `${xMovement*0}%` }, { x: `${xMovement*1}%`, ease: Power0.easeNone }, 0);
        this._timeline.fromTo(this._slides[1].el, 5, { x: `${xMovement*1}%` }, { x: `${xMovement*2}%`,  ease: Power0.easeNone }, 0);
        this._timeline.fromTo(this._slides[2].el, 5, { x: `-${xMovement*2}%` }, { x: `-${xMovement*1}%`, ease: Power0.easeNone }, 0);
        this._timeline.fromTo(this._slides[3].el, 5, { x: `-${xMovement*1}%` }, { x: `${xMovement*0}%`, ease: Power0.easeNone }, 0);
    }

    _gotoIndex(index, velocity) {
        let ease = EASE;

        if (!velocity) {
            velocity = 0;
        } else if (velocity) {
            ease = Power1.easeOut
        }

        let deltaDuration = velocity * 0.1;
        if (deltaDuration > 0.5) {
            deltaDuration = 0.5
        }

        TweenLite.to(this._tweenObj, DURATION - deltaDuration, { 
            index: index, 
            ease: ease,
            onUpdate: () => {
                const progress = this._mod(this._tweenObj.index, 1);
                this._timeline.progress(progress);
                this._tweenObj.activeIndex = Math.round(this._tweenObj.index);
                this._updateSlides();
                this._updateBackground();
            }
        });
    }

    next() {
        const index = Math.floor(this._tweenObj.index);
        const nextIndex = index-1;
        this._gotoIndex(nextIndex);
    }
    
    previous() {
        const index = Math.ceil(this._tweenObj.index);
        const previousIndex = index+1;
        this._gotoIndex(previousIndex);
    }

    _setupHammer() {
        this._options = {
            direction: Hammer.DIRECTION_VERTICAL
        }
        this._hammer = new Hammer(this.el, this._options);
    }

    _setupEventListeners() {
        this.el.addEventListener('click', this._clickHandler);
        this._hammer.on('pan', this._dragHandler);
        this._hammer.on('panend', this._dragEndHandler);
    }

    _clickHandler() {
        // this.next();
    }

    _dragHandler(e) {
        this._dragDelta = e.deltaX;
        this._velocity = Math.abs(e.overallVelocityX);

        this._tweenObj.index += 0.015 * Math.sign(this._dragDelta);
        const progress = this._mod(this._tweenObj.index, 1);
        this._timeline.progress(progress);
        this._tweenObj.activeIndex = Math.round(this._tweenObj.index);
        this._updateSlides();
    }

    _dragEndHandler() {
        if (this._dragDelta > 100) {
            this._gotoIndex(Math.ceil(this._tweenObj.index), this._velocity);
        } else if (this._dragDelta < 100) {
            this._gotoIndex(Math.floor(this._tweenObj.index), this._velocity);
        }
    }

    _mod(n, m) {
        return ((n % m) + m) % m;
    }
}

export default SliderBg;