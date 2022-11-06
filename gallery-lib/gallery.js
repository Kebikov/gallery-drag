const GalleryClassName = 'gallery';
const GalleryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide';


class Gallery {
    constructor(element, option = {}) {
        this.containerNode = element;
        this.size = element.childElementCount;
        this.currentSlide = 0;
        this.position = 0;
        this.correctionSwipe = 0;

        this.manageHTML = this.manageHTML.bind(this);
        this.setParameters = this.setParameters.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);
        this.setStylePosition = this.setStylePosition.bind(this);
        this.correction = this.correction.bind(this);

        this.manageHTML();
        this.setParameters();
        this.setEvents();
        this.correction();
    }

    correction() {
        this.correctionSwipe = this.width * 0.1;
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

        this.x = this.currentSlide * this.width;

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
        this.setParameters();
    }

    startDrag(evt) {
        this.click = evt.pageX;
        window.addEventListener('pointermove', this.dragging);
        this.lineNode.classList.remove('trans');
    }

    dragging(evt) {
        this.drag = evt.pageX;
        this.dragShift = this.drag - this.click;
        console.log('this.dragShift',this.dragShift);
        this.setStylePosition();
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
        if(this.correctionSwipe > this.dragShift && this.dragShift > 0 || 0 > this.dragShift && this.dragShift > -this.correctionSwipe) {
            this.lineNode.classList.add('trans');
            this.dragShift = 0;
            this.setStylePosition();
        }else{
            if(this.dragShift < 0) {
                //plus
                if(this.currentSlide >= this.size - 1) {
                    this.dragShift = 0;
                    this.position = (this.size - 1)  * -this.width;
                    this.currentSlide = this.size - 1;
                    this.lineNode.classList.add('trans');
                    this.setStylePosition();
                }else{
                    this.dragShift = 0;
                    this.currentSlide = this.currentSlide + 1;
                    this.position = -this.currentSlide * this.width;
                    this.lineNode.classList.add('trans');
                    this.setStylePosition();
                }
            }
    
            if(this.dragShift > 0) {
            //minus
                if(this.currentSlide <= 0) {
                    this.dragShift = 0;
                    this.position = 0;
                    this.currentSlide = 0;
                    this.lineNode.classList.add('trans');
                    this.setStylePosition();
                }else{
                    this.dragShift = 0;
                    this.currentSlide = this.currentSlide - 1;
                    this.position = -this.currentSlide * this.width;
                    this.lineNode.classList.add('trans');
                    this.setStylePosition();
                }
            }
        }

        this.position = this.position + this.dragShift;
    }

    setStylePosition() {
        this.lineNode.style.transform = `translate3d(${this.position + this.dragShift}px, 0, 0)`;
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

