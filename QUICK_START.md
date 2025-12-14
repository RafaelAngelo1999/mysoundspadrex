# 🎵 MySoundPadRex - Guia Rápido

## ✅ Checklist de Configuração

Antes de usar a aplicação, certifique-se de:

- [ ] Ter criado um projeto no Firebase Console
- [ ] Configurado Authentication (Google)
- [ ] Criado o Firestore Database
- [ ] Configurado o Storage
- [ ] Copiado as credenciais para `.env.local`
- [ ] Definido o email de admin no `.env.local`
- [ ] Executado `npm install`

📖 Veja o guia detalhado em: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 🚀 Iniciar Aplicação

\`\`\`bash
npm run dev
\`\`\`

Acesse: http://localhost:3000

## 📱 Funcionalidades Principais

### 1. Login de Usuário

- Clique em **"Login com Google"**
- Selecione sua conta Google
- Pronto! Você está autenticado

### 2. Navegar e Ouvir Áudios

- **Clique no botão "Tocar"** para ouvir um áudio
- **Clique novamente** para pausar e reiniciar
- Use o botão de **Download** para baixar o MP3
- Use o botão de **Compartilhar** para compartilhar o link

### 3. Filtrar por Tags

- Selecione tags no filtro para ver apenas áudios específicos
- Clique em "Limpar filtros" para ver todos novamente
- Múltiplas tags podem ser selecionadas

### 4. Fazer Upload de Áudio

1. Faça login com Google
2. Clique em **"Adicionar Áudio"**
3. Preencha os campos:
   - **Título** (obrigatório)
   - **Autor** (opcional)
   - **Tags** (obrigatório - pelo menos uma)
   - **Arquivo MP3** (obrigatório - máx 10MB)
4. Clique em **"Enviar para Aprovação"**
5. Aguarde a aprovação do admin

### 5. Administração (apenas para admins)

1. Faça login com o email configurado como admin
2. Clique no botão **"Admin"** no header
3. Visualize áudios pendentes
4. Clique no botão **"🎵 Ouvir Áudio"** para verificar
5. Aprove ou Rejeite conforme apropriado

## 🎨 Personalização

### Alterar Cores do Tema

Edite o arquivo `app/globals.css` e modifique as variáveis CSS:

\`\`\`css
:root {
--primary: 262.1 83.3% 57.8%; /_ Cor primária _/
--primary-foreground: 210 20% 98%;
/_ ... outras cores _/
}
\`\`\`

### Adicionar Mais Provedores de Login

Edite `contexts/AuthContext.tsx` e adicione novos métodos, como:

- `signInWithEmail` (email/senha)
- `signInWithFacebook`
- `signInWithGitHub`

## 🔒 Segurança

### Regras Importantes

- Apenas usuários autenticados podem fazer upload
- Uploads ficam pendentes até aprovação
- Apenas o admin pode aprovar/rejeitar
- Limite de 10MB por arquivo
- Apenas arquivos de áudio são aceitos

### Modificar Email de Admin

No arquivo `.env.local`:
\`\`\`env
NEXT_PUBLIC_ADMIN_EMAIL=novo_admin@gmail.com
\`\`\`

## 🐛 Solução de Problemas

### Erro ao fazer login

- Verifique se o Google Auth está habilitado no Firebase
- Adicione `localhost` aos domínios autorizados

### Erro ao carregar áudios

- Verifique as regras do Firestore
- Certifique-se de que existem áudios aprovados

### Erro ao fazer upload

- Verifique as regras do Storage
- Certifique-se de que o arquivo é um áudio
- Verifique se o arquivo tem menos de 10MB

### Página de admin não aparece

- Verifique se o email no `.env.local` está correto
- Faça logout e login novamente
- Use o mesmo email configurado no arquivo

## 📊 Estrutura do Banco de Dados

### Collection: audios

Cada documento contém:
\`\`\`typescript
{
id: string;
title: string;
author?: string;
tags: string[];
fileUrl: string;
fileName: string;
fileSize: number;
status: 'pending' | 'approved' | 'rejected';
uploadedBy: string; // UID do usuário
uploadedAt: Timestamp;
approvedBy?: string; // UID do admin
approvedAt?: Timestamp;
}
\`\`\`

## 🚀 Deploy em Produção

### Opção 1: Vercel (Recomendado)

\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

Adicione as variáveis de ambiente no painel da Vercel.

### Opção 2: Firebase Hosting

\`\`\`bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
\`\`\`

## 📝 Próximos Passos

- [ ] Adicionar sistema de favoritos
- [ ] Implementar busca por texto
- [ ] Adicionar estatísticas de reprodução
- [ ] Criar sistema de comentários
- [ ] Implementar playlists
- [ ] Adicionar tema dark/light manual
- [ ] Criar PWA para instalação no celular

## 💡 Dicas de Uso

- Use tags descritivas e consistentes
- Mantenha títulos curtos e claros
- Revise áudios regularmente no painel admin
- Faça backup das regras do Firebase
- Monitore o uso do Storage

## 📧 Suporte

Se tiver problemas:

1. Consulte [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. Verifique o console do navegador (F12)
3. Verifique os logs do Firebase Console
4. Abra uma issue no GitHub

---

Feito com ❤️ usando Next.js, Firebase e shadcn/ui
