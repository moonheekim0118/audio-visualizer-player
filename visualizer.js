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
    let x = 0;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    x = WIDTH/7;
    analyser.getByteFrequencyData(dataArray);
    const grd = ctx.createLinearGradient(0, 0, WIDTH, 0);
    grd.addColorStop(0, "#7204b1");
    grd.addColorStop(1, "#c483ea");
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = grd;
    ctx.globalAlpha = 0.5;
    let half = bufferLength/2;
    const gap = x / 20;
    for(let i = half-1; i>= 0 ; i --){
        lineHeight = dataArray[i];
        ctx.beginPath();
        if(i%2==0){
            lineHeight+=400;
        }else{
            lineHeight= 400-lineHeight;
        }
        ctx.quadraticCurveTo(x, 400, x, lineHeight)
        ctx.stroke(); 
        ctx.strokeStyle = '#fff';
        x+=gap;
    }
    for(let i =half; i< bufferLength; i++)
    {
        lineHeight = dataArray[i];
        ctx.beginPath();
        if(i%2!==0){
            lineHeight+=400;
        }else{
            lineHeight= 400-lineHeight;
        }
        ctx.quadraticCurveTo(x, 400, x, lineHeight)
        ctx.stroke(); 
        ctx.strokeStyle = '#fff';
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