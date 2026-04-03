const MAX_ZOOM = 15
const MIN_ZOOM = 0.1
const ZOOM_SENSITIVITIY = 0.1
const GRID_SIZE = 250
const LINE_WIDTH = 1000
const POP_UP_WIDTH = 800
const TIME_ARROW_OFFSET = 100
const TIME_OFFSET = 50
const START_TIME = 1990
const TITLE_OFFSET = 150
const VERTEX_RADIUS = 60
const TIME_PER_GRID = 5

export class Canvas {
    constructor(canvas, context, songs) {
        this.context = context
        this.canvas = canvas
        this.songs = songs
        this.dragging = false
        
        this.songsToRender = []
        this.songsPostions = {}
        this.currentSelected = null

        this.zoom = 1
        this.cameraX = 0
        this.cameraY = 0
        this.depth = 0
        this.currentSongs = {
            
        }

        songs.preloadImages(this)
        this.resize()
        


        window.addEventListener('wheel', (e) => {
            this.scale(e)
        })


        window.addEventListener('resize', () => {
            this.resize()
        })

        window.addEventListener("mousedown", (e) => {
            this.dragging = true
            this.click(e)
            canvas.style.cursor = "grab"
        })

        window.addEventListener("mouseup", () => {
            this.dragging = false
            canvas.style.cursor = "default";
        })

        window.addEventListener("mousemove", (e) => {
            if (this.dragging) {
                this.translate(e.movementX, e.movementY)
            }
        })
    }

    click(e) {
        const x = ((e.clientX - this.cameraX)) / this.zoom;
        const y = ((e.clientY - this.cameraY)) / this.zoom;
        

        for (const songName in this.songsPostions) {
            const songPos = this.songsPostions[songName]

            const distance =  ((x - songPos[0])**2 + (y - songPos[1])**2)**0.5

            if (distance <= VERTEX_RADIUS ) {
                this.currentSelected = [songName, songPos]
                this.draw()
                break
            }
            
        }
    }

    translate(x, y) {
        this.cameraX += x
        this.cameraY += y
        this.draw()
    }

    scale(e) { 

        const zoomAmount = e.deltaY < 0 ? 1 + ZOOM_SENSITIVITIY : 1 - ZOOM_SENSITIVITIY;
        let newZoom = this.zoom * zoomAmount;

        newZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);


        const mouseWorldX = (e.clientX - this.cameraX) / this.zoom;
        const mouseWorldY = (e.clientY - this.cameraY) / this.zoom;


        this.zoom = newZoom;


        this.cameraX = e.clientX - (mouseWorldX * this.zoom);
        this.cameraY = e.clientY - (mouseWorldY * this.zoom);
        this.draw()
    }

    create_grid() {
        const startY = this.canvas.height/2
        const withStart = this.canvas.width/2 - LINE_WIDTH/2

        this.context.lineWidth = 0.5
        this.context.strokeStyle =  '#ffffff'
        
        for (let i = 0; i <= this.depth; i++ ) {
            this.context.beginPath()
            this.context.moveTo(withStart, startY + (GRID_SIZE * i))
            this.context.lineTo(withStart + LINE_WIDTH, startY + (GRID_SIZE * i))
            this.context.stroke()

            this.context.fillStyle = "white"
            this.context.font = "20px Roboto";
            this.context.fillText(START_TIME + (i * TIME_PER_GRID) ,withStart - TIME_OFFSET,startY + (GRID_SIZE * i));
            this.context.textAlign = "center"
            this.context.textBaseline = "middle";
        }

        
    }

    create_time_arrow() {
        this.context.beginPath()
        this.context.lineWidth = 10
        this.context.strokeStyle =  '#ffffff'
        this.context.moveTo(this.canvas.width/2 - (LINE_WIDTH/2 + TIME_ARROW_OFFSET), this.canvas.height/2)
        this.context.lineTo(this.canvas.width/2 - (LINE_WIDTH/2 + TIME_ARROW_OFFSET), this.canvas.height/2 + (GRID_SIZE * this.depth) + 2.5)
        this.context.stroke()


        this.context.beginPath()

        this.context.moveTo(this.canvas.width/2 - (LINE_WIDTH/2 + TIME_ARROW_OFFSET), this.canvas.height/2 + (GRID_SIZE * this.depth))
        this.context.lineTo(this.canvas.width/2 - (LINE_WIDTH/2 + TIME_ARROW_OFFSET + 25), this.canvas.height/2 + (GRID_SIZE * this.depth) - 35)
        this.context.stroke()

        this.context.moveTo(this.canvas.width/2 - (LINE_WIDTH/2 + TIME_ARROW_OFFSET), this.canvas.height/2 + (GRID_SIZE * this.depth))
        this.context.lineTo(this.canvas.width/2 - (LINE_WIDTH/2 + TIME_ARROW_OFFSET - 25), this.canvas.height/2 + (GRID_SIZE * this.depth) - 35)
        this.context.stroke()
    }


    render_popUp() {
        const songName = this.currentSelected[0]
        this.context.fillStyle = "rgb(255, 255, 255)"
        this.context.lineWidth = 2
        this.context.strokeStyle =  '#000000'
        this.context.beginPath()
        this.context.moveTo(this.currentSelected[1][0] + VERTEX_RADIUS, this.currentSelected[1][1])
        this.context.lineTo(this.currentSelected[1][0] + VERTEX_RADIUS + 50, this.currentSelected[1][1] + 50)
        this.context.lineTo(this.currentSelected[1][0] + VERTEX_RADIUS + 50, this.currentSelected[1][1] + 50 + 50)
        this.context.lineTo(this.currentSelected[1][0] + VERTEX_RADIUS + 50 + 300, this.currentSelected[1][1] + 50 + 50)
        this.context.lineTo(this.currentSelected[1][0] + VERTEX_RADIUS + 50 + 300, this.currentSelected[1][1]  - 50 - 50)
        this.context.lineTo(this.currentSelected[1][0] + VERTEX_RADIUS + 50 , this.currentSelected[1][1]  - 50 - 50)
        this.context.lineTo(this.currentSelected[1][0] + VERTEX_RADIUS + 50 , this.currentSelected[1][1] - 50)
        this.context.lineTo(this.currentSelected[1][0] + VERTEX_RADIUS, this.currentSelected[1][1])
        this.context.fill()
        this.context.stroke()

        this.context.fillStyle ='#ff0000' 
        this.context.beginPath()
        this.context.arc(this.currentSelected[1][0] + VERTEX_RADIUS + 20 + 300 , this.currentSelected[1][1] - 75, 12, 0, Math.PI * 2)
        this.context.fill()
        this.context.stroke()


        this.context.fillStyle = "white"
        this.context.font = "15px Roboto";
        this.context.textAlign = "center"
        this.context.textBaseline = "middle";
        this.context.fillText("X" ,this.currentSelected[1][0] + VERTEX_RADIUS + 20 + 300 , this.currentSelected[1][1] - 75);

        this.context.font = "30px Roboto";
        this.context.fillStyle = "black"
        this.context.fillText("Song Name" ,this.currentSelected[1][0] + VERTEX_RADIUS + 150  , this.currentSelected[1][1] - 55)
        this.context.fillText("Artist, Year" ,this.currentSelected[1][0] + VERTEX_RADIUS + 150  , this.currentSelected[1][1] - 15)
        this.context.fillText("Location" ,this.currentSelected[1][0] + VERTEX_RADIUS + 150  , this.currentSelected[1][1] + 25)
        this.context.fillText("List of Samples" ,this.currentSelected[1][0] + VERTEX_RADIUS + 150  , this.currentSelected[1][1] + 65)

        const imageSizeX = VERTEX_RADIUS + 30
        const imageSizeY = VERTEX_RADIUS + 30

        this.context.drawImage(this.songs.data[songName]["image"], this.currentSelected[1][0] + VERTEX_RADIUS + 300  - imageSizeX/2 , this.currentSelected[1][1]  - imageSizeY/2 , imageSizeX, imageSizeY)
    }

    render_songs() {
        for (const i in this.songsToRender) {
            const songs = this.songsToRender[i]
            const pos = songs["pos"]
            const songName = songs["songName"]

            if (this.currentSelected != null &&  this.currentSelected[0] == songName) {
                this.context.fillStyle = "rgb(255, 153, 1)"
            } else {
                this.context.fillStyle = "white"
            }
            
            this.context.strokeStyle = "transparent"

            this.context.beginPath()
            this.context.arc(pos[0], pos[1], VERTEX_RADIUS, 0, Math.PI * 2)
            this.context.fill()
            this.context.stroke()


            const imageSizeX = VERTEX_RADIUS
            const imageSizeY = VERTEX_RADIUS

            this.context.drawImage(this.songs.data[songName]["image"], pos[0] - imageSizeX/2, pos[1] - imageSizeY/2, imageSizeX, imageSizeY)


            this.context.fillStyle = "rgb(255, 153, 1)"
            this.context.font = "30px Roboto"
            this.context.fillText(songName,pos[0],pos[1]  + 80)
            this.context.textAlign = "center"
            this.context.textBaseline = "middle"

            this.songsPostions[songName] = pos
        }

        this.songsToRender = []
        
    }

    render_connection(songName, time, xmult, parent_pos) {

        const pos = [(canvas.width/2 - LINE_WIDTH/2) + (LINE_WIDTH * xmult), canvas.height/2 + ((time/TIME_PER_GRID) * GRID_SIZE)]

        this.songsToRender.push({
            "pos": pos,
            "songName": songName
        })



        if (parent_pos != null) {
            this.context.lineWidth = 2
            this.context.strokeStyle =  '#ffffff'
            this.context.beginPath()
            this.context.moveTo(pos[0], pos[1])
            this.context.lineTo(parent_pos[0], parent_pos[1])
            this.context.stroke()
        }

        return pos
    }

    render_connections(current_song , xmult=0.5, parent_pos=null) {

        console.log(current_song)
        const current_pos = this.render_connection(current_song, this.songs.data[current_song]["time"], xmult, parent_pos)
        const children_length = this.songs.data[current_song]["children"].length

       this.depth = Math.max(this.depth, this.songs.data[current_song]["time"]/TIME_PER_GRID + 1)

        if (children_length == 0) {
            return
        }

        

        for (let i = 0; i < children_length; i++) {
            const children = this.songs.data[current_song]["children"][i]
            this.render_connections(children , 0.5/children_length + (i * 1/children_length), current_pos)
        }


        
    }

    render_title() {
        this.context.fillStyle = "rgb(255, 153, 1)"
        this.context.font = "bold 50px sans-serif"; 
        this.context.fillText("Genealogy and Evolution of the Triggerman Beat",canvas.width/2,canvas.height/2 - TITLE_OFFSET);
        this.context.textAlign = "center"
        this.context.textBaseline = "middle";
    }

    draw() {

        this.context.setTransform(1, 0, 0, 1, 0, 0)
        this.context.clearRect(0, 0, canvas.width, canvas.height)

        this.context.scale(devicePixelRatio, devicePixelRatio)

        
        this.context.scale(this.zoom, this.zoom)

        this.context.translate(this.cameraX/this.zoom, this.cameraY/this.zoom)

        this.depth = 0

        this.render_connections("Drag Rap")
        this.create_grid()
        this.create_time_arrow()
        this.render_songs()
        this.render_title()

        if (this.currentSelected != null) {
            this.render_popUp()
        }
        




        
    }   
    
    resize() {

        this.canvas.width = window.innerWidth * devicePixelRatio
        this.canvas.height = window.innerHeight * devicePixelRatio


        this.draw()

    }
}