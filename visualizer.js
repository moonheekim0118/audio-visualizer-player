const audio = document.getElementById('audio');
const context = new AudioContext();
const src = context.createMediaElementSource(audio);
const analyser = context.createAnalyser();

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;
src.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize=256;
const bufferLength = analyser.frequencyBinCount;
const dataArray=new Uint8Array(bufferLength);

function renderFrame(){
    requestAnimationFrame(renderFrame);
    let lineHeight;
    let lineWidth;
    let x = 0;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    x = WIDTH/7;
    analyser.getByteFrequencyData(dataArray);
    let grd = ctx.createLinearGradient(0, 0, WIDTH, 0);
    grd.addColorStop(0, "#7204b1");
    grd.addColorStop(1, "#c483ea");
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = grd;
    ctx.globalAlpha = 0.5;
    let half = bufferLength/2;
    const gap = x / 18;
    for(let i = half-22; i>= 0 ; i --){
        lineHeight = dataArray[i];
        lineWidth=( (lineHeight+WIDTH)/bufferLength);
        const r = 100 * (i/bufferLength);
        const g = 255;
        const b =  lineHeight + (250 * (i/bufferLength));
        ctx.beginPath();
        if(i%2==0){
            lineHeight+=400;
        }else{
            lineHeight= 400-lineHeight;
        }
        ctx.quadraticCurveTo(x, 400, x, lineHeight)
        ctx.lineWidth = lineWidth;
        ctx.stroke(); 
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        x+=gap;
    }
    for(let i =half-21; i< bufferLength; i++)
    {
        lineHeight = dataArray[i];
        lineWidth=( (lineHeight+WIDTH)/bufferLength);
        const r = lineHeight + (250 * (i/bufferLength));
        const g = 255;
        const b =250 * (i/bufferLength);
        ctx.beginPath();
        if(i%2==0){
            lineHeight+=400;
        }else{
            lineHeight= 400-lineHeight;
        }
        ctx.quadraticCurveTo(x, 400, x, lineHeight);
        ctx.lineWidth = lineWidth;
        ctx.stroke(); 
        ctx.strokeStyle =`rgb(${r},${g},${b})`;
        x+=gap;
    }

}

const redrawing = function(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height= window.innerHeight;
}
audio.addEventListener('play', renderFrame);

window.addEventListener('resize',redrawing);