"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, Share2, User, Clock } from "lucide-react";
import { AudioFile } from "@/types/audio";
import toast from "react-hot-toast";

interface AudioCardProps {
  audio: AudioFile;
}

export function AudioCard({ audio }: AudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audio.fileUrl);

    const updateProgress = () => {
      if (audioRef.current) {
        const percent =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent || 0);
      }
    };

    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });
    audioRef.current.addEventListener("timeupdate", updateProgress);

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [audio.fileUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setProgress(0);
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = async () => {
    try {
      toast.loading("Iniciando download...");

      const apiUrl = `/api/download-audio?url=${encodeURIComponent(
        audio.fileUrl
      )}&name=${encodeURIComponent(audio.fileName)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Erro ao buscar arquivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = audio.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Download iniciado!");
    } catch {
      toast.dismiss();
      toast.error("Erro ao baixar o arquivo");
    }
  };

  const handleShare = async () => {
    try {
      toast.loading("Preparando arquivo...");

      const apiUrl = `/api/download-audio?url=${encodeURIComponent(
        audio.fileUrl
      )}&name=${encodeURIComponent(audio.fileName)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Erro ao buscar arquivo");
      }

      const blob = await response.blob();
      const file = new File([blob], audio.fileName, { type: "audio/mpeg" });

      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: audio.title,
            text: `Confira este áudio: ${audio.title}`,
          });
          toast.dismiss();
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            toast.success("Arquivo pronto para compartilhar!");
          } else {
            toast.dismiss();
          }
        }
      } else {
        toast.dismiss();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = audio.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Arquivo baixado! Você pode compartilhá-lo manualmente.");
      }
    } catch (error) {
      toast.error("Erro ao preparar arquivo para compartilhamento");
    }
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border-border/50 bg-card/80 backdrop-blur-sm hover:-translate-y-2 hover:border-purple-500/50">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Progress bar */}
      {isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl mb-2 truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {audio.title}
            </h3>
            {audio.author && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="truncate">{audio.author}</span>
              </div>
            )}
          </div>

          {/* Play button icon */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              isPlaying
                ? "bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50 scale-110"
                : "bg-muted group-hover:bg-muted/80"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {audio.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs px-3 py-1 bg-muted hover:bg-primary/20 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {audio.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-3 py-1">
              +{audio.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={togglePlay}
            className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Tocar
              </>
            )}
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
            className="h-12 px-4 border-border/50 hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            size="lg"
            className="h-12 px-4 border-border/50 hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(audio.uploadedAt).toLocaleDateString("pt-BR")}</span>
        </div>
      </div>
    </Card>
  );
}
