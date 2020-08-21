const file = document.getElementById('thefile');
const audio__ = document.getElementById('audio');
const music__container = document.getElementById('music__container');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progress__container = document.getElementById('progress');
const progress__bar = document.getElementById('progress__bar');
const current_time = document.getElementById('current_time');
const whole_time = document.getElementById('whole_time');
const title__container = document.getElementById('title__container');
const file_uploader = document.getElementById('file_uploader');
const playlist__container = document.getElementById('playlist__container');
const playlist = [] ; 
const song_names=[];
const song__container = document.getElementById('songs');
let list_song=[];
let song_index = 0;
// file 업로드 시, music controller 보여주기 


// 파일 업로드 
file.onchange = function(){
    let files = this.files;
    const filteredName = files[0].name.replace('.mp3','');
    playlist.push(URL.createObjectURL(files[0])); // 업로드된 file src 저장
    song_names.push(filteredName); // 업로드된 file name 저장
    title__container.classList.add('hidden');
    playlist__container.classList.add('show');
    file_uploader.innerText='Complete your playlist!';
    music__container.classList.add('show');
    if(song_index===0){ // 최초의 파일이라면 파일 업로드됨과 함께 load 해주기
        loadMusic();
    }
    drawPlaylist();
} 

// playlist 그리기 
const drawPlaylist=function(){
    song__container.innerHTML='';
    song_names.forEach((song, idx)=>{
        let newSong;
        if(idx === song_index-1){ // 현재 재생중인 곡이라면 
            newSong = `<span class="song playing" id="song">${song}</span>`;
        } else{
            newSong = `<span class="song" id="song">${song}</span>`;
        }
        song__container.innerHTML+= newSong
    })   
    list_song=document.querySelectorAll('.song');
    songsEventListeners();
}

const songsEventListeners=function(){
    list_song.forEach(song=>{
        song.addEventListener('click',selectSong);
    })
}

const loadMusic= function(){
    audio__.src=playlist[song_index++];
    audio__.load();
    musicControl();
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

// 다음 song으로 넘어가기 
const nextSong=function(){
    if(song_index === playlist.length){
        song_index=0;
    }
    loadMusic();
    drawPlaylist();
    musicControl(); // 다음 곡 자동 재생 
}


// 이전 song으로 넘기기
const prevSong = function(){
    if(song_index === 0 || song_index==1){
        song_index = playlist.length-1;
    }else{
        song_index-=2;
    }
    console.log(song_index);
    loadMusic();
    drawPlaylist();
    musicControl();
}

// play list에서 특정 song을 클릭하면 해당 song을 재생해준다.
const selectSong=function(e){
    const targetSong= e.target.innerText;
    const targetIdx = song_names.indexOf(targetSong);
    song_index=targetIdx;
    loadMusic();
    drawPlaylist();
    musicControl();
    // song name에서 해당 song의 인덱스를 찾아준다.
    // 해당 인덱스를 현재 인덱스로 변경해준다.   
}

audio__.addEventListener('timeupdate',updateProgress);
audio__.addEventListener('ended',nextSong);
nextBtn.addEventListener('click',nextSong);
prevBtn.addEventListener('click',prevSong);
playBtn.addEventListener('click',musicControl);
progress__container.addEventListener('click',setProgress);