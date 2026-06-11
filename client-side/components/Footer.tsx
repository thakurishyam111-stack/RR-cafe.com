import { Facebook, Instagram } from "lucide-react";
export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-gray-800 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-3 text-white">
        <div className="space-y-3 text-white">
           
            <h3 className="mb-4 text-lg font-semibold text-white underline underline-offset-4">
    Follow Us
  </h3>
<h3> The Royale Cafe</h3>
           
            <div className="flex gap-4">
           <a
      href="https://facebook.com"
      target="_blank"
      rel="noopener noreferrer"
    >
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQxOMUNq_G-2Tqqcm2l1UYB3WCjRHx6KI2xg&s"
   className="h-10 w-10 rounded-full" />

    </a>

    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
    >
   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-LEWI88wVZBQZ4YmnUfwXBQb02j8DbJL--g&s" 
   alt="Instagram"
    className="h-10 w-10 rounded-full" />
    </a>

    <a
      href="https://tiktok.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
      src="https://img.magnific.com/premium-vector/vector-icon_1314854-4006.jpg?semt=ais_hybrid&w=740&q=80"
        alt="TikTok"
        className="h-10 w-10 rounded-full bg-white p-2"
      />
    </a>
      </div>
        </div>

        <div className="space-y-3 text-sm text-white">
          <p className="font-semibold text-white text-2xl">Opening Hours</p>
          <p>Monday – Friday: 8am – 10pm</p>
          <p>Saturday – Sunday: 8am – 11pm</p>
          <p>Holiday brunch service available</p>
        </div>

        <div className="space-y-3 text-sm text-white">
          <p className="font-semibold text-white text-2xl">Contact</p>
          <p>Phone: +91 98765 43210</p>
          <p>Email: hello@caferoyale.com</p>
          <p>Follow us on Instagram @CafeRoyale</p>
        </div>
      </div>
      <div>
 
 
   

</div>
    </footer>
  );
}
