import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Kpi({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-slate-500 text-xs uppercase">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-teal-600 text-sm mt-1">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [datasets, setDatasets] = useState([])
  const [selected, setSelected] = useState(null)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    fetch(`${baseUrl}/datasets`).then(r=>r.json()).then(d=>{
      setDatasets(d.datasets || [])
      if (d.datasets?.[0]) setSelected(d.datasets[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    fetch(`${baseUrl}/dashboard-metrics?dataset_id=${selected}`).then(r=>r.json()).then(setMetrics).catch(()=>{})
  }, [selected])

  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr] bg-slate-50">
      <aside className="border-r border-slate-200 bg-white p-4 sticky top-0 h-screen hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Datasets</div>
          <Link to="/upload" className="text-teal-600 text-sm">Upload</Link>
        </div>
        <div className="space-y-2">
          {datasets.map(ds => (
            <button key={ds.id} className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-100 ${selected===ds.id?'bg-slate-100':''}`} onClick={()=>setSelected(ds.id)}>
              <div className="font-medium truncate">{ds.name}</div>
              <div className="text-slate-500 text-xs">{new Date(ds.created_at).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      </aside>
      <main className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/chat" className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">Open Chat</Link>
            <Link to="/upload" className="px-3 py-2 rounded-md border border-slate-300 text-sm">Upload</Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Kpi label="Total Revenue (30d)" value={metrics?`$${(metrics.kpis.total_revenue_30d||0).toFixed(2)}`:'—'} sub={metrics?`${metrics.kpis.growth_pct.toFixed(1)}% growth`:'—'} />
          <Kpi label="Top Category" value={metrics?.kpis.top_category||'—'} />
          <Kpi label="Risk Score" value={metrics?`${metrics.kpis.risk_score}`:'—'} />
          <Kpi label="Datasets" value={datasets.length} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold mb-2">Revenue over time</div>
            <div id="chart-line" className="h-64"></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold mb-2">Top categories</div>
            <div id="chart-bar" className="h-64"></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 mt-4">
          <div className="font-semibold mb-2">Table preview</div>
          <TablePreview datasetId={selected} />
        </div>
      </main>
    </div>
  )
}

function TablePreview({ datasetId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [rows, setRows] = useState([])
  const [cols, setCols] = useState([])

  useEffect(() => {
    if (!datasetId) return
    fetch(`${baseUrl}/chat`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({dataset_id: datasetId, text: 'preview table'})})
      .then(r=>r.json()).then((d)=>{
        setCols(d.results.columns)
        setRows(d.results.rows)
        // draw charts if available in metrics
        // no-op here
      })
  }, [datasetId])

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {cols.map(c => <th key={c} className="px-3 py-2 text-left font-medium text-slate-600">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=> (
            <tr key={i} className="border-t border-slate-100">
              {cols.map(c => <td key={c} className="px-3 py-2">{String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
