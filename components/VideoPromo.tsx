"use client";

import { useRef, useState } from "react";

export default function VideoPromo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="section video-promo">
      <div className="video-promo-inner">
        <div>
          <p className="eyebrow">ภาพยนตร์สั้น ๓ นาที</p>
          <h2>หนึ่งวันในสวน<br />ก่อนผลไม้จะถึงมือคุณ</h2>
          <p>ตามไปดูตั้งแต่ตีห้าที่แสงแรกลงบนใบ จนถึงตอนที่กล่องสุดท้ายถูกปิดเทป</p>
          <button className="pill" onClick={toggle}>{playing ? "หยุดวิดีโอ" : "เล่นวิดีโอ"}</button>
        </div>
        <div className="video-frame">
          <video
            ref={videoRef}
            className="video-frame__media"
            src="/video/video_hero.mp4"
            playsInline
            controls={playing}
            preload="metadata"
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
        </div>
      </div>
    </section>
  );
}
