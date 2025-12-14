"use client";

import { useEffect, useState } from "react";
import { getApprovedAudios } from "@/lib/audio-service";
import { AudioFile } from "@/types/audio";
import { Header } from "@/components/Header";
import { AudioCard } from "@/components/AudioCard";
import { SearchBar } from "@/components/SearchBar";
import { UploadModal } from "@/components/UploadModal";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [audios, setAudios] = useState<AudioFile[]>([]);
  const [filteredAudios, setFilteredAudios] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAudios();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAudios(audios);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = audios.filter((audio) => {
      const matchTitle = audio.title.toLowerCase().includes(query);
      const matchAuthor = audio.author?.toLowerCase().includes(query);
      const matchTags = audio.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      return matchTitle || matchAuthor || matchTags;
    });

    setFilteredAudios(filtered);
  }, [searchQuery, audios]);

  const loadAudios = async () => {
    try {
      const data = await getApprovedAudios();
      setAudios(data);
      setFilteredAudios(data);
    } catch (error) {
      console.error("Error loading audios:", error);
      toast.error("Erro ao carregar áudios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Sua biblioteca de áudios definitiva
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Descubra Áudios
            </span>
            <br />
            <span className="text-foreground">Incríveis</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore, compartilhe e ouça os melhores áudios da comunidade. Tudo
            em um só lugar, simples e rápido.
          </p>
        </div>

        {/* Search and Upload */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <SearchBar onSearch={setSearchQuery} />

          <div className="text-sm text-muted-foreground">
            {filteredAudios.length}{" "}
            {filteredAudios.length === 1
              ? "áudio disponível"
              : "áudios disponíveis"}
          </div>
        </div>

        {/* Audios Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            <p className="text-muted-foreground">Carregando áudios...</p>
          </div>
        ) : filteredAudios.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              {searchQuery
                ? "Nenhum resultado encontrado"
                : "Nenhum áudio disponível"}
            </h3>
            <p className="text-muted-foreground text-lg mb-8">
              {searchQuery
                ? "Tente ajustar sua busca ou explorar outros termos"
                : "Seja o primeiro a adicionar um áudio!"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAudios.map((audio) => (
                <AudioCard key={audio.id} audio={audio} />
              ))}
            </div>

            {/* Floating Action Button - Upload */}
            <div className="fixed bottom-8 right-8 z-40">
              <UploadModal />
            </div>
          </>
        )}
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
