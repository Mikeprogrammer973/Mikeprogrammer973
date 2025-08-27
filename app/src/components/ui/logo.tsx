import Link from "next/link";

export default function Logo()
{
    return (
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform duration-300">
            <span className="font-mono tracking-tighter">mdp</span>
          </div>
        </Link>
    )
}