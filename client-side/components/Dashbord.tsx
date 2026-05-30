export default function Dashbord() {
  return (
    <section className="mt-12 rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Cafe highlights</p>
          <h3 className="mt-3 text-2xl font-semibold">Cozy environment</h3>
          <p className="mt-3 text-slate-300">Warm seating, calm lighting, and a friendly atmosphere for work or leisure.</p>
        </div>
        <div className="rounded-[1.75rem] bg-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Chef recommendation</p>
          <h3 className="mt-3 text-2xl font-semibold">Seasonal favorites</h3>
          <p className="mt-3 text-slate-300">Try our rotating daily special for a bright, flavorful meal.</p>
        </div>
        <div className="rounded-[1.75rem] bg-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Community love</p>
          <h3 className="mt-3 text-2xl font-semibold">Local support</h3>
          <p className="mt-3 text-slate-300">We partner with local farms and bakeries for the freshest ingredients.</p>
        </div>
      </div>
    </section>
  )
}
