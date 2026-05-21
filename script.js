const card = document.getElementById("card");
const shine = document.querySelector(".shine");

let currentX = 0;
let currentY = 0;

let targetX = 0;
let targetY = 0;

document.addEventListener("mousemove", (e) => {

  const x = e.clientX;
  const y = e.clientY;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  targetX = ((y - centerY) / centerY) * -18;
  targetY = ((x - centerX) / centerX) * 18;

});

function animateCard() {

  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;

  card.style.transform = `
    perspective(1400px)
    rotateX(${currentX}deg)
    rotateY(${currentY}deg)
  `;

  requestAnimationFrame(animateCard);
}

animateCard();

document.addEventListener("mouseleave", () => {
  targetX = 0;
  targetY = 0;
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 10, 25);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "0";
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(200, 200, 200, 200);

const material = new THREE.MeshStandardMaterial({
  color: 0x9d4edd,
  wireframe: true
});

const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const light = new THREE.DirectionalLight(0x9d4edd, 2);
light.position.set(10, 20, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

function animateTerrain() {

  const time = performance.now() * 0.001;

  const positions = plane.geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {

    const x = positions[i];
    const y = positions[i + 1];

    positions[i + 2] =
      Math.sin(x * 0.3 + time) * 1.5 +
      Math.cos(y * 0.3 + time) * 1.5;

  }

  plane.geometry.attributes.position.needsUpdate = true;

  plane.rotation.z = time * 0.05;

  renderer.render(scene, camera);

  requestAnimationFrame(animateTerrain);
}

animateTerrain();

window.addEventListener("resize", () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

});

const API = "https://counter.pxslbusiness.workers.dev";
const sessionKey = "viewed_homepage";

function hitViews() {
  fetch(`${API}/hit`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("views").textContent = data.value;
    });
}

function getViews() {
  fetch(`${API}/get`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("views").textContent = data.value;
    });
}

if (!sessionStorage.getItem(sessionKey)) {
  hitViews();
  sessionStorage.setItem(sessionKey, "1");
} else {
  getViews();
}

const introMessages = [
  "click anywhere to enter",
  "tap to continue",
  "enter the space",
  "initializing environment",
  "press to begin",
  "welcome back",
  "loading atmosphere",
  "start experience",
  "wake the system",
  "resume session"
];

const introText =
  document.getElementById("introText");

introText.textContent =
  introMessages[
    Math.floor(Math.random() * introMessages.length)
  ];

const playlist = [
  {
    title: "Ezekiel - help_urself (PHE Edit)",
    artist: "PHE",
    file: "assets/music/help_urself-PHE.mp3",
    cover: "assets/covers/help_urself-PHE.jpg"
  }
];

const audio = new Audio();

let currentSong =
  Math.floor(Math.random() * playlist.length);

const intro = document.getElementById("intro");

const musicPlayer =
  document.getElementById("musicPlayer");

const cover = document.getElementById("cover");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

const playPause = document.getElementById("playPause");
const musicPrevBtn = document.getElementById("prev");
const musicNextBtn = document.getElementById("next");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTimeEl =
  document.getElementById("currentTime");

const durationEl =
  document.getElementById("duration");

function loadSong(index) {

  const song = playlist[index];

  audio.src = song.file;

  cover.src = song.cover;

  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
}

function playSong() {

  audio.play();

  playPause.innerHTML =
    `<i class="fa-solid fa-pause"></i>`;
}

function pauseSong() {

  audio.pause();

  playPause.innerHTML =
    `<i class="fa-solid fa-play"></i>`;
}

playPause.addEventListener("click", () => {

  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }

});

musicNextBtn.addEventListener("click", () => {

  currentSong++;

  if (currentSong >= playlist.length) {
    currentSong = 0;
  }

  loadSong(currentSong);
  playSong();

});

musicPrevBtn.addEventListener("click", () => {

  currentSong--;

  if (currentSong < 0) {
    currentSong = playlist.length - 1;
  }

  loadSong(currentSong);
  playSong();

});

audio.addEventListener("timeupdate", () => {

  const progressPercent =
    (audio.currentTime / audio.duration) * 100;

  progress.value = progressPercent || 0;

  currentTimeEl.textContent =
    formatTime(audio.currentTime);

  durationEl.textContent =
    formatTime(audio.duration);

});

progress.addEventListener("input", () => {

  audio.currentTime =
    (progress.value / 100) * audio.duration;

});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

audio.addEventListener("ended", () => {

  currentSong++;

  if (currentSong >= playlist.length) {
    currentSong = 0;
  }

  loadSong(currentSong);
  playSong();

});

function formatTime(time) {

  if (isNaN(time)) return "0:00";

  const mins = Math.floor(time / 60);

  let secs = Math.floor(time % 60);

  if (secs < 10) secs = "0" + secs;

  return `${mins}:${secs}`;
}

intro.addEventListener("click", async () => {

  loadSong(currentSong);

  audio.volume = 0.5;

  await audio.play();

  intro.classList.add("hidden");

  setTimeout(() => {
    musicPlayer.classList.add("show");
  }, 600);

});

const musicToggle = document.getElementById("musicToggle");

let playerVisible = true;

musicToggle.addEventListener("click", () => {
  playerVisible = !playerVisible;

  if (playerVisible) {
    musicPlayer.classList.remove("hidden");
    musicPlayer.classList.add("show");

    musicToggle.innerHTML = `<i class="fa-solid fa-music"></i>`;
  } else {
    musicPlayer.classList.add("hidden");

    musicToggle.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  }
});

const linksData = [
  {
    icon: "fa-brands fa-discord",
    title: "Discord",
    sub: "@pxsldev1",
    url: "https://discord.com/users/994116541559865416"
  },
  {
    icon: "fa-brands fa-github",
    title: "GitHub",
    sub: "projects & code",
    url: "https://github.com/PxslGames"
  },
  {
    icon: "fa-brands fa-youtube",
    title: "YouTube",
    sub: "my stupid content (rarely upload)",
    url: "https://youtube.com/@pxsldev1"
  },
  {
    icon: "fa-brands fa-tiktok",
    title: "TikTok",
    sub: "short form content (rarely upload)",
    url: "https://tiktok.com/@pxsldev1"
  },
  {
    icon: "fa-brands fa-itch-io",
    title: "itch.io",
    sub: "my games and stuff (rarely post)",
    url: "https://pxsldev1.itch.io"
  }
];

const linksPerPage = 3;
let currentPage = 0;

const linksEl = document.getElementById("links");
const pagePrevBtn = document.getElementById("prevPage");
const pageNextBtn = document.getElementById("nextPage");

function renderLinks() {

  const oldHeight = card.offsetHeight;

  linksEl.innerHTML = "";

  const start = currentPage * linksPerPage;
  const end = start + linksPerPage;

  const pageItems = linksData.slice(start, end);

  pageItems.forEach(link => {

    const a = document.createElement("a");

    a.className = "link-btn";
    a.href = link.url;
    a.target = "_blank";

    a.innerHTML = `
      <div class="icon">
        <i class="${link.icon}"></i>
      </div>

      <div class="link-text">
        <span class="link-title">${link.title}</span>
        <span class="link-sub">${link.sub}</span>
      </div>
    `;

    linksEl.appendChild(a);

  });

  pagePrevBtn.disabled = currentPage === 0;
  pageNextBtn.disabled = end >= linksData.length;

  const newHeight = card.scrollHeight;

  card.style.height = oldHeight + "px";

  requestAnimationFrame(() => {
    card.style.height = newHeight + "px";
  });

  card.addEventListener("transitionend", function handler(e) {

    if (e.propertyName === "height") {

      card.style.height = "auto";

      card.removeEventListener(
        "transitionend",
        handler
      );

    }

  });

}

pagePrevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderLinks();
  }
});

pageNextBtn.addEventListener("click", () => {
  if ((currentPage + 1) * linksPerPage < linksData.length) {
    currentPage++;
    renderLinks();
  }
});

renderLinks();

let swipeStartY = 0;
let swipeEndY = 0;

const swipeThreshold = 140;

function goToProjects() {

  document.body.style.transition =
    "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease";

  document.body.style.transform = "translateY(-100px)";
  document.body.style.opacity = "0";

  setTimeout(() => {
    goTo("projects");
  }, 700);

}

window.addEventListener("touchstart", (e) => {

  swipeStartY = e.touches[0].clientY;

});

window.addEventListener("touchend", (e) => {

  swipeEndY = e.changedTouches[0].clientY;

  const distance = swipeStartY - swipeEndY;

  const startedNearBottom =
    swipeStartY > window.innerHeight - 140;

  if (distance > swipeThreshold && startedNearBottom) {
    goToProjects();
  }

});

let mouseDown = false;

window.addEventListener("mousedown", (e) => {

  mouseDown = true;
  swipeStartY = e.clientY;

});

window.addEventListener("mouseup", (e) => {

  if (!mouseDown) return;

  mouseDown = false;

  swipeEndY = e.clientY;

  const distance = swipeStartY - swipeEndY;

  const startedNearBottom =
    swipeStartY > window.innerHeight - 140;

  if (distance > swipeThreshold && startedNearBottom) {
    goToProjects();
  }

});

function goTo(url) {
  const t = document.getElementById("transition");

  t.classList.add("active");

  setTimeout(() => {
    window.location.href = url;
  }, 450);
}