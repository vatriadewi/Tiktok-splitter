'use client'
import { useState } from 'react'
import JSZip from 'jszip'

export default function Home() {
  const [bgImage, setBgImage] = useState<string>('')
  const [story, setStory] = useState('')
  const [slideCount, setSlideCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!bgImage ||!story) return alert('Upload gambar + isi cerita dulu Bun!')
    setLoading(true)
    setResults([])
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ story, slideCount, bgImage }),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      setResults(data.images)
    } catch (e) {
      alert('Error Bun! Cek API Key udah bener belum')
    }
    setLoading(false)
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    results.forEach((img, i) => {
      const base64 = img.split(',')[1]
      zip.file(`slide-${i+1}.png`, base64, {base64: true})
    })
    const blob = await zip.generateAsync({type:"blob"})
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'tiktok-slides.zip'
    link.click()
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#E91E63]">TikTok Slide Splitter</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">1. Upload Background</label>
          <input type="file" accept="image/*" onChange={e => {
            const file = e.target.files?.[0]
            if(file) {
              const reader = new FileReader()
              reader.onload = ev => setBgImage(ev.target?.result as string)
              reader.readAsDataURL(file)
            }
          }} className="w-full text-sm"/>
        </div>
        <div>
          <label className="block mb-2">2. Tempel Naskah 1 Bab</label>
          <textarea
            value={story}
            onChange={e => setStory(e.target.value)}
            className="w-full h-40 p-3 bg-gray-900 rounded-lg text-sm"
            placeholder="Tempel cerita kamu di sini..."
          />
        </div>
        <div>
          <label className="block mb-2">3. Jumlah Slide: {slideCount}</label>
          <input type="range" min="5" max="15" value={slideCount}
            onChange={e => setSlideCount(+e.target.value)}
            className="w-full accent-[#E91E63]"/>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#E91E63] py-4 rounded-lg font-bold disabled:opacity-50"
        >
          {loading? 'Lagi Bikin...' : 'Generate Slide Jadi PNG'}
        </button>
        {results.length > 0 && (
          <>
            <button onClick={downloadZip} className="w-full bg-green-600 py-3 rounded-lg font-bold">
              Download Semua.ZIP
            </button>
            <div className="grid grid-cols-2 gap-2">
              {results.map((img, i) => (
                <img key={i} src={img} alt={`Slide ${i+1}`} className="rounded-lg"/>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
