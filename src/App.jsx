import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stage, Html, Environment } from '@react-three/drei'
import { FaInstagram, FaLinkedin, FaGithub, Fa500Px } from 'react-icons/fa'

const BASE_URL = '/photocv/';

function MusicPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)

  useEffect(() => {
    const audio = audioRef.current
    const startAudio = () => {
      audio.volume = 0
      audio.play().then(() => {
        setIsPlaying(true)
        let fade = setInterval(() => {
          if (audio.volume < volume) {
            audio.volume = Math.min(audio.volume + 0.05, volume)
          } else {
            clearInterval(fade)
          }
        }, 100)
        window.removeEventListener('click', startAudio)
      }).catch(() => {})
    }
    window.addEventListener('click', startAudio)
    return () => window.removeEventListener('click', startAudio)
  }, [volume])

  return (
    <div style={{
      position: 'absolute', bottom: '30px', right: '30px', display: 'flex', alignItems: 'center', 
      gap: '15px', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 20px', 
      borderRadius: '50px', backdropFilter: 'blur(10px)', zIndex: 20, border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <audio ref={audioRef} src={`${BASE_URL}music.mp3`} loop />
      <button onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s ease, filter 0.2s ease', display: 'flex', alignItems: 'center', outline: 'none' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)';
          e.currentTarget.style.filter = 'brightness(1.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = isPlaying ? 'none' : 'grayscale(100%)';
        }}
      >
        <img src={`${BASE_URL}pp.png`} style={{ width: '30px', height: '30px', filter: isPlaying ? 'none' : 'grayscale(100%)' }} alt="play/pause" />
      </button>
      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {setVolume(e.target.value); audioRef.current.volume = e.target.value;}}
             style={{ cursor: 'pointer', accentColor: '#ff4500', width: '80px' }} />
    </div>
  )
}

function SonyCamera({ onImageClick, ...props }) {
  const { scene } = useGLTF(`${BASE_URL}camera/scene.gltf`)
  const [view, setView] = useState('MENU')
  const [currentIdx, setCurrentIdx] = useState(0)
  
  const photos = ['photos/Acropolis.jpg', 'photos/Acropolis by night.jpg', 'photos/Assos.jpg', 
  'photos/Chrisa doggos.jpg', 'photos/Clock.jpg', 'photos/Dark Souls Peles.jpg', 'photos/Car.jpg','photos/Χρύσα_1.jpg', 
  'photos/HelChurch.jpg', 'photos/Elden Ring Peles 1.jpg', 'photos/friends and families.jpg', 'photos/X4.jpg', 
  'photos/Hands.jpg', 'photos/Helman.jpg', 'photos/Elden Ring Peles 3.jpg', 'photos/northlights2.jpg', 'photos/X3.jpg', 
  'photos/Sun1.jpg', 'photos/northlights1.jpg', 'photos/Χρύσα_2.jpg', 'photos/walk in the park.jpg', 'photos/X1.jpg', 
  'photos/SunsetHome.jpg', 'photos/Rovaniemi.jpg', 'photos/Χρύσα_4.jpg', 'photos/SmokingBird.jpg']

  const innerSocialStyle = {
    color: 'white',
    transition: '0.2s',
    cursor: 'pointer',
    opacity: 0.8,
    textDecoration: 'none'
  }

  return (
    <group>
      <primitive object={scene} {...props} />
      <Html transform occlude rotation={[0, Math.PI, 0]} position={[7, 23, -30.43]} 
        style={{ width: '320px', height: '210px', background: '#111', color: 'white', fontFamily: 'monospace', transform: 'scale(2.9)', position: 'relative', userSelect: 'none' }}>
        
        <div onClick={() => setView('MENU')} style={{ fontSize: '16px', color: '#ff4500', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
          <span>{view === 'MENU' ? 'CAMERA' : '❮ BACK'}</span>
          <span style={{color: '#aaa', fontSize: '10px'}}>REC ●</span>
        </div>

        <div style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          
          {view === 'MENU' && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li onClick={() => setView('PORTFOLIO')} style={{padding: '10px 25px', borderBottom: '1px solid #222', cursor: 'pointer'}}>▶ PORTFOLIO</li>
              <li onClick={() => setView('ABOUT')} style={{padding: '10px 25px', borderBottom: '1px solid #222', cursor: 'pointer'}}>▶ ABOUT ME</li>
              <li onClick={() => setView('REACH')} style={{padding: '10px 25px', borderBottom: '1px solid #222', cursor: 'pointer'}}>▶ REACH ME</li>
            </ul>
          )}

          {view === 'PORTFOLIO' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <button onClick={() => setCurrentIdx(i => (i === 0 ? photos.length - 1 : i - 1))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '28px' }}>❮</button>
                <div style={{ position: 'relative' }}>
                  <img src={`${BASE_URL}${photos[currentIdx]}`} style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '2px' }} alt="portfolio" />
                  <div onClick={() => onImageClick(photos[currentIdx])} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'zoom-in', zIndex: 5 }} />
                </div>
                <button onClick={() => setCurrentIdx(i => (i === photos.length - 1 ? 0 : i + 1))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '28px' }}>❯</button>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>{String(currentIdx+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</div>
            </div>
          )}

          {view === 'ABOUT' && (
            <div style={{ fontSize: '13px', lineHeight: '1.4', padding: '0 20px', overflowY: 'auto' }}>
              <p style={{ color: '#ff4500', margin: '0 0 5px 0' }}>GEOR_DAN // SOFTWARE ENGINEER & PHOTOGRAPHER</p>
              <p>I am a young Software Engineer student, but i have a passion for photography. I love capturing moments and trying to express the moment through the lens. My philosophy is to take pictures that require minimal editing, making me work for the photo not for the edit</p>
            </div>
          )}

          {view === 'REACH' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', height: '100%' }}>
              <a href="https://www.instagram.com/geordan_photos" target="_blank" rel="noreferrer" style={innerSocialStyle} onMouseEnter={e => e.currentTarget.style.color='#ff4500'} onMouseLeave={e => e.currentTarget.style.color='white'}><FaInstagram size={40} /></a>
              <a href="https://500px.com/p/geor_dan" target="_blank" rel="noreferrer" style={innerSocialStyle} onMouseEnter={e => e.currentTarget.style.color='#ff4500'} onMouseLeave={e => e.currentTarget.style.color='white'}><Fa500Px size={40} /></a>
              <a href="https://www.linkedin.com/in/george-danalatos-1a3831164" target="_blank" rel="noreferrer" style={innerSocialStyle} onMouseEnter={e => e.currentTarget.style.color='#ff4500'} onMouseLeave={e => e.currentTarget.style.color='white'}><FaLinkedin size={40} /></a>
              <a href="https://github.com/Geor-Dan" target="_blank" rel="noreferrer" style={innerSocialStyle} onMouseEnter={e => e.currentTarget.style.color='#ff4500'} onMouseLeave={e => e.currentTarget.style.color='white'}><FaGithub size={40} /></a>
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

export default function App() {
  const [zoomedImg, setZoomedImg] = useState(null)

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault()
    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden'}}>
      <div style={{ width: '100%', height: '100%', filter: zoomedImg ? 'blur(15px)' : 'none', transition: 'filter 0.4s' }}>
        <Canvas shadows camera={{ position: [100, 0, 150], fov: 50 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.5} adjustCamera={false}>
              <SonyCamera scale={10} position={[0, 10, 0]} onImageClick={setZoomedImg} />
            </Stage>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={true} makeDefault minDistance={90} maxDistance={200} maxPolarAngle={1.5} minPolarAngle={0.5} enablePan={false}/>
        </Canvas>
      </div>

      <MusicPlayer />
      
      {!zoomedImg && (
        <div style={{ position: 'absolute', bottom: '20px', left: '30px', color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1px' }}>
          GEOR_DAN // VISUAL PORTFOLIO 2026
        </div>
      )}

      {zoomedImg && (
        <div onClick={() => setZoomedImg(null)} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={`${BASE_URL}${zoomedImg}`} alt="Work" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'zoom-out', zIndex: 10 }} 
                 onDragStart={(e) => e.preventDefault()} />
          </div>
          <div style={{ position: 'absolute', bottom: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>© GEOR_DAN - ALL RIGHTS RESERVED</div>
        </div>
      )}
    </div>
  )
}