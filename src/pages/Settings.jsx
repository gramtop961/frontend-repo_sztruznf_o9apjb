import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Settings(){
  const [openai, setOpenai] = useState('')
  const [gemini, setGemini] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Account & Settings</h1>
          <Link to="/" className="text-sm text-teal-700">Back</Link>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold">User</div>
            <div className="text-sm text-slate-600 mt-1">Plan: Free</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold">API Keys</div>
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-sm text-slate-600">OpenAI API Key</label>
                <input value={openai} onChange={e=>setOpenai(e.target.value)} placeholder="sk-..." className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="block text-sm text-slate-600">Gemini API Key</label>
                <input value={gemini} onChange={e=>setGemini(e.target.value)} placeholder="..." className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"/>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Keys are used only in your browser for this MVP. For production, store securely on the server.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
