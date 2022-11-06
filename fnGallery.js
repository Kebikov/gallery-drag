
class FnGallery {
    constructor(block){
        this.element = block;
        this.count = block.childElementCount;
        this.index();
    }
    
    index() {
        console.log('',this.count);
        console.log(this.element);
    }

}