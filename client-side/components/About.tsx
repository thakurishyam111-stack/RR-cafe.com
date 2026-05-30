export default function About() {
  return (
    <section
      id="about"
      className="mt-12 rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-orange-100"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
            History of Cafe
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            A Tradition of Coffee, Connection, and Community
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Cafes have been a part of social life for centuries, serving as
            gathering places where people meet, share ideas, and enjoy quality
            coffee. From the first coffee houses of the Middle East to the
            modern cafes found around the world today, cafes have always been
            centers of conversation, creativity, and relaxation.
          </p>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Inspired by this rich tradition, Cafe Royale was created to offer a
            warm and welcoming space where guests can enjoy handcrafted coffee,
            delicious food, and memorable moments with friends and family.
          </p>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              Coffee Heritage
            </h3>
            <p className="mt-2 text-slate-600">
              Coffee houses have connected communities and inspired
              conversations for over 500 years.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              Modern Cafe Culture
            </h3>
            <p className="mt-2 text-slate-600">
              Today, cafes are places to relax, work, socialize, and enjoy
              exceptional coffee experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}