import { Canvas } from "./canvas.js"
import { Songs } from "./songs.js"

const canvas_element = document.getElementById("canvas")
const context = canvas_element.getContext('2d')
const songs = new Songs()
const canvas = new Canvas(canvas_element, context, songs)