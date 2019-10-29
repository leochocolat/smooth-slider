import { TweenLite } from 'gsap';
import _ from 'underscore';
import SizeUtils from '../utils/SizeUtils';

class ObjectFit {
    constructor(container, controller) {

        _.bindAll(
            this, 
            '_resizeHandler',
            '_canPlayHandler',
            '_videoPlaying'
        );

        this.el = container;
        this.controller = controller;
            
        this.ui = {
            video: this.el.querySelector('.js-video'),
            image: this.el.querySelector('.js-image'),
            poster: this.el.querySelector('.js-poster'),
        };

        this._setup();
    }   

    _setup() {
        this._setupEventListeners();
        this._setSizes();

        if (this.ui.video) {
            if (this.ui.video.currentTime > 0) {
                TweenLite.to(this.ui.poster, 0.34, { autoAlpha: 0, delay: 1 });
            }
        }
    }

    _setSizes() {
        if (this.ui.video) {
            this._setSizeVideo(this.ui.image);
        }
        
        if (this.ui.image) {
            this._setSizeImage();
        }
    }

    _setSizeImage() {
        var sizes = SizeUtils.getSize(
            this.el.offsetWidth, this.el.offsetHeight,
            this.ui.image.width, this.ui.image.height,
            SizeUtils.COVER
        );
        
        this.ui.image.style.height = `${sizes.height}'px`;
        this.ui.image.style.width = `${sizes.width}px`;
        this.ui.image.style.left = `${sizes.x}px`;
        this.ui.image.style.top = '0px';
    }
    
    _setSizeVideo() {
        var sizes = SizeUtils.getSize(
            this.el.offsetWidth, this.el.offsetHeight,
            this.ui.video.videoWidth, this.ui.video.videoHeight,
            SizeUtils.COVER
        );

        this.ui.poster.style.height = `${sizes.height}'px`;
        this.ui.poster.style.width = `${sizes.width}px`;
        this.ui.poster.style.left = `${sizes.x}px`;
        this.ui.poster.style.top = '0px';

        this.ui.video.style.height = `${sizes.height}'px`;
        this.ui.video.style.width = `${sizes.width}px`;
        this.ui.video.style.left = `${sizes.x}px`;
        this.ui.video.style.top = '0px';
    }

    _playVideo() {
        if (this.ui.video.currentTime == 0) {
            this.ui.video.play();
        }
    }
    
    _setupEventListeners() {
        window.addEventListener('resize', this._resizeHandler);

        if (this.ui.video) {
            this.ui.video.addEventListener('canplay', this._canPlayHandler);
            this.ui.video.addEventListener('playing', this._videoPlaying);
        }
    }

    /**
     * Handlers
     */
    
    _resizeHandler() {
        this._setSizes();
    }
    
    _canPlayHandler() {
        this._setSizes();
        this._playVideo();
    }

    _videoPlaying() {
        TweenLite.to(this.ui.poster, 0.34, { autoAlpha: 0 });
    }
}

export default ObjectFit;