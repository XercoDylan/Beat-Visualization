const MAX_ZOOM = 15
const MIN_ZOOM = 0.1
const ZOOM_SENSITIVITIY = 0.1
const GRID_SIZE = 250
const LINE_WIDTH = 1200
const TIME_ARROW_OFFSET = 100
const TIME_OFFSET = 50
const START_TIME = 1985
const TITLE_OFFSET = 150
const VERTEX_RADIUS = 60
const TIME_PER_GRID = 4
const POPUP_W = 500
const POPUP_H = 360
const POPUP_ARROW_GAP = 50
const POPUP_PAD = 20

const GEOGRAPHY = {
    "New York":    0.08,
    "Memphis":     0.28,
    "New Orleans": 0.50,
    "Baton Rouge": 0.72,
    "Houston":     0.92,
}

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
        this.currentSongs = {}

        this.currentAudio = null
        this.isPlaying = false
        this.playButtonPos = null

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

        if (this.currentSelected) {
            const pos = this.currentSelected[1]
            const boxX = pos[0] + VERTEX_RADIUS + POPUP_ARROW_GAP
            const boxTop = pos[1] - POPUP_H / 2
            const closeX = boxX + POPUP_W - POPUP_PAD
            const closeY = boxTop + POPUP_PAD
            if (((x - closeX) ** 2 + (y - closeY) ** 2) ** 0.5 <= 12) {
                this.currentSelected = null
                if (this.currentAudio) {
                    this.currentAudio.pause()
                    this.isPlaying = false
                }
                this.draw()
                return
            }

            if (this.playButtonPos) {
                const [btnX, btnY] = this.playButtonPos
                if (((x - btnX) ** 2 + (y - btnY) ** 2) ** 0.5 <= 22) {
                    if (this.isPlaying) {
                        this.currentAudio.pause()
                        this.isPlaying = false
                    } else {
                        this.currentAudio.play()
                        this.isPlaying = true
                    }
                    this.draw()
                    return
                }
            }
        }

        for (const songName in this.songsPostions) {
            const songPos = this.songsPostions[songName]
            const distance = ((x - songPos[0])**2 + (y - songPos[1])**2)**0.5

            if (distance <= VERTEX_RADIUS) {
                if (this.currentSelected?.[0] !== songName) {
                    if (this.currentAudio) {
                        this.currentAudio.pause()
                        this.isPlaying = false
                    }
                    const audioPath = this.songs.data[songName]["audio"]
                    this.currentAudio = audioPath ? new Audio(audioPath) : null
                    if (this.currentAudio) {
                        this.currentAudio.addEventListener('ended', () => {
                            this.isPlaying = false
                            this.draw()
                        })
                    }
                }
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
        this.context.strokeStyle = '#ffffff'

        for (let i = 0; i <= this.depth; i++) {
            this.context.beginPath()
            this.context.moveTo(withStart, startY + (GRID_SIZE * i))
            this.context.lineTo(withStart + LINE_WIDTH, startY + (GRID_SIZE * i))
            this.context.stroke()

            this.context.fillStyle = "white"
            this.context.font = "20px Roboto";
            this.context.fillText(START_TIME + (i * TIME_PER_GRID), withStart - TIME_OFFSET, startY + (GRID_SIZE * i));
            this.context.textAlign = "center"
            this.context.textBaseline = "middle";
        }
    }

    render_geography() {
        const startY = this.canvas.height / 2
        const gridBottom = startY + GRID_SIZE * this.depth
        const startX = this.canvas.width / 2 - LINE_WIDTH / 2

        for (const [city, xmult] of Object.entries(GEOGRAPHY)) {
            const x = startX + LINE_WIDTH * xmult

            this.context.strokeStyle = 'rgba(255,255,255,0.15)'
            this.context.lineWidth = 1
            this.context.setLineDash([6, 10])
            this.context.beginPath()
            this.context.moveTo(x, startY)
            this.context.lineTo(x, gridBottom)
            this.context.stroke()
            this.context.setLineDash([])

            this.context.fillStyle = 'rgba(255,255,255,0.75)'
            this.context.font = 'bold 20px Roboto'
            this.context.textAlign = 'center'
            this.context.textBaseline = 'bottom'
            this.context.fillText(city, x, startY - 15)
        }
    }

    create_time_arrow() {
        this.context.beginPath()
        this.context.lineWidth = 10
        this.context.strokeStyle = '#ffffff'
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

        const imgSize = 80
        const imgX = boxX + POPUP_W - POPUP_PAD - imgSize
        const imgY = boxTop + POPUP_PAD + 30
        this.context.drawImage(songData["image"], imgX, imgY, imgSize, imgSize)

        this.context.fillStyle = "black"
        this.context.font = "bold 22px Roboto"
        this.context.textAlign = "left"
        this.context.textBaseline = "top"
        this.context.fillText(songName, boxX + POPUP_PAD, boxTop + POPUP_PAD)

        this.context.font = "italic 16px Roboto"
        this.context.fillStyle = "#333333"
        this.context.fillText(songData["artist"] || "", boxX + POPUP_PAD, boxTop + POPUP_PAD + 32)

        this.context.font = "16px Roboto"
        this.context.fillStyle = "#555555"
        this.context.fillText(String(songData["year"]), boxX + POPUP_PAD, boxTop + POPUP_PAD + 55)

        this.context.font = "13px Roboto"
        this.context.fillStyle = "#222222"
        this.wrapText(
            songData["description"] || "",
            boxX + POPUP_PAD,
            boxTop + POPUP_PAD + 140,
            POPUP_W - POPUP_PAD * 2,
            19
        )

        const btnX = imgX - POPUP_PAD - 22
        const btnY = imgY + imgSize / 2
        this.playButtonPos = [btnX, btnY]

        this.context.fillStyle = 'rgb(255,153,1)'
        this.context.beginPath()
        this.context.arc(btnX, btnY, 22, 0, Math.PI * 2)
        this.context.fill()

        this.context.fillStyle = 'white'
        if (this.isPlaying) {
            this.context.fillRect(btnX - 9, btnY - 10, 6, 20)
            this.context.fillRect(btnX + 3, btnY - 10, 6, 20)
        } else {
            this.context.beginPath()
            this.context.moveTo(btnX - 7, btnY - 11)
            this.context.lineTo(btnX + 13, btnY)
            this.context.lineTo(btnX - 7, btnY + 11)
            this.context.closePath()
            this.context.fill()
        }
    }

    render_songs() {
        for (const i in this.songsToRender) {
            const songs = this.songsToRender[i]
            const pos = songs["pos"]
            const songName = songs["songName"]

            if (this.currentSelected != null && this.currentSelected[0] == songName) {
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
            this.context.fillText(songName, pos[0], pos[1] + 80)
            this.context.textAlign = "center"
            this.context.textBaseline = "middle"

            this.songsPostions[songName] = pos
        }

        this.songsToRender = []
    }

    render_connection(songName, parent_pos) {
        const songData = this.songs.data[songName]
        const xmult = GEOGRAPHY[songData["city"]] ?? 0.5
        const xOffset = this.songXOffsets?.[songName] ?? 0

        const pos = [
            (canvas.width/2 - LINE_WIDTH/2) + (LINE_WIDTH * xmult) + xOffset,
            canvas.height/2 + ((songData["time"]/TIME_PER_GRID) * GRID_SIZE)
        ]

        this.songsPostions[songName] = pos

        this.songsToRender.push({
            "pos": pos,
            "songName": songName
        })

        if (parent_pos != null) {
            this.context.lineWidth = 2
            this.context.strokeStyle = '#ffffff'
            this.context.beginPath()
            this.context.moveTo(pos[0], pos[1])
            this.context.lineTo(parent_pos[0], parent_pos[1])
            this.context.stroke()
        }

        return pos
    }

    render_connections(current_song, parent_pos=null) {
        if (this.songsPostions[current_song]) {
            const existing_pos = this.songsPostions[current_song]
            if (parent_pos != null) {
                this.context.lineWidth = 2
                this.context.strokeStyle = '#ffffff'
                this.context.beginPath()
                this.context.moveTo(existing_pos[0], existing_pos[1])
                this.context.lineTo(parent_pos[0], parent_pos[1])
                this.context.stroke()
            }
            return
        }

        const current_pos = this.render_connection(current_song, parent_pos)
        const children = this.songs.data[current_song]["children"]

        this.depth = Math.max(this.depth, this.songs.data[current_song]["time"]/TIME_PER_GRID + 1)

        for (const child of children) {
            this.render_connections(child, current_pos)
        }
    }

    render_title() {
        this.context.fillStyle = "rgb(255, 153, 1)"
        this.context.font = "bold 50px sans-serif";
        this.context.fillText("Genealogy and Evolution of the Triggerman Beat", canvas.width/2, canvas.height/2 - TITLE_OFFSET);
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
        this.songsPostions = {}

        const cityGroups = {}
        for (const songName in this.songs.data) {
            const city = this.songs.data[songName]["city"]
            if (!cityGroups[city]) cityGroups[city] = []
            cityGroups[city].push(songName)
        }
        this.songXOffsets = {}
        for (const city in cityGroups) {
            const sorted = [...cityGroups[city]].sort((a, b) =>
                this.songs.data[a]["time"] - this.songs.data[b]["time"]
            )
            const n = sorted.length
            sorted.forEach((name, i) => {
                this.songXOffsets[name] = n > 1 ? (i / (n - 1) - 0.5) * 120 : 0
            })
        }

        this.render_connections("Drag Rap")
        this.render_geography()
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
