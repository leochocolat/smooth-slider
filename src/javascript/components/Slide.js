class Slide {
    constructor(id, className) {
        this.id = id;
        this.className = className;

        this.el = document.createElement('div');
        this.el.className = className;
        this.el.innerText = id;
    }

    setItem(index, item) {
        if (this._previousItemIndex === index) return;

        this._previousItemIndex = index;
        this.el.innerHTML = '';

        let clone = item;
        this.el.appendChild(clone);
    }
}

export default Slide;