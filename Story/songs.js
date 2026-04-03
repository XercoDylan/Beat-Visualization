const data = {
    "Drag Rap": {
        // Reordered children to align with their future branches
        "children": ["Wipe Me Down", "Back That Azz Up", "Where Dey At", "Gangsta Walk"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 0
    },

    "Wipe Me Down": {
        "children": ["Whatchu Kno 'Bout Me"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 21
    },

    "Whatchu Kno 'Bout Me": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 38
    },

    "Back That Azz Up": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 12
    },

    "Where Dey At": {
        "children": ["Clap For Em"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 5
    },

    "Clap For Em": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 34
    },

    "Gangsta Walk": {
        "children": ["Explode"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 5
    },

    "Explode": {
        "children": ["Break My Soul", "Energy"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 28
    },

    "Break My Soul": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 36
    },

    "Energy": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 36
    }
}


export class Songs {
    constructor() {
        this.data = data
    }

    preloadImages(canvas) {
        for (const songName in data) {

            const img = new Image();

            img.onload = () =>  {
                canvas.draw()
            }
            
            img.src = data[songName]["image"]
            data[songName]["image"] = img
        }

    }


}