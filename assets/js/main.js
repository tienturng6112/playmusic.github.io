const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdthumd = $(".cd-thumb");
const layer = $(".player")
const audio = $("#audio");
const playbtn = $(".btn-toggle-play");
const cd = $(".cd");
const progress = $("#progress");
const nextbtn = $(".btn-next");
const prewbtn = $(".btn-prev");
const randombtn = $(".btn-random");
const repeatbtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    isfalse:false,
    isrepeat:false,
    israndom:false,
    currentIndex:0,
    isplaying:false,
    songs: [
        {
            name: "Dynasty",
            singer: "...",
            path: "./assets/mp3/dynasty.mp3",
            image: "./assets/img/dynasty.jpg",
        },
        {
            name: "A Dream Of A Thousand Nights",
            singer: "...",
            path: "./assets/mp3/ifyousuddentthink.mp3",
            image: "./assets/img/A Dream Of A Thousand Nights.jpeg",
        },
        {
            name: "If you suddenly think of me",
            singer: "...",
            path: "./assets/mp3/14char.mp3",
            image: "./assets/img/14char.jpg",
        },
        {
            name: "If you suddenly think of me",
            singer: "...",
            path: "https://www.youtube.com/watch?v=11R3H8kackA&list=RD210KOHIR2_w&index=2",
            image: "./assets/img/man-doing-Calisthenics-outdoors.webp",
        },
        
    ],
    render: function() {
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        }
        );
        playlist.innerHTML = htmls.join("");
    },
    //dinh nghia cac thuoc tinh
    defineProperties: function(){
        Object.defineProperty(this, "currentSong",{
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        // danh dong luoc thu nho cd
        const cdwidth = cd.offsetWidth;
        document.onscroll = function(){
            const srollTop = window.scrollY;
            const newCdWidth = cdwidth - srollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdwidth;
            
        };

        
        const playcdthub = cdthumd.animate(
            [
              // keyframes
              { transform: "rotate(360deg)" },
            ],
            {
              // timing options
              duration: 10000,
              iterations: Infinity,
            }
          );
          playcdthub.pause();


        playbtn.onclick = function(){
            if(_this.isplaying){
                audio.pause();
            }else{
                audio.play();
            }
            
            audio.onplay = function(){
                _this.isplaying = true;
                layer.classList.add("playing");
                playcdthub.play();
            }
            audio.onpause = function(){
                _this.isplaying = false;
                layer.classList.remove("playing");
                playcdthub.pause();
            }

            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progresscurrentTime = Math.floor(audio.currentTime / audio.duration *100);
                    progress.value = progresscurrentTime;

                }
            }

            progress.onchange = function(e){
                const seektime = audio.duration / 100 * e.target.value;
                audio.currentTime = seektime;
            }
            //nhan hien mau nnextbtn
            // nextbtn.onmouseover= function(){
            //     _this.israndom = ! _this.israndom;
            //     nextbtn.classList.toggle('active', _this.israndom)
            // }
            // khi next bai hat
            nextbtn.onclick = function(){
               if(_this.israndom){
                _this.playrandomSong();
               }else{
                _this.nextsong();
               }
                audio.play();
                _this.render();
                _this.gotoactiveSong();
                // console.log(_this.playrandomSong());
            }
            prewbtn.onclick = function(){
                if(_this.israndom){
                    _this.playrandomSong();
                   }else{
                    _this.prewsong();
                   }
                audio.play();
                _this.render();
                _this.gotoactiveSong();
            }

            randombtn.onclick = function(e){
               _this.israndom = !_this.israndom;
               randombtn.classList.toggle('active', _this.israndom)
            }
            // xu ly bat/ tat random
            repeatbtn.onclick = function(){
                _this.isrepeat = !_this.isrepeat;
                repeatbtn.classList.toggle("active", _this.isrepeat)
            }
            audio.onended = function(){
                if(_this.isrepeat){
                    audio.play()
                }else{
                    nextbtn.click();
                }
            }
            // lắng nghe hành vi click vào playLists
            playlist.onclick = function(e){
                const songNode = e.target.closest(".song:not(.active)") 
                if(  songNode || e.target.closest(".option")){
                    
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurentSong();
                        audio.play();
                        _this.render();
                    }
                }
            }
        };



    },
    gotoactiveSong: function(){
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        },300);
    },
    playrandomSong: function(){
        let newindex
        do{
            newindex = Math.floor(Math.random() * this.songs.length);
        } while(newindex === this.currentIndex);

        this.currentIndex = newindex;
        this.loadCurentSong();
        console.log(newindex);
    },
    nextsong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length ){
            this.currentIndex = 0;
        }
        this.loadCurentSong();
    },
    prewsong: function(){
        this.currentIndex--;
        const lengsong = this.songs.length;
        if(this.currentIndex < 0){
            this.currentIndex = lengsong - 1;
        }
        this.loadCurentSong();
    },
    loadCurentSong: function() {

        
        heading.textContent = this.currentSong.name;
        cdthumd.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;

        // console.log(heading,cdthumd,audio);
    },
    start: function() {
        //lắng nghe/ xử lý các sự kiện
        this.handleEvents();    
        // định nghĩa các thuộc tính
        this.defineProperties();

        // this.playrandomSong(); 

        // tải bài hát hiện tại lên giao diện
        this.loadCurentSong();

        // render latlist
        this.render();
    },
};

app.start();
