const file = document.getElementById('thefile');
const audio__ = document.getElementById('audio');
const music__container = document.getElementById('music__container');
const playBtn = document.getElementById('play');
const progress__container = document.getElementById('progress');
const progress__bar = document.getElementById('progress__bar');
const current_time = document.getElementById('current_time');
const whole_time = document.getElementById('whole_time');
const title__container = document.getElementById('title__container');

// file 업로드 시, music controller 보여주기 
file.onchange = function(){
    let files = this.files;
    title__container.classList.add('hidden');
    console.log(files);
    if(music__container.classList.contains('play')){
        playBtn.innerHTML=`<i class="fas fa-play"></i>`;
        music__container.classList.remove('play');

    }
    audio__.src= URL.createObjectURL(files[0]);
    audio__.load();
    musicControl(); // 자동 재생 
    music__container.classList.add('show');
    audio__.onloadedmetadata=function(){
        setTime(audio__.duration);
    }
} 

const musicControl = function(){
    music__container.classList.toggle('play');
    if(music__container.classList.contains('play')){
        playBtn.innerHTML=`<i class="fas fa-pause"></i>`;
        audio__.play();
    }else{
        playBtn.innerHTML=`<i class="fas fa-play"></i>`;
        audio__.pause();
    }
}

// progress bar 업데이트 
const updateProgress=function(e){
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime/duration)*100;
    progress__bar.style.width=`${progressPercent}%`;
    //width 업데이트    

    // 현재 시각 구하기 
    let currentSec = Math.floor(currentTime)%60;
    let currentMin = Math.floor((currentTime-currentSec)/60);
    let fill='';
    if(currentSec.toString().length === 1){
        fill='0';
    }
    current_time.innerText=`${currentMin}:${fill}${currentSec}`;

}

// prgoress 조정 시 해당 시간으로 넘겨주기 
const setProgress=function(e){
    const width=  this.clientWidth; // progress bar 전체 width
    const clickX= e.offsetX; // progress bar에서 눌린 위치
    const nowTime = (clickX/width)*audio__.duration;
    audio__.currentTime=nowTime;
}

// 전체 time 지정 
const setTime=function(duration){
    const wholeMin = Math.floor(duration/60);
    const wholeSec = Math.floor(duration)%60;
    let fill='';
    if(wholeSec.toString().length===1){
        fill='0';
    }
    whole_time.innerText=`${wholeMin}:${fill}${wholeSec}`;
}


audio__.addEventListener('timeupdate',updateProgress);
playBtn.addEventListener('click',musicControl);
progress__container.addEventListener('click',setProgress);