import SmoothScrollComponent from "./components/smoothScrollComponent";

// import SliderComponent from './components/SliderComponent';


document.addEventListener('DOMContentLoaded', () => {
    new SmoothScrollComponent(document.querySelector('.js-smooth-scroll-component'));
    // new SliderComponent(document.querySelector('.js-slider-component'));
    // new ObjectFit(document.querySelector('.js-video-background-component'));
});