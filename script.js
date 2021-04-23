/* ------ JavaScript - HTML Canvas Particles - Wireframe Text Animation Part 1 ------ */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d'); // ctx is short for context.
ctx.canvas.width = window.innerWidth; // setting window width.
ctx.canvas.height = window.innerHeight; // setting window height.
let particleArray = [];
let adjustX = 45; // this will move the particle text across the screen in X.
let adjustY = 17; // this will move the particle text up and down the screen in Y.

// handle mouse interactions
const mouse = {
    x: null,
    y: null,
    radius: 150 // this adjusts the size of the mouse's influence effecting the particles.
}
// event listener
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});
ctx.fillStyle = 'white';
ctx.font = '30px sans-serif';
ctx.fillText('Ouch!', 0, 30); // The A, is where the text input is written in, 0 = x and 40 = y coordinates.
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

// This is the blueprint to create particles.
class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
    }
    draw(){
        ctx.fillStyle = 'white'; // fill color control.
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.shadowColor = '#525252'; // particle shadow colour #192436.
        ctx.shadowBlur = 20; // particle shadow blur.
        ctx.shadowOffsetX = 10; // particle shadow X offset.
        ctx.shadowOffsetY = 10; // particle shadow Y offset.
        ctx.fill();
    }
    // calculate the distance between x and y points.
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy); // Pythageros therum to find the sum of the square of the hypotonus.
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;


        if (distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}
// init function uses the blueprint to fill particles.
function init() {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 15, positionY * 15)); // adjust the positionX and PosY values to scale particle text.
            }
        }
    }
    
}
init();
// This is the animation loop, redrawing particles to the canvas.
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate); // the recursive loop.
}
animate();

function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - (distance/75); // the higher this divisional value is the less opacity is applied.
            ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';

            if (distance < 25){ // try different numbers here for the best results...warning, keep them lower the more letters you want to display.

                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();

            }
        }
    }
}

