import SmoothScrollComponent from "./components/smoothScrollComponent";
import SliderComponent from './components/SliderComponent';
import SliderBg from './components/SliderBg';

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id == 'sliderBg') {
        new SliderBg(document.querySelector('.js-slider-bg'));
    } else if (document.body.id == 'smoothScroll') {
        new SmoothScrollComponent(document.querySelector('.js-smooth-scroll-component'));
    } else {
        new SliderComponent(document.querySelector('.js-slider-component'));
    }
    // new ObjectFit(document.querySelector('.js-video-background-component'));
});