const file = document.getElementById('thefile');
const audio__ = document.getElementById('audio');
const music__container = document.getElementById('music__container');
const playBtn = document.getElementById('play');
const progress__container = document.getElementById('progress');
const progress__bar = document.getElementById('progress__bar');
// file 업로드 시, music controller 보여주기 
file.onchange = function(){
    let files = this.files;
    console.log(files);
    if(music__container.classList.contains('play')){
        playBtn.innerHTML=`<i class="fas fa-play"></i>`;
        music__container.classList.remove('play');

    }
    audio__.src= URL.createObjectURL(files[0]);
    audio__.load();
    music__container.classList.add('show');
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
}

const setProgress=function(e){
    const width=  this.clientWidth; // progress bar 전체 width
    const clickX= e.offsetX; // progress bar에서 눌린 위치
    const nowTime = (clickX/width)*audio__.duration;
    audio__.currentTime=nowTime;
}

audio__.addEventListener('timeupdate',updateProgress);
playBtn.addEventListener('click',musicControl);
progress__container.addEventListener('click',setProgress);