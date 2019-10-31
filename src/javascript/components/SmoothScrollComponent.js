import LocomotiveScroll from 'locomotive-scroll';
import _ from 'underscore';
import { TimelineLite, Power0, Power1 } from 'gsap';
import * as dat from 'dat.gui';

class SmoothScrollComponent {
    constructor(container) {
        _.bindAll(this, '_onCallHandler', '_onScrollHandler', '_onSettingsChange');

        this.el = container;
        this.ui = {
            animImage: container.querySelectorAll('.js-image-scrolling'),
            text: container.querySelector('.js-smooth-scroll-text')
        }

        this._settings = {
            scale: 1.8,
            ease: 'Power2.easeIn',
        }

        let gui = new dat.GUI();
        gui.add(this._settings, 'scale', 1, 5).step(0.01).onChange(this._onSettingsChange);
        gui.add(this._settings, 'ease', [
            'Power0.easeNone',
            'Power1.easeIn',
            'Power1.easeOut',
            'Power1.easeInOut',
            'Power2.easeIn',
            'Power2.easeOut',
            'Power2.easeInOut',
            'Power3.easeIn',
            'Power3.easeOut',
            'Power3.easeInOut',
        ]);
        
        this._setupSplitText();
        this._setupScroll();
        this._setupTweenCollection();
        this._setupEventListeners();
    }

    _setupScroll() {
        this._scroll = new LocomotiveScroll({
            el: this.el,
            smooth: true,
            getDirection: true,
            getSpeed: true
        });
    }

    _setupSplitText() {
        let string = this.ui.text.innerHTML;
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < string.length; i++) {
            let div = document.createElement('span');
            div.innerHTML = string.charAt(i);
            div.style.display = 'inline-block';
            div.setAttribute('data-scroll', '');
            div.setAttribute('data-scroll-speed', `-${Math.random() * string.length/20}`);
            fragment.appendChild(div);
        }
        this.ui.text.innerHTML = '';
        this.ui.text.appendChild(fragment);
    }

    _setupTweenCollection() {
        this._tweenCollection = [];

        for (let i = 0; i < this.ui.animImage.length; i++ ) {
            let tweenObj = {
                timeline: new TimelineLite({ paused: true }),
            };
            this._tweenCollection.push(tweenObj);
        }
    }

    _setupTween(object, id) {
        let image = object.el.querySelector('.js-image');
        this._tweenCollection[id].target = object.el;
        this._tweenCollection[id].targetOffsetBottom = object.bottom;
        this._tweenCollection[id].timeline.fromTo(image, 1, { scale: 1 }, { scale: this._settings.scale, ease: this._settings.ease });
    }

    _updateTweens(event) {
        for (let i = 0; i < this._tweenCollection.length; i++) {
            if (this._tweenCollection[i].target) {
                let currentScrollPosition = event.scroll.y;
                let progress = currentScrollPosition / this._tweenCollection[i].targetOffsetBottom;
                if (progress >= 0 && progress <= 1) {
                    this._tweenCollection[i].timeline.progress(progress);
                }
            }
        }
    }

    _setupEventListeners() {
        this._scroll.on('scroll', this._onScrollHandler);
        this._scroll.on('call', this._onCallHandler);
    }

    _onScrollHandler(event) {
        this._updateTweens(event);
    }

    _onCallHandler(e, state, object) {
        this._setupTween(object, object.id);
    }

    _onSettingsChange() {
        this._scroll.init();
        this._scroll.start();
    }

}

export default SmoothScrollComponent;