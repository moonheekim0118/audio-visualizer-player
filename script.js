const audio = document.getElementById('audio');
let context = new AudioContext();
let src = context.createMediaElementSource(audio);
let analyser = context.createAnalyser();

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;
let ctx = canvas.getContext("2d");

src.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize=256;
let bufferLength = analyser.frequencyBinCount;
let dataArray=new Uint8Array(bufferLength);
console.log(dataArray);
let WIDTH = canvas.width;
let HEIGHT = canvas.height;

let lineHeight;
let x = 0;

function renderFrame(){
    requestAnimationFrame(renderFrame);
    x = 200;
    analyser.getByteFrequencyData(dataArray);
    let grd = ctx.createLinearGradient(0, 0, 1500, 0);
    grd.addColorStop(0, "#7204b1");
    grd.addColorStop(1, "#c483ea");
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = grd;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(200, 400);
    ctx.lineTo(1410,400);
    ctx.stroke(); 
    for(var i =0; i< bufferLength; i++)
    {
        lineHeight = dataArray[i];
        let r = lineHeight * (250 * (i/bufferLength));
        let g = 200 * (i/bufferLength);
        let b = 0;
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
}
audio.addEventListener('play', renderFrame);