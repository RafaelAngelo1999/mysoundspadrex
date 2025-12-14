"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPendingAudios,
  getApprovedAudios,
  approveAudio,
  rejectAudio,
  deleteAudio,
} from "@/lib/audio-service";
import { AudioFile } from "@/types/audio";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Calendar,
  Music,
  LogOut,
  Shield,
  Trash2,
  List,
} from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [pendingAudios, setPendingAudios] = useState<AudioFile[]>([]);
  const [approvedAudios, setApprovedAudios] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      loadAudios();
    }
  }, [authLoading, user, isAdmin, activeTab]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Erro ao fazer login");
    }
  };

  const loadAudios = async () => {
    setLoading(true);
    try {
      if (activeTab === "pending") {
        const data = await getPendingAudios();
        setPendingAudios(data);
      } else {
        const data = await getApprovedAudios();
        setApprovedAudios(data);
      }
    } catch (error) {
      console.error("Error loading audios:", error);
      toast.error("Erro ao carregar áudios");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (audioId: string) => {
    if (!user) return;

    setProcessingId(audioId);
    try {
      await approveAudio(audioId, user.uid);
      toast.success("Áudio aprovado! ✅");
      setPendingAudios(pendingAudios.filter((a) => a.id !== audioId));
    } catch (error) {
      console.error("Error approving audio:", error);
      toast.error("Erro ao aprovar áudio");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (audioId: string) => {
    if (!user) return;

    setProcessingId(audioId);
    try {
      await rejectAudio(audioId, user.uid);
      toast.success("Áudio rejeitado");
      setPendingAudios(pendingAudios.filter((a) => a.id !== audioId));
    } catch (error) {
      console.error("Error rejecting audio:", error);
      toast.error("Erro ao rejeitar áudio");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (audioId: string) => {
    if (!user) return;
    
    if (!confirm("Tem certeza que deseja excluir este áudio permanentemente?")) {
      return;
    }

    setProcessingId(audioId);
    try {
      await deleteAudio(audioId);
      toast.success("Áudio excluído! 🗑️");
      setApprovedAudios(approvedAudios.filter((a) => a.id !== audioId));
    } catch (error) {
      console.error("Error deleting audio:", error);
      toast.error("Erro ao excluir áudio");
    } finally {
      setProcessingId(null);
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // Login Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        <Card className="w-full max-w-md mx-4 p-8 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Faça login para gerenciar os áudios
            </p>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </Button>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar para Home
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <div className="flex gap-3">
            <Button onClick={signOut} variant="outline" className="flex-1">
              Sair
            </Button>
            <Button onClick={() => router.push("/")} className="flex-1">
              Ir para Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline">
                <Music className="w-4 h-4 mr-2" />
                Ver Site
              </Button>
            </Link>
            <Button onClick={signOut} variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab("pending")}
            variant={activeTab === "pending" ? "default" : "outline"}
            className={
              activeTab === "pending"
                ? "bg-gradient-to-r from-purple-500 to-pink-600"
                : ""
            }
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Pendentes ({pendingAudios.length})
          </Button>
          <Button
            onClick={() => setActiveTab("approved")}
            variant={activeTab === "approved" ? "default" : "outline"}
            className={
              activeTab === "approved"
                ? "bg-gradient-to-r from-purple-500 to-pink-600"
                : ""
            }
          >
            <List className="w-4 h-4 mr-2" />
            Aprovados ({approvedAudios.length})
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            {activeTab === "pending" ? "Fila de Aprovação" : "Áudios Aprovados"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {activeTab === "pending"
              ? "Revise e aprove áudios enviados pela comunidade"
              : "Gerencie e exclua áudios aprovados"}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            <p className="text-muted-foreground">Carregando áudios...</p>
          </div>
        ) : activeTab === "pending" && pendingAudios.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Tudo em dia! 🎉</h3>
            <p className="text-muted-foreground text-lg">
              Nenhum áudio pendente de aprovação no momento.
            </p>
          </div>
        ) : activeTab === "approved" && approvedAudios.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Music className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Nenhum áudio aprovado</h3>
            <p className="text-muted-foreground text-lg">
              Aprove áudios pendentes para vê-los aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Audios */}
            {activeTab === "pending" &&
              pendingAudios.map((audio) => (
                <Card
                  key={audio.id}
                  className="p-6 border-border/50 bg-card/80 backdrop-blur-sm hover:border-purple-500/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Audio Info */}
                    <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{audio.title}</h3>

                    <div className="space-y-2 mb-4">
                      {audio.author && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{audio.author}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Enviado em{" "}
                          {audio.uploadedAt.toLocaleDateString("pt-BR")} às{" "}
                          {audio.uploadedAt.toLocaleTimeString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {audio.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-500/10 border-purple-500/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-muted-foreground mb-4 space-y-1">
                      <p>Arquivo: {audio.fileName}</p>
                      <p>
                        Tamanho: {(audio.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <Button
                      onClick={() => playAudio(audio.fileUrl)}
                      variant="outline"
                      className="border-purple-500/30 hover:bg-purple-500/10"
                    >
                      🎵 Ouvir Áudio
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3 lg:w-48">
                    <Button
                      onClick={() => handleApprove(audio.id)}
                      disabled={processingId === audio.id}
                      className="flex-1 lg:w-full h-14 font-semibold bg-green-600 hover:bg-green-700 shadow-lg"
                    >
                      {processingId === audio.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Aprovar
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleReject(audio.id)}
                      disabled={processingId === audio.id}
                      variant="destructive"
                      className="flex-1 lg:w-full h-14 font-semibold shadow-lg"
                    >
                      {processingId === audio.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 mr-2" />
                          Rejeitar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Approved Audios */}
            {activeTab === "approved" &&
              approvedAudios.map((audio) => (
                <Card
                  key={audio.id}
                  className="p-6 border-border/50 bg-card/80 backdrop-blur-sm hover:border-red-500/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        {audio.title}
                      </h3>

                      {audio.author && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <User className="w-4 h-4" />
                          <span>{audio.author}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Aprovado em{" "}
                          {audio.approvedAt?.toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {audio.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-purple-500/10 border-purple-500/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground mb-4 space-y-1">
                        <p>Arquivo: {audio.fileName}</p>
                        <p>
                          Tamanho: {(audio.fileSize / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>

                      <Button
                        onClick={() => playAudio(audio.fileUrl)}
                        variant="outline"
                        className="border-purple-500/30 hover:bg-purple-500/10"
                      >
                        🎵 Ouvir Áudio
                      </Button>
                    </div>

                    {/* Delete Action */}
                    <div className="flex lg:flex-col gap-3 lg:w-48">
                      <Button
                        onClick={() => handleDelete(audio.id)}
                        disabled={processingId === audio.id}
                        variant="destructive"
                        className="flex-1 lg:w-full h-14 font-semibold shadow-lg"
                      >
                        {processingId === audio.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5 mr-2" />
                            Excluir
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
