// console.log('lets');
let currentsong = new Audio();
let songs ;
let currfolder;
function formatTimeFromSeconds(totalSeconds) {
    // Ensure that totalSeconds is an integer
    totalSeconds = parseInt(totalSeconds);

    // Validate input
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Convert to two-digit format
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Concatenate minutes and seconds with a colon
    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

    return formattedTime;
}

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }


    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = " "
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>  <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            </div>
              <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
               </div>  
               </li>`;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })


    })

    preveious.addEventListener("click", () => {
        currentsong.pause()
        console.log("prev");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("next");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        // console.log(currentsong.src.split("/").slice(-1));
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })
   
}
const playMusic = (track, pause = false) => {
    // let audio =new Audio("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"

    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    

}

async function displayalbums(){
    let a = await fetch(`/songs/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a")
    Array.from(anchor).forEach(e=>{
        if(e.href.includes("/songs")){
            console.log(e.href.split("/").slice(-1)[0]);
        }
    })
    
}

async function main() {

    await getsongs("songs/ncs")
    playMusic(songs[0], true)
    
    displayalbums()
    

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }


    })

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTimeFromSeconds(currentsong.currentTime)}/${formatTimeFromSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = ((currentsong.duration) * percent) / 100
        })

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";

    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";

    })

    

    Array.from(document.getElementsByClassName("card")).forEach(e =>{
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })

    





    }
main()
