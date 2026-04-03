const MAX_ZOOM = 15
const MIN_ZOOM = 0.1
const ZOOM_SENSITIVITIY = 0.1
const GRID_SIZE = 250
const LINE_WIDTH = 1000
const TIME_ARROW_OFFSET = 100
const TIME_OFFSET = 50
const START_TIME = 1985
const TITLE_OFFSET = 150
const VERTEX_RADIUS = 60
const TIME_PER_GRID = 5
const POPUP_W = 500
const POPUP_H = 380
const POPUP_ARROW_GAP = 50
const POPUP_PAD = 20

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

        // Check if X (close) button was clicked on the open popup
        if (this.currentSelected) {
            const pos = this.currentSelected[1]
            const boxX = pos[0] + VERTEX_RADIUS + POPUP_ARROW_GAP
            const boxTop = pos[1] - POPUP_H / 2
            const closeX = boxX + POPUP_W - POPUP_PAD
            const closeY = boxTop + POPUP_PAD
            if (((x - closeX) ** 2 + (y - closeY) ** 2) ** 0.5 <= 12) {
                this.currentSelected = null
                this.draw()
                return
            }
        }

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

    wrapText(text, x, y, maxWidth, lineHeight) {
        if (!text) return
        const words = text.split(' ')
        let line = ''
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' '
            const metrics = this.context.measureText(testLine)
            if (metrics.width > maxWidth && i > 0) {
                this.context.fillText(line, x, y)
                line = words[i] + ' '
                y += lineHeight
            } else {
                line = testLine
            }
        }
        this.context.fillText(line, x, y)
    }

    render_popUp() {
        const songName = this.currentSelected[0]
        const songData = this.songs.data[songName]
        const pos = this.currentSelected[1]

        const boxX = pos[0] + VERTEX_RADIUS + POPUP_ARROW_GAP
        const boxTop = pos[1] - POPUP_H / 2
        const boxBottom = pos[1] + POPUP_H / 2

        // Popup shape with arrow pointer
        this.context.fillStyle = "rgb(255, 255, 255)"
        this.context.lineWidth = 2
        this.context.strokeStyle = '#000000'
        this.context.beginPath()
        this.context.moveTo(pos[0] + VERTEX_RADIUS, pos[1])
        this.context.lineTo(boxX, pos[1] + 30)
        this.context.lineTo(boxX, boxBottom)
        this.context.lineTo(boxX + POPUP_W, boxBottom)
        this.context.lineTo(boxX + POPUP_W, boxTop)
        this.context.lineTo(boxX, boxTop)
        this.context.lineTo(boxX, pos[1] - 30)
        this.context.lineTo(pos[0] + VERTEX_RADIUS, pos[1])
        this.context.fill()
        this.context.stroke()

        // Close (X) button
        const closeX = boxX + POPUP_W - POPUP_PAD
        const closeY = boxTop + POPUP_PAD
        this.context.fillStyle = '#ff0000'
        this.context.beginPath()
        this.context.arc(closeX, closeY, 12, 0, Math.PI * 2)
        this.context.fill()
        this.context.stroke()
        this.context.fillStyle = "white"
        this.context.font = "bold 13px Roboto"
        this.context.textAlign = "center"
        this.context.textBaseline = "middle"
        this.context.fillText("X", closeX, closeY)

        // Album image (top right)
        const imgSize = 80
        const imgX = boxX + POPUP_W - POPUP_PAD - imgSize
        const imgY = boxTop + POPUP_PAD + 30
        this.context.drawImage(songData["image"], imgX, imgY, imgSize, imgSize)

        // Song name
        this.context.fillStyle = "black"
        this.context.font = "bold 22px Roboto"
        this.context.textAlign = "left"
        this.context.textBaseline = "top"
        this.context.fillText(songName, boxX + POPUP_PAD, boxTop + POPUP_PAD)

        // Year
        this.context.font = "16px Roboto"
        this.context.fillStyle = "#555555"
        this.context.fillText(String(songData["year"]), boxX + POPUP_PAD, boxTop + POPUP_PAD + 32)

        // Description (starts below the image area)
        this.context.font = "13px Roboto"
        this.context.fillStyle = "#222222"
        this.wrapText(
            songData["description"] || "",
            boxX + POPUP_PAD,
            boxTop + POPUP_PAD + 120,
            POPUP_W - POPUP_PAD * 2,
            19
        )
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

    countLeaves(songName) {
        const children = this.songs.data[songName]["children"]
        if (children.length === 0) return 1
        return children.reduce((sum, child) => sum + this.countLeaves(child), 0)
    }

    render_connection(songName, time, xmult, parent_pos) {

        const pos = [
            (canvas.width/2 - LINE_WIDTH/2) + (LINE_WIDTH * xmult),
            canvas.height/2 + ((time/TIME_PER_GRID) * GRID_SIZE)
        ]

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

    render_connections(current_song, xmin=0, xmax=1, parent_pos=null) {

        const xmult = (xmin + xmax) / 2
        const current_pos = this.render_connection(current_song, this.songs.data[current_song]["time"], xmult, parent_pos)
        const children = this.songs.data[current_song]["children"]

        this.depth = Math.max(this.depth, this.songs.data[current_song]["time"]/TIME_PER_GRID + 1)

        if (children.length === 0) return

        const totalLeaves = children.reduce((sum, child) => sum + this.countLeaves(child), 0)
        let cursor = xmin

        for (const child of children) {
            const leaves = this.countLeaves(child)
            const childXmax = cursor + (xmax - xmin) * leaves / totalLeaves
            this.render_connections(child, cursor, childXmax, current_pos)
            cursor = childXmax
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
