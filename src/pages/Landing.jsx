import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">K</div>
            <span className="font-semibold">Knowlance AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-slate-700">Features</a>
            <a href="#pricing" className="hover:text-slate-700">Pricing</a>
            <a href="#contact" className="hover:text-slate-700">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/settings" className="px-3 py-2 rounded-md hover:bg-slate-100 text-sm">Login</Link>
            <Link to="/dashboard" className="px-4 py-2 rounded-md bg-teal-500 text-white text-sm hover:bg-teal-600">Try Free</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-teal-50" />
          <div className="max-w-7xl mx-auto px-4 py-20 relative">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">Upload CSV → Get Insights Instantly.</h1>
              <p className="mt-4 text-lg text-slate-600">Chat-first analytics for teams. Drop your data and ask questions in plain language. We'll generate charts, KPIs, and summaries in seconds.</p>
              <div className="mt-8 flex items-center gap-3">
                <Link to="/upload" className="px-5 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800">Upload a CSV</Link>
                <Link to="/dashboard" className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-white">View Dashboard</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
          {[
            {title:'Upload', desc:'Drag-and-drop CSVs. We auto-detect types and clean your data.'},
            {title:'Dashboard', desc:'KPIs and charts generated from your dataset. Ready to share.'},
            {title:'Chat', desc:'Ask in natural language. We translate to SQL and run on your data.'},
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-slate-600 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Knowlance AI</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-800">Privacy</a>
            <a href="#" className="hover:text-slate-800">Terms</a>
            <a href="#contact" className="hover:text-slate-800">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
