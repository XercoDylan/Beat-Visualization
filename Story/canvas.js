const MAX_ZOOM = 15
const MIN_ZOOM = 0.1
const ZOOM_SENSITIVITIY = 0.1
const GRID_SIZE = 250
const LINE_WIDTH = 1000
const TIME_ARROW_OFFSET = 100

export class Canvas {
    constructor(canvas, context, songs) {
        this.context = context
        this.canvas = canvas
        this.songs = songs
        this.dragging = false
        
        this.songsToRender = []

        this.zoom = 1
        this.cameraX = 0
        this.cameraY = 0
        this.depth = 0
        this.currentSongs = {
            
        }


        this.resize()


        window.addEventListener('wheel', (e) => {
            this.scale(e)
        })


        window.addEventListener('resize', () => {
            this.resize()
        })

        window.addEventListener("mousedown", () => {
            this.dragging = true
            canvas.style.cursor = "grab";
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

    render_songs() {
        for (const i in this.songsToRender) {
            const songs = this.songsToRender[i]
            this.context.fillStyle = "white"
            this.context.strokeStyle = "transparent"
            const pos = songs["pos"]
            const songName = songs["songName"]
            this.context.beginPath()
            this.context.arc(pos[0], pos[1], 60, 0, Math.PI * 2)
            this.context.fill()
            this.context.stroke()

            const imageSizeX = 60
            const imageSizeY = 60

         this.context.drawImage(this.songs.data[songName]["image"], pos[0] - imageSizeX/2, pos[1] - imageSizeY/2, imageSizeX, imageSizeY);
        }

        this.songsToRender = []
        
    }

    render_connection(songName, time, xmult, parent_pos) {

        const pos = [(canvas.width/2 - LINE_WIDTH/2) + (LINE_WIDTH * xmult), canvas.height/2 + (time * GRID_SIZE)]

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


        const current_pos = this.render_connection(current_song, this.songs.data[current_song]["time"], xmult, parent_pos)
        const children_length = this.songs.data[current_song]["children"].length

       

        if (children_length == 0) {
            return
        }

        this.depth += 1

        for (let i = 0; i < children_length; i++) {
            const children = this.songs.data[current_song]["children"][i]
            this.render_connections(children , 0.5/children_length + (i * 1/children_length), current_pos)
        }


        
    }

    draw() {

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        
        this.context.scale(this.zoom, this.zoom)

        this.context.translate(this.cameraX/this.zoom, this.cameraY/this.zoom)

        this.depth = 0
        this.render_connections("top1")
        this.create_grid()
        this.create_time_arrow()
        this.render_songs()
        




        
    }   
    
    resize() {

        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.draw()

    }
}