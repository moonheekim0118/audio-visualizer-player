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

let lineWidth = (WIDTH/bufferLength)*2.5;
let lineHeight;
let x = 0;

function renderFrame(){
    requestAnimationFrame(renderFrame);
    x = 150;
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    for(var i =0; i< bufferLength; i++)
    {
        lineHeight = dataArray[i];
        let r = lineHeight * (20 * (i/bufferLength));
        let g = 200 * (i/bufferLength);
        let b = 0;

        ctx.fillStyle=`rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.moveTo(x, lineHeight-50);
        ctx.lineTo(x, HEIGHT-lineHeight);
        ctx.quadraticCurveTo(450, 250, 500, 300)
        ctx.stroke(); 
        x += 10;
    }
}
audio.addEventListener('play', renderFrame);