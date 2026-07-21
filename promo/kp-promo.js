(() => {
  const TOTAL_MS = 55000;

  const SHOTS = [
    { id: 0, start: 0, end: 5000 },
    { id: 1, start: 5000, end: 11000 },
    { id: 2, start: 11000, end: 17000 },
    { id: 3, start: 17000, end: 23000 },
    { id: 4, start: 23000, end: 30000 },
    { id: 5, start: 30000, end: 37000 },
    { id: 6, start: 37000, end: 43000 },
    { id: 7, start: 43000, end: 50000 },
    { id: 8, start: 50000, end: 55000 },
  ];

  const stage = document.getElementById("stage");
  const scenes = [...document.querySelectorAll(".scene")];
  const progressFill = document.getElementById("progressFill");
  const timecode = document.getElementById("timecode");
  const playBtn = document.getElementById("playBtn");
  const restartBtn = document.getElementById("restartBtn");

  let raf = null;
  let startedAt = 0;
  let pausedAt = 0;
  let playing = false;
  let currentScene = -1;

  function scaleStage() {
    const wrap = stage.parentElement;
    stage.style.transform = `scale(${wrap.clientWidth / 1440})`;
  }

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  function setScene(index) {
    if (index === currentScene) return;
    const prev = currentScene;
    currentScene = index;
    scenes.forEach((scene, i) => {
      scene.classList.remove("active", "leaving");
      if (i === index) scene.classList.add("active");
      if (i === prev && prev !== index) {
        scene.classList.add("leaving");
        setTimeout(() => scene.classList.remove("leaving"), 500);
      }
    });
  }

  function sceneAt(ms) {
    for (const shot of SHOTS) {
      if (ms >= shot.start && ms < shot.end) return shot.id;
    }
    return SHOTS.length - 1;
  }

  function render(ms) {
    const clamped = Math.min(ms, TOTAL_MS);
    progressFill.style.width = `${(clamped / TOTAL_MS) * 100}%`;
    timecode.textContent = formatTime(clamped);
    setScene(sceneAt(clamped));
  }

  function frame(now) {
    if (!playing) return;
    const elapsed = now - startedAt;
    render(elapsed);
    if (elapsed >= TOTAL_MS) {
      playing = false;
      playBtn.textContent = "▶ Play";
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (playing) {
      playing = false;
      playBtn.textContent = "▶ Play";
      pausedAt = performance.now() - startedAt;
      cancelAnimationFrame(raf);
      return;
    }
    playing = true;
    playBtn.textContent = "❚❚ Pause";
    startedAt = performance.now() - pausedAt;
    raf = requestAnimationFrame(frame);
  }

  function restart() {
    cancelAnimationFrame(raf);
    playing = false;
    pausedAt = 0;
    currentScene = -1;
    render(0);
    playBtn.textContent = "▶ Play";
    play();
  }

  function seek(ms) {
    cancelAnimationFrame(raf);
    playing = false;
    playBtn.textContent = "▶ Play";
    pausedAt = Math.max(0, Math.min(ms, TOTAL_MS));
    currentScene = -1;
    render(pausedAt);
  }

  window.__pitch = { play, pause: () => playing && play(), restart, seek, TOTAL_MS, SHOTS };

  playBtn.addEventListener("click", play);
  restartBtn.addEventListener("click", restart);
  window.addEventListener("resize", scaleStage);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      play();
    }
    if (e.code === "KeyR") restart();
  });

  scaleStage();
  render(0);
  setTimeout(() => play(), 500);
})();
