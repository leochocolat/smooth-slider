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

        this._settings = { velocity: 55, lerp: 0.07 }
        this._dragX = 0;
        this._sliderPosition = 0;

        let gui = new dat.GUI();
        gui.add(this._settings, 'velocity', 0.001, 100).step(0.001);
        gui.add(this._settings, 'lerp', 0.001, 0.2).step(0.001);

        this._setup();
    }

    _setup() {
        this._getSlideAmount();
        this._resize();
        this._setupHammer();
        this._setupEventListener();
    }

    _getSlideAmount() {
        this._slideAmount = this.ui.slides.length;
    }

    _setupHammer() {
        this._options = {
            direction: Hammer.DIRECTION_VERTICAL
        }

        this._hammer = new Hammer(this.el, this._options);
    }

    _updatePosition() {
        // if (this._firstChildOffsetX >= 0 && this._dragX > 0) return;

        this._sliderPosition = Lerp(this._sliderPosition, this._sliderPosition + this._dragX * this._settings.velocity, 0.5);
        TweenLite.set(this.ui.slides, { x: this._sliderPosition });
    }
    
    _resetDragX() {
        if (this.isDragging) return;
        
        this._dragX = Lerp(this._dragX, 0, this._settings.lerp);
    }
    
    _resetPosition() {
        if (this._firstChildOffsetX < 400) return; 
    }

    _watchPosition() {
        let firstChild = this.ui.slides[0];
        let lastChild = this.ui.slides[this.ui.slides.length - 1];

        this._firstChildOffsetX = firstChild.getBoundingClientRect().x;
        this._lastChildOffsetX = lastChild.getBoundingClientRect().x;
    }

    _isLastChildInView() {
        if (this._lastChildOffsetX <= this._width + 100) {
            this._createSlide();
            this._updateUI();
        }
    }

    _createSlide() {
        let lastSlide = this.ui.slides[this._mod(this.ui.slides.length, this._slideAmount)];
        let clone = lastSlide.cloneNode(true);

        this.el.appendChild(clone);
    }

    _updateUI() {
        this.ui.slides = this.el.querySelectorAll('.js-slide');
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerWidth;
    }

    _tick() {
        this._updatePosition();
        this._resetDragX();
        this._watchPosition();
        this._isLastChildInView();
        this._resetPosition();
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

    _mod(n, m) {
        return ((n % m) + m) % m;
    }

}

export default SliderComponent;