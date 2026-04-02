const data = {
    "top1": {
        "children": ["top2"],
        "time": 0
    },
    
    "top2": {
        "children": ["top3","top3_1", "top3_2"],
        "time": 1
    },

    "top3_1" : {
        "children" : [],
        "time": 2
    },
    
    "top3_2" : {
        "children" : [],
        "time": 2
    },

    "top3" : {
        "children" : [],
        "time": 2
    }
}


export class Songs {
    constructor() {
        this.data = data
        this.preloadImages()
    }

    preloadImages() {
        for (const songName in data) {
            const img = new Image();
            img.src = 'https://qodeinteractive.com/magazine/wp-content/uploads/2020/06/8-Tyler-the-Creator.jpg';
            data[songName]["image"] = img
        }

    }


}