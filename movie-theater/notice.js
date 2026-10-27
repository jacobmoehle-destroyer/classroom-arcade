(() => {
  if (document.getElementById("movieNotice")) return;
  const style = document.createElement("style");
  style.textContent = `
    .movie-notice-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px;background:#000b;backdrop-filter:blur(5px)}
    .movie-notice-dialog{position:relative;width:min(100%,560px);max-height:88vh;overflow:auto;background:#1a150c;color:#f5eee0;border:1px solid #ffad0a;border-radius:18px;padding:26px;box-shadow:0 24px 80px #000b;font:15px/1.6 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .movie-notice-dialog h2{margin:0 48px 12px 0;color:#ffad0a;font-size:clamp(1.4rem,5vw,2rem)}
    .movie-notice-dialog p{color:#d0c5b0;margin:10px 0}
    .movie-notice-close{position:absolute;top:12px;right:12px;width:42px;height:42px;border-radius:10px;border:1px solid #59400e;background:#211a0c;color:#f5eee0;font-size:1.5rem;cursor:pointer}
    .movie-notice-ok{margin-top:12px;width:100%;padding:12px 16px;border:1px solid #ffad0a;border-radius:10px;background:#49310a;color:#fff;font:inherit;font-weight:750;cursor:pointer}
    .movie-notice-small{font-size:.82rem}
    body.movie-notice-open{overflow:hidden}
    @media(prefers-reduced-motion:reduce){.movie-notice-overlay{backdrop-filter:none}}
  `;
  document.head.appendChild(style);
  const overlay = document.createElement("div");
  overlay.className = "movie-notice-overlay";
  overlay.id = "movieNotice";
  overlay.innerHTML = `
    <section class="movie-notice-dialog" role="dialog" aria-modal="true" aria-labelledby="movieNoticeTitle" aria-describedby="movieNoticeText">
      <button class="movie-notice-close" id="movieNoticeX" type="button" aria-label="Close notice">×</button>
      <h2 id="movieNoticeTitle">🎬 Before You Watch</h2>
      <div id="movieNoticeText">
        <p><strong>Please use Classroom Arcade responsibly.</strong></p>
        <p>Movies and shows listed here are not necessarily copyright-free. Only access and watch content you have permission to use, and respect the rights of content creators and the file owner's sharing settings.</p>
        <p><strong>Please do not watch during class or instructional time</strong> unless your teacher explicitly allows it. Follow your school's technology and acceptable-use rules.</p>
        <p class="movie-notice-small">Do not use this site to access, share, or distribute content in ways that violate school rules or other people's rights. This notice is a reminder, not a guarantee that any particular title is legal to view.</p>
      </div>
      <button class="movie-notice-ok" id="movieNoticeDone" type="button">I understand — continue</button>
    </section>`;
  document.body.appendChild(overlay);
  document.body.classList.add("movie-notice-open");
  function closeNotice() {
    overlay.remove();
    style.remove();
    document.body.classList.remove("movie-notice-open");
    document.removeEventListener("keydown", onKeyDown);
  }
  function onKeyDown(event) {
    if (event.key === "Escape" && document.getElementById("movieNotice")) closeNotice();
  }
  document.getElementById("movieNoticeX").addEventListener("click", closeNotice);
  document.getElementById("movieNoticeDone").addEventListener("click", closeNotice);
  overlay.addEventListener("click", event => { if (event.target === overlay) closeNotice(); });
  document.addEventListener("keydown", onKeyDown);
  document.getElementById("movieNoticeX").focus();
})();