import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Chat() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [datasets, setDatasets] = useState([])
  const [datasetId, setDatasetId] = useState('')
  const [text, setText] = useState('Show me monthly revenue')
  const [thread, setThread] = useState([])
  const [schema, setSchema] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(()=>{
    fetch(`${baseUrl}/datasets`).then(r=>r.json()).then(d=>{
      setDatasets(d.datasets||[])
      if (d.datasets?.[0]) { setDatasetId(d.datasets[0].id); setSchema(d.datasets[0].schema) }
    })
  },[])

  const send = async () => {
    if (!datasetId || !text) return
    const userMsg = {role:'user', text}
    setThread(t=>[...t, userMsg])
    const res = await fetch(`${baseUrl}/chat`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ dataset_id: datasetId, text })})
    const d = await res.json()
    setThread(t=>[...t, {role:'assistant', text: d.answer_text, sql: d.sql, results: d.results, chart: d.chart_spec}])
    setRecent(r=>[{text, sql:d.sql, at:new Date().toISOString()}, ...r].slice(0,5))
    setText('')
  }

  return (
    <div className="min-h-screen bg-slate-50 grid md:grid-cols-[1fr_320px]">
      <main className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Chat</h1>
          <Link to="/dashboard" className="text-sm text-teal-700">Back to Dashboard</Link>
        </div>
        <div className="mt-2">
          <select value={datasetId} onChange={e=>setDatasetId(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-sm">
            {datasets.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className="mt-4 space-y-4">
          {thread.map((m,i)=> (
            <div key={i} className={`rounded-xl border ${m.role==='user'?'border-teal-200 bg-teal-50':'border-slate-200 bg-white'} p-4`}>
              <div className="text-xs text-slate-500">{m.role}</div>
              <div className="mt-1 text-sm whitespace-pre-wrap">{m.text}</div>
              {m.sql && (
                <pre className="mt-2 p-2 bg-slate-50 text-xs border border-slate-200 rounded overflow-auto">{m.sql}</pre>
              )}
              {m.results && (
                <div className="overflow-auto mt-2">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>{m.results.columns.map(c=> <th key={c} className="px-3 py-2 text-left text-slate-600">{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {m.results.rows.map((r,ri)=> (
                        <tr key={ri} className="border-t border-slate-100">
                          {m.results.columns.map(c=> <td key={c} className="px-3 py-2">{String(r[c])}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 mt-4 p-2 bg-slate-50/80 backdrop-blur">
          <div className="flex gap-2">
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask a question..." className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm" />
            <button onClick={send} className="px-4 py-2 rounded-md bg-slate-900 text-white">Send</button>
          </div>
        </div>
      </main>
      <aside className="border-l border-slate-200 bg-white p-4">
        <div className="font-semibold">Context</div>
        <div className="mt-2">
          <div className="text-xs text-slate-500">Schema</div>
          <pre className="text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-56">{schema?JSON.stringify(schema,null,2):'—'}</pre>
        </div>
        <div className="mt-3">
          <div className="text-xs text-slate-500">Last 5 queries</div>
          <ul className="text-sm mt-1 space-y-1">
            {recent.map((q,i)=> <li key={i} className="truncate">• {q.text}</li>)}
          </ul>
        </div>
      </aside>
    </div>
  )
}
