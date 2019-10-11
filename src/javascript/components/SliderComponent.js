import _ from 'underscore';
import { TweenLite, Power3 } from 'gsap';
import Hammer from 'hammerjs';
import Lerp from '../utils/Lerp';
import * as dat from 'dat.gui';

class SliderComponent {
    constructor(el) {

        _.bindAll(
            this, 
            '_resizeHandler', 
            '_tickHandler',
            '_dragHandler',
            '_dragEndHandler',
            '_pressHandler',
            '_pressUpHandler'
        )

        this.el = el;

        this.ui = {
            slides: this.el.querySelectorAll('.js-slide'),
            slideImages: this.el.querySelectorAll('.js-slide-image'),
        }

        this._settings = { velocity: 40 }
        this._dragX = 0;
        this._sliderPosition = 0;

        let gui = new dat.GUI();
        gui.add(this._settings, 'velocity', 0.001, 100).step(0.001);

        this._setup();
    }

    _setup() {
        this._setupHammer();
        this._setupEventListener();
    }

    _setupHammer() {
        this._options = {
            direction: Hammer.DIRECTION_VERTICAL
        }

        this._hammer = new Hammer(this.el, this._options);
    }

    _updatePosition() {
        this._sliderPosition = Lerp(this._sliderPosition, this._sliderPosition + this._dragX * this._settings.velocity, 0.5);
        TweenLite.set(this.ui.slides, { x: this._sliderPosition });
    }

    _resetDragX() {
        if (this.isDragging) return;

        this._dragX = Lerp(this._dragX, 0, 0.1);
    }

    _resize() {
        
    }

    _tick() {
        this._updatePosition();
        this._resetDragX();
    }

    _setupEventListener() {
        window.addEventListener('resize', this._resizeHandler);
        this._hammer.on('pan', this._dragHandler);
        this.el.addEventListener('mousedown', this._pressHandler);
        this.el.addEventListener('mouseup', this._pressUpHandler);
        this._hammer.on('panend', this._dragEndHandler);
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
    }

    _dragHandler(e) {
        this.isDragging = true;

        this._dragX = e.velocityX;
    }

    _pressHandler() {
        TweenLite.to(this.ui.slideImages, .6, { scale: 1.02, ease: Power2.easeOut })
        TweenLite.to(this.ui.slides, .6, { scale: 1.02, ease: Power2.easeOut })
    }

    _pressUpHandler() {
        TweenLite.to(this.ui.slideImages, .6, { scale: 1, ease: Power2.easeOut })
        TweenLite.to(this.ui.slides, .6, { scale: 1, ease: Power2.easeOut })
    }

    _dragEndHandler() {
        this.isDragging = false;
    }

    _tickHandler() {
        this._tick();
    }

    _resizeHandler() {
        this._resize();
    }

}

export default SliderComponent;