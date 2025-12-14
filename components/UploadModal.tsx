"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createAudioSubmission } from "@/lib/audio-service";
import toast from "react-hot-toast";

export function UploadModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("audio/")) {
        setFile(selectedFile);
      } else {
        toast.error("Por favor, selecione um arquivo de áudio válido");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !file || tags.length === 0) {
      toast.error("Preencha título, arquivo e pelo menos uma tag");
      return;
    }

    setLoading(true);
    try {
      await createAudioSubmission({ title, author, tags, file }, user?.uid);

      toast.success("Áudio enviado para aprovação! 🎉");

      // Reset form
      setTitle("");
      setAuthor("");
      setTags([]);
      setFile(null);
      setOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      
      // Mensagem de erro mais detalhada
      if (error instanceof Error) {
        if (error.message.includes("storage/unauthorized")) {
          toast.error("Erro: Firebase Storage não configurado. Veja FIREBASE_STORAGE_SETUP.md");
        } else if (error.message.includes("CORS")) {
          toast.error("Erro de CORS. Configure o Firebase Storage!");
        } else {
          toast.error(`Erro ao fazer upload: ${error.message}`);
        }
      } else {
        toast.error("Erro ao fazer upload. Verifique a configuração do Firebase.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:scale-110 transition-all duration-300"
        >
          <Plus className="w-7 h-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto border-border/50 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-3xl bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Upload de Áudio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Título *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do áudio"
              required
              className="h-12 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author" className="text-base">
              Autor (opcional)
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nome do autor"
              className="h-12 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-base">
              Tags *
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="Digite uma tag"
                className="h-12 bg-background/50 border-border/50 focus:border-primary"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="lg"
                className="h-12 px-6"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="pl-3 pr-1 py-2 text-sm bg-purple-500/10 border-purple-500/20"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-base">
              Arquivo MP3 *
            </Label>
            <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/30">
              <input
                type="file"
                id="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                {file ? (
                  <p className="text-base font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className="text-base font-medium mb-1">
                      Clique para fazer upload
                    </p>
                    <p className="text-sm text-muted-foreground">
                      MP3, WAV, OGG (máx 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-sm text-muted-foreground">
            ℹ️ Seu áudio será enviado para aprovação antes de aparecer no site.
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Enviar para Aprovação"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
