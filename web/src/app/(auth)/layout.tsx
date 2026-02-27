import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Back to home link */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                    <div className="w-6 h-6 bg-white/10 backdrop-blur-sm rounded-md flex items-center justify-center border border-white/20">
                        <span className="font-display font-bold text-white text-[8px]">H</span>
                    </div>
                    <span className="font-display font-bold text-xs tracking-wider">HACKTHONIX</span>
                </Link>
            </div>

            <main className="relative z-10 w-full max-w-md p-4">
                {children}
            </main>
        </div>
    )
}
