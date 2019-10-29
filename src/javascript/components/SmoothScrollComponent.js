import LocomotiveScroll from 'locomotive-scroll';
import _ from 'underscore';
import { TimelineLite, Power0 } from 'gsap';

class SmoothScrollComponent {
    constructor(container) {
        _.bindAll(this, '_onCallHandler', '_onScrollHandler');

        this.el = container;
        this.ui = {
            animImage: container.querySelectorAll('.js-image-scrolling')
        }
        
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
        this._tweenCollection[id - 1].target = object.el;
        this._tweenCollection[id - 1].targetOffsetBottom = object.bottom;
        this._tweenCollection[id - 1].timeline.fromTo(image, 1, { scale: 1 }, { scale: 1.7, ease: Power0.easeNone });
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

}

export default SmoothScrollComponent;