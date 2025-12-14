# MySoundPadRex 🎵

Aplicativo moderno para gerenciar e compartilhar áudios, inspirado no MyInstants.

## 🚀 Funcionalidades

- ✅ Upload de arquivos MP3 com título, autor e tags
- ✅ Sistema de aprovação para evitar spam
- ✅ Filtros por tags
- ✅ Player de áudio inline
- ✅ Download e compartilhamento de áudios
- ✅ Autenticação com Google
- ✅ Painel administrativo para aprovar/rejeitar uploads
- ✅ Design moderno e responsivo (mobile-first)
- ✅ Integração completa com Firebase

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Firebase** - Autenticação, Storage e Firestore
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## ⚙️ Configuração

### 1. Configurar Email de Admin

Edite o arquivo `.env.local` e adicione seu email de administrador:

```env
NEXT_PUBLIC_ADMIN_EMAIL=seu_email@gmail.com
```

⚠️ **Importante**: Use o mesmo email que você usará para fazer login com Google!

### 2. Configurar Regras do Firebase

#### Firestore Rules

No Firebase Console, vá em **Firestore Database > Rules** e adicione:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /audios/{audioId} {
      // Qualquer usuário autenticado pode ler áudios aprovados
      allow read: if request.auth != null && resource.data.status == 'approved';

      // Qualquer usuário autenticado pode criar (sempre com status pending)
      allow create: if request.auth != null &&
                       request.resource.data.status == 'pending' &&
                       request.resource.data.uploadedBy == request.auth.uid;

      // Apenas admin pode atualizar (aprovar/rejeitar)
      allow update: if request.auth != null &&
                       request.auth.token.email == 'SEU_EMAIL_ADMIN@gmail.com';

      // Admin pode ler tudo (incluindo pending)
      allow read: if request.auth != null &&
                     request.auth.token.email == 'SEU_EMAIL_ADMIN@gmail.com';
    }
  }
}
```

#### Storage Rules

No Firebase Console, vá em **Storage > Rules** e adicione:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /audios/{fileName} {
      // Qualquer usuário autenticado pode fazer upload
      allow create: if request.auth != null &&
                       request.resource.contentType.matches('audio/.*') &&
                       request.resource.size < 10 * 1024 * 1024; // Max 10MB

      // Todos podem ler (para ouvir e baixar)
      allow read: if true;

      // Apenas admin pode deletar
      allow delete: if request.auth != null &&
                       request.auth.token.email == 'SEU_EMAIL_ADMIN@gmail.com';
    }
  }
}
```

### 3. Habilitar Autenticação Google

No Firebase Console:

1. Vá em **Authentication > Sign-in method**
2. Habilite **Google**
3. Configure o email de suporte

### 4. Criar Índice no Firestore

Execute a aplicação e tente filtrar. O Firebase mostrará um link no console para criar o índice automaticamente.

Ou crie manualmente no Firebase Console:

- Collection: `audios`
- Fields: `status` (Ascending), `approvedAt` (Descending)

## 📦 Instalação e Execução

```bash
# Instalar dependências (já instalado)
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start
```

Acesse: http://localhost:3000

## 📱 Como Usar

### Para Usuários:

1. Faça login com Google
2. Clique em "Adicionar Áudio"
3. Preencha título, autor (opcional) e tags
4. Faça upload do arquivo MP3
5. Aguarde aprovação do admin

### Para Admin:

1. Faça login com o email configurado como admin
2. Clique no botão "Admin" no header
3. Aprove ou rejeite os áudios pendentes

## 🎨 Estrutura do Projeto

```
mysoundpadrex/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Página de administração
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página inicial
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── AudioCard.tsx          # Card de áudio
│   ├── FilterBar.tsx          # Barra de filtros
│   ├── Header.tsx             # Header da aplicação
│   └── UploadModal.tsx        # Modal de upload
├── contexts/
│   └── AuthContext.tsx        # Context de autenticação
├── lib/
│   ├── audio-service.ts       # Serviços de áudio
│   ├── firebase.ts            # Configuração Firebase
│   └── utils.ts               # Utilitários
├── types/
│   └── audio.ts               # Tipos TypeScript
└── .env.local                 # Variáveis de ambiente
```

## 🔒 Segurança

- ✅ Autenticação obrigatória para upload
- ✅ Sistema de aprovação para prevenir spam
- ✅ Validação de tipo de arquivo (apenas áudio)
- ✅ Limite de tamanho de arquivo (10MB)
- ✅ Acesso admin restrito por email

## 📝 Licença

MIT
