import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase mb-4">
        ERROR 404
      </span>
      <h1 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 uppercase tracking-widest mb-4">
        PAGE NOT FOUND
      </h1>
      <p className="text-sm text-zinc-400 max-w-md mb-8 font-light leading-relaxed">
        The score or scene you are looking for does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-medium uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105"
      >
        <ArrowLeft size={16} /> RETURN TO HOME
      </Link>
    </div>
  );
}
