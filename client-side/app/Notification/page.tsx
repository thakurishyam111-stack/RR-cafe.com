// "use client";

// import { useState } from "react";
// import axios from "axios";
// import {
//   Bell,
//   CheckCircle2,
//   Clock3,
//   Coffee,
//   MessageCircle,
//   Trash2,
//   Sparkles,
// } from "lucide-react";

// const initialNotifications: NotificationItem[] = [
//   {
//     id: 1,
//     title: "Order #483 is ready for pickup",
//     description: "Cappuccino and cheese toastie are waiting at the counter.",
//     time: "2m ago",
//     variant: "success",
//   },
//   {
//     id: 2,
//     title: "Low milk stock alert",
//     description:
//       "Milk supply is below 10 liters. Order now to avoid shortages.",
//     time: "10m ago",
//     variant: "warning",
//   },
//   {
//     id: 3,
//     title: "Happy hour starts in 15 minutes",
//     description: "Happy hour offers 20% off drinks between 4 PM and 6 PM.",
//     time: "14m ago",
//     variant: "info",
//   },
// ];

// type NotificationItem = {
//   id: number;
//   title: string;
//   description: string;
//   time: string;
//   variant: "success" | "warning" | "info";
// };

// export default function OrderNotification() {
//   const [phone, setPhone] = useState("");
//   const [status, setStatus] = useState("");
//   const [notifications, setNotifications] =
//     useState<NotificationItem[]>(initialNotifications);

//   const checkStatus = async () => {
//     if (!phone.trim()) {
//       setStatus("Please enter a phone number.");
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/orders/phone/${phone}`,
//       );
//       setStatus(res.data.status || "Order status unavailable.");
//     } catch (error) {
//       setStatus("No order found for this number.");
//     }
//   };

//   const dismissNotification = (id: number) => {
//     setNotifications((current) => current.filter((item) => item.id !== id));
//   };

//   const statusBadge = (variant: NotificationItem["variant"]) => {
//     if (variant === "success") return "bg-emerald-500/10 text-emerald-300";
//     if (variant === "warning") return "bg-amber-500/10 text-amber-300";
//     return "bg-sky-500/10 text-sky-300";
//   };

//   return (
//     <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
//       <div className="mx-auto max-w-6xl space-y-8">
//         <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">
//                 Cafe notification bar
//               </p>
//               <h1 className="mt-2 text-4xl font-semibold text-white">
//                 Live notifications for the cafe
//               </h1>
//               <p className="mt-3 max-w-2xl text-slate-400">
//                 Deliver real cafe alerts to staff and customers with a modern,
//                 easy-to-scan notification bar and order tracking panel.
//               </p>
//             </div>
//             <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
//               <Bell className="h-5 w-5 text-emerald-300" />
//               {notifications.length} active alerts
//             </div>
//           </div>

//           <div className="mt-8 rounded-[1.75rem] bg-slate-950/90 p-5 shadow-inner shadow-slate-950/40">
//             <div className="grid gap-4 lg:grid-cols-3">
//               <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
//                 <div className="flex items-center gap-3 text-emerald-300">
//                   <Coffee className="h-5 w-5" />
//                   <div>
//                     <p className="text-sm text-slate-400">Orders ready</p>
//                     <p className="mt-2 text-2xl font-semibold text-white">8</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
//                 <div className="flex items-center gap-3 text-amber-300">
//                   <Clock3 className="h-5 w-5" />
//                   <div>
//                     <p className="text-sm text-slate-400">Upcoming promo</p>
//                     <p className="mt-2 text-2xl font-semibold text-white">
//                       Happy Hour
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
//                 <div className="flex items-center gap-3 text-sky-300">
//                   <Sparkles className="h-5 w-5" />
//                   <div>
//                     <p className="text-sm text-slate-400">Staff alerts</p>
//                     <p className="mt-2 text-2xl font-semibold text-white">
//                       3 new
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
//                 Notification panel
//               </p>
//               <h2 className="mt-2 text-3xl font-semibold text-white">
//                 Real-time cafe alerts
//               </h2>
//             </div>
//             <button
//               type="button"
//               className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/15"
//             >
//               <MessageCircle className="h-4 w-4" />
//               New alert
//             </button>
//           </div>

//           <div className="mt-6 space-y-4">
//             {notifications.map((item) => (
//               <article
//                 key={item.id}
//                 className="group rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 transition hover:border-emerald-500/30 hover:bg-slate-900/90"
//               >
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <div
//                       className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(item.variant)}`}
//                     >
//                       {item.variant === "success"
//                         ? "Order"
//                         : item.variant === "warning"
//                           ? "Stock"
//                           : "Promo"}
//                     </div>
//                     <h3 className="mt-4 text-xl font-semibold text-white">
//                       {item.title}
//                     </h3>
//                     <p className="mt-2 text-sm leading-6 text-slate-300">
//                       {item.description}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => dismissNotification(item.id)}
//                     type="button"
//                     className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
//                     aria-label="Dismiss notification"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//                 <div className="mt-4 text-sm text-slate-500">{item.time}</div>
//               </article>
//             ))}
//           </div>
//         </section>

//         <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
//                 Order status lookup
//               </p>
//               <h2 className="mt-2 text-3xl font-semibold text-white">
//                 Track customer order in seconds
//               </h2>
//             </div>
//             <div className="rounded-full bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-sky-300">
//               Live cafe updates
//             </div>
//           </div>

//           <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.85fr]">
//             <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="space-y-2">
//                   <p className="text-sm text-slate-400">Active notifications</p>
//                   <p className="text-3xl font-semibold text-white">
//                     {notifications.length}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm text-slate-400">Most recent alert</p>
//                   <p className="text-3xl font-semibold text-white">
//                     {notifications[0]?.title || "No active alerts"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
//               <div className="flex flex-col gap-4">
//                 <label
//                   className="text-sm font-medium text-slate-200"
//                   htmlFor="phone"
//                 >
//                   Customer phone number
//                 </label>
//                 <input
//                   id="phone"
//                   type="tel"
//                   placeholder="Enter phone number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-emerald-300"
//                 />
//                 <button
//                   type="button"
//                   onClick={checkStatus}
//                   className="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
//                 >
//                   <CheckCircle2 className="mr-2 h-4 w-4" />
//                   Check order status
//                 </button>
//                 {status && (
//                   <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
//                     <span className="font-semibold text-white">Status:</span>{" "}
//                     {status}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }
