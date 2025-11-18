import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Upload() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [schema, setSchema] = useState(null)
  const [datasetId, setDatasetId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const onFileChange = (e) => {
    const f = e.target.files[0]
    setFile(f)
  }

  const doUpload = async () => {
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('tenant_id', 'tenant_demo')
    const res = await fetch(`${baseUrl}/upload-dataset`, { method: 'POST', body: form })
    const d = await res.json()
    setDatasetId(d.dataset_id)
    setPreview(d.preview)
    setSchema(d.schema)
    setMessage('Uploaded. You can run preprocess next.')
    setLoading(false)
  }

  const runPreprocess = async () => {
    if (!datasetId) return
    setLoading(true)
    const res = await fetch(`${baseUrl}/preprocess`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ dataset_id: datasetId }) })
    const d = await res.json()
    setMessage('Preprocess complete. Redirecting to dashboard...')
    setTimeout(()=> navigate('/dashboard'), 800)
    setLoading(false)
  }

  useEffect(()=>{
    // ensure sample exists and is registered if user wants
  },[])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Upload a Dataset</h1>
          <Link to="/dashboard" className="text-sm text-teal-700">Back to Dashboard</Link>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 flex flex-col items-center justify-center text-center">
            <input type="file" accept=".csv" onChange={onFileChange} aria-label="Select CSV file" className="hidden" id="file" />
            <label htmlFor="file" className="px-4 py-2 rounded-md bg-slate-900 text-white cursor-pointer">Select CSV</label>
            <p className="text-slate-500 text-sm mt-2">Drag & drop coming soon</p>
            {file && <p className="text-sm mt-2">Selected: {file.name}</p>}
            <button disabled={!file||loading} onClick={doUpload} className="mt-4 px-4 py-2 rounded-md bg-teal-500 text-white disabled:opacity-50">{loading?'Uploading...':'Upload'}</button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="font-semibold">Preview & Inferred Schema</div>
            {!preview ? (
              <p className="text-slate-500 text-sm mt-2">No preview yet. Upload a file to see the first 10 rows.</p>
            ) : (
              <div className="mt-3">
                <div className="text-xs text-slate-500">Schema</div>
                <pre className="text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">{JSON.stringify(schema, null, 2)}</pre>
                <div className="text-xs text-slate-500 mt-3">Preview</div>
                <div className="overflow-auto max-h-64 border border-slate-200 rounded">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>{Object.keys(preview[0]||{}).map(k=> <th key={k} className="px-3 py-2 text-left text-slate-600">{k}</th>)}</tr>
                    </thead>
                    <tbody>
                      {preview.map((r,i)=> (
                        <tr key={i} className="border-t border-slate-100">
                          {Object.keys(preview[0]||{}).map(k=> <td key={k} className="px-3 py-2">{String(r[k])}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={runPreprocess} disabled={!datasetId||loading} className="mt-4 px-4 py-2 rounded-md bg-slate-900 text-white disabled:opacity-50">{loading?'Processing...':'Run Preprocess'}</button>
              </div>
            )}
            {message && <div className="mt-3 text-sm text-teal-700">{message}</div>}
          </div>
        </div>

        <div className="mt-6">
          <button onClick={async()=>{
            const r = await fetch(`${baseUrl}/load-sample`, {method:'POST'})
            const d = await r.json()
            setDatasetId(d.dataset_id)
            setPreview(d.preview)
            setSchema(d.schema)
            setMessage('Loaded sample dataset. You can preprocess now.')
          }} className="text-sm text-slate-700 underline">Or load the sample dataset</button>
        </div>
      </div>
    </div>
  )
}
