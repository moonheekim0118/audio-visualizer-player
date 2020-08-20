const audio = document.getElementById('audio');
const context = new AudioContext();
const src = context.createMediaElementSource(audio);
const analyser = context.createAnalyser();

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;
let ctx = canvas.getContext("2d");

src.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize=256;
const bufferLength = analyser.frequencyBinCount;
const dataArray=new Uint8Array(bufferLength);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let lineHeight;
let x = 0;


function renderFrame(){
    requestAnimationFrame(renderFrame);
    x = 200;
    analyser.getByteFrequencyData(dataArray);
    const grd = ctx.createLinearGradient(0, 0, 1700, 0);
    grd.addColorStop(0, "#7204b1");
    grd.addColorStop(1, "#c483ea");
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = grd;
    ctx.globalAlpha = 0.5;
    let half = bufferLength/2;
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
        x+=12;
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
        x+=12;
    }

}
audio.addEventListener('play', renderFrame);