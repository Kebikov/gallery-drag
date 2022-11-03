const GalleryClassName = 'gallery';
const GalleryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide';


class Gallery {
    constructor(element, option = {}) {
        this.containerNode = element;
        this.size = element.childElementCount;
        this.currentSlide = 0;

        this.manageHTML = this.manageHTML.bind(this);
        this.setParameters = this.setParameters.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);
        this.setStylePosition = this.setStylePosition.bind(this);

        this.manageHTML();
        this.setParameters();
        this.setEvents();
    }

    manageHTML() {
        this.containerNode.classList.add(GalleryClassName);
        this.containerNode.innerHTML = `
            <div class='${GalleryLineClassName}'>
                ${this.containerNode.innerHTML}
            </div>
        `;
        this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`);
        this.slideNodes = Array.from(this.lineNode.children).map((childNode) => {
            return wrapElementByDiv({
                element: childNode,
                className: GallerySlideClassName
            });
        });
    }

    setParameters() {
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.width = coordsContainer.width;

        this.x = -this.currentSlide * this.width;

        this.lineNode.style.width = `${this.width * this.size}px`;
        Array.from(this.lineNode.children).map(item => item.style.width = `${this.width}px`);
    }

    setEvents() {
        this.deboncedResizeGallery = debonce(this.resizeGallery);
        window.addEventListener('resize', this.deboncedResizeGallery);
        this.lineNode.addEventListener('pointerdown', this.startDrag);
        window.addEventListener('pointerup', this.stopDrag);
    }

    destroyEvents() {
        window.removeEventListener('resize', this.deboncedResizeGallery);
    }

    resizeGallery() {
        console.log('res');
        this.setParameters();
    }

    startDrag(evt) {
        this.clickX = evt.pageX;
        window.addEventListener('pointermove', this.dragging);
        //this.lineNode.classList.remove('trans');
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
        if(this.x < 0) {
            console.log('q',this.x);
            this.currentSlide = this.currentSlide + 1;
            console.log('this.currentSlide',this.currentSlide);
            this.x = -this.currentSlide * this.width;
            console.log('width',this.width);
            //this.lineNode.classList.add('trans');
            this.setStylePosition();
        }
    }

    dragging(evt) {
        this.dragX = evt.pageX;
        const dragShift = this.dragX - this.clickX;
        this.x = dragShift;
        this.setStylePosition();
    }

    setStylePosition() {
        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`;
    }

    next() {

    }
}


function wrapElementByDiv({element, className}) {
    const wrapperNode = document.createElement('div');
    wrapperNode.classList.add(className);

    // element.parentElement.append(wrapperNode);
    // wrapperNode.append(element);

    element.parentNode.insertBefore(wrapperNode, element);
    wrapperNode.appendChild(element);

    return wrapperNode;
}

function debonce(func, time = 100) {
    let timer;

    return function (event) {
        clearTimeout(timer);
        timer = setTimeout(func, time, event);
    }
}

