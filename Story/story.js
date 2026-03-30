const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

let cameraX = 0
let cameraY = 0
let cameraZoom = 1
const MAX_ZOOM = 15
const MIN_ZOOM = 0.1
const ZOOM_SENSITIVITIY = 0.1

let isDragging = false
let dragStartX = 0
let dragStartY = 0

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    draw()
}


function draw() {

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.translate(cameraX, cameraY);
    context.scale(cameraZoom, cameraZoom);

    context.stroke();

    context.fillStyle = "white";
    context.strokeStyle = "transparent";
    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, 60, 0, Math.PI * 2);
    context.fill();
}


canvas.addEventListener('wheel', function(e) {
    const zoomAmount = e.deltaY < 0 ? 1 + ZOOM_SENSITIVITIY : 1 - ZOOM_SENSITIVITIY;
    let newZoom = cameraZoom * zoomAmount;

    newZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);


    const mouseWorldX = (e.clientX - cameraX) / cameraZoom;
    const mouseWorldY = (e.clientY - cameraY) / cameraZoom;


    cameraZoom = newZoom;


    cameraX = e.clientX - (mouseWorldX * cameraZoom);
    cameraY = e.clientY - (mouseWorldY * cameraZoom);

    draw()
})


canvas.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragStartX = e.clientX - cameraX;
    dragStartY = e.clientY - cameraY;
    canvas.style.cursor = "grabbing";
});

window.addEventListener('mousemove', function(e) {
    if (isDragging) {
        cameraX = e.clientX - dragStartX;
        cameraY = e.clientY - dragStartY;
        draw(); 
    }
});

window.addEventListener('mouseup', function() {
    isDragging = false;
    canvas.style.cursor = "grab";
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();