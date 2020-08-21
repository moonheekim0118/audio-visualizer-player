
window.onload=function(){
    const file = document.getElementById('thefile'); // 파일 
    const audio__ = document.getElementById('audio'); // 오디오 
    const music__container = document.getElementById('music__container'); // music container 
    const playBtn = document.getElementById('play'); // play 버튼 
    const nextBtn = document.getElementById('next'); // next 버튼 
    const prevBtn = document.getElementById('prev'); // prev 버튼 
    const progress__container = document.getElementById('progress'); // progress bar감싸는 컨테이너 
    const progress__bar = document.getElementById('progress__bar'); // progress bar 
    const current_time = document.getElementById('current_time'); // 현재 시간 넣어줄 자리 
    const whole_time = document.getElementById('whole_time'); // 전체 시간 넣어줄 자리 
    const title__container = document.getElementById('title__container'); //메인 타이틀 
    const file_uploader = document.getElementById('file_uploader'); // 파일 업로드 컨테이너  
    const playlist__container = document.getElementById('playlist__container'); // 플레이리스트 컨테이너 
    const editBtn = document.getElementById('edit__list'); // 플레이리스트 edit 버튼 
    const show__playList=document.getElementById('more__btn');
    const song__container = document.getElementById('songs');  // 플레이리스트 내 songs 컨테이너 
    let playlist = [] ;  // song url 담기 
    let song_names=[]; // song title 담기 
    let list_song=[]; //  playlist 내 song 담기 
    let removeBtn=[]; // remove buttons 담기 
    let song_index = 0; // 현재 재생할 song index 
    

    // 파일 업로드 
    file.onchange = function(){
        let files = this.files;
        const filteredName = files[0].name.replace('.mp3','');
        if(song_names.indexOf(filteredName)!==-1){ // 중복 방지 
            return false;
        }
        playlist.push(URL.createObjectURL(files[0])); // 업로드된 file src 저장
        song_names.push(filteredName); // 업로드된 file name 저장
        title__container.classList.add('hidden');
        playlist__container.classList.add('show');
        show__playList.classList.add('show');
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
        if(editBtn.classList.contains('editmode')){
            editBtn.classList.remove('editmode');
        }
        song_names.forEach((song, idx)=>{
            let newSong;
            if(idx === song_index-1){ // 현재 재생중인 곡이라면 
                newSong = `<div class="playlist__detail"><span class="song playing" id="song">${song}</span><i class="fas fa-trash-alt remove__song" id="remove__song"></i>
                <div id="song__idx" class="song__idx">${idx}</div>
                </div>
                `;
            } else{
                newSong = `<div class="playlist__detail"><span class="song" id="song">${song}</span><i class="fas fa-trash-alt remove__song" id="remove__song"></i>
                <div id="song__idx" class="song__idx">${idx}</div>
                </div>`;
            }
            song__container.innerHTML+= newSong
        })   
        list_song=document.querySelectorAll('.song'); // 플레이리스트 갱신 될 때마다 song Element이벤트 추가 
        songsEventListeners();
    }

    const songsEventListeners=function(){ // 여러개의 event listeners 추가 
        list_song.forEach(song=>{
            song.addEventListener('click',selectSong);
        })
    }

    // audio에 재생할 소스 넣고, 시간 set 해주기 
    const loadMusic= function(){ 
        audio__.src=playlist[song_index++];
        audio__.load();
        musicControl();
        audio__.onloadedmetadata=function(){
            setTime(audio__.duration);
        }
    }

    // 재생 토글 
    const musicControl = function(){
        if(playlist.length===0){ // 모두 삭제된 경우라면 ? 
            audio__.pause(); // audio 중지 
            playBtn.innerHTML=`<i class="fas fa-play"></i>`; // 플레이 버튼으로 바꾸기 
            if(music__container.classList.contains('play')){ // 현재 play 중이라면 
                music__container.classList.remove('play'); // play 삭제 
            }
            return false; 
        }
        music__container.classList.toggle('play'); // 컨테이너 토글 
        if(music__container.classList.contains('play')){ //  play 중이라면 
            playBtn.innerHTML=`<i class="fas fa-pause"></i>`; // 버튼 바꾸고 오디오 play
            audio__.play(); 
        }else{
            playBtn.innerHTML=`<i class="fas fa-play"></i>`; // pause 이라면 버튼 바꾸고 오디오 pause
            audio__.pause();
        }
    }

    // progress bar 업데이트 
    const updateProgress=function(e){
        // progress bar width 업데이트    
        const {duration, currentTime} = e.srcElement;
        const progressPercent = (currentTime/duration)*100;
        progress__bar.style.width=`${progressPercent}%`;


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
        // 재생중 아닌 상태에서 재생중인 음악 변경시 바로 재생
        if(!music__container.classList.contains('play')){ 
            musicControl();
        }
        // song name에서 해당 song의 인덱스를 찾아준다.
        // 해당 인덱스를 현재 인덱스로 변경해준다.   
    }

    // edit mode 설정 
    const editMode = function(){
        editBtn.classList.toggle('editmode');
        removeBtn = document.querySelectorAll('.remove__song');
        if(editBtn.classList.contains('editmode')){
            removeBtn.forEach(btn=>{
                btn.classList.add('editmode');
                btn.addEventListener('click',removeSong);
        })
        }else{
            removeBtn.forEach(btn=>{
                btn.classList.remove('editmode');
        })
        }
    }

        // 특정 song 삭제
    const removeSong=function(e){
        const idx = +e.target.parentNode.children[2].innerText; // 인덱스에 해당하는 song name, playlist 삭제
        let tmp=[];
        tmp = playlist.filter((song,i)=>{
            return i!==idx;
        })
        playlist = tmp;
        tmp = song_names.filter((song,i)=>{
            console.log(i);
            return i!==idx;
        })
        song_names=tmp;
        if(playlist.length === 0){ // 마지막 곡이었다면 
            song_index=0;
            musicControl();
        } else{ // 마지막곡이 아니라면 
            song_index--; // 인덱스 줄여주기 
            nextSong(); // 다음 곡으로 넘기기 
        }
        drawPlaylist(); // 플레이리스트 다시 그리기 
    }

    const mobilePlayer=function(){
        show__playList.classList.toggle('player');
        if(show__playList.classList.contains('player')){
            playlist__container.classList.add('mobile');
        }
        else{
            playlist__container.classList.remove('mobile');
        }
    }

    const closeMobileVersion=function(){
        if(window.innerWidth >1100){
            playlist__container.classList.remove('mobile');
        }
    }

    const init = function(){ // event listners
        audio__.addEventListener('timeupdate',updateProgress);
        audio__.addEventListener('ended',nextSong);
        nextBtn.addEventListener('click',nextSong);
        prevBtn.addEventListener('click',prevSong);
        playBtn.addEventListener('click',musicControl);
        progress__container.addEventListener('click',setProgress);
        editBtn.addEventListener('click',editMode);
        show__playList.addEventListener('click',mobilePlayer);
        window.addEventListener('resize',closeMobileVersion);
    }
    init(); // 이벤트 리스너 불러오기 

}
