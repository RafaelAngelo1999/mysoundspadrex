"use client";

import Link from "next/link";
import { Music } from "lucide-react";
import { UploadModal } from "./UploadModal";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              MySoundPadRex
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">
              Compartilhe seus áudios
            </p>
          </div>
        </Link>

        {/* Upload Button */}
        <UploadModal />
      </div>
    </header>
  );
}
