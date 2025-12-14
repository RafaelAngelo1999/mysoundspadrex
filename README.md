# 🎵 MySound Padrex

Uma plataforma moderna de gerenciamento e distribuição de áudio com sistema de aprovação integrado. Construída com tecnologias de ponta para oferecer uma experiência fluida e segura.

## 📋 Visão Geral

O **MySound Padrex** é uma aplicação web que permite:

- Upload e gerenciamento de arquivos de áudio
- Busca e filtro de conteúdo
- Sistema de aprovação em múltiplas camadas (Admin)
- Download seguro de áudio
- Autenticação e controle de acesso

---

## 🔄 Fluxos Principais

### 1. **Fluxo de Upload de Áudio**

```
Usuário → UploadModal → Firebase Storage → Firestore (Status: Pendente)
                           ↓
                      Admin Revisa
                           ↓
                      Status: Aprovado/Rejeitado
```

- Usuários autenticados fazem upload de arquivos
- Arquivos são armazenados no Firebase Storage
- Metadados são registrados no Firestore
- Status inicial: **Pendente de aprovação**

### 2. **Fluxo de Aprovação (Admin)**

```
Painel Admin → Lista de Áudios Pendentes
                     ↓
              Revisar Detalhes
                     ↓
         Aprovar / Rejeitar / Editar
                     ↓
            Atualizar Status no Firestore
```

- Apenas administradores têm acesso
- Visualizam todos os áudios pendentes
- Podem aprovat, rejeitar ou editar metadados
- Alterações são sincronizadas em tempo real

### 3. **Fluxo de Busca e Download**

```
Usuário → SearchBar → FilterBar → Resultados
                           ↓
                    Selecionar Áudio
                           ↓
                    Download via API
                           ↓
                   /api/download-audio
```

- Busca por título, artista e tags
- Filtros por categoria e status
- Download direto via rota segura
- Apenas áudios aprovados são exibidos

---

## 📄 Páginas e Funcionalidades

### **Home (`/`)**

- Hero section com apresentação
- Grid de áudios recentes
- Componentes principais:
  - `SearchBar` - Busca por texto
  - `FilterBar` - Filtros avançados
  - `AudioCard` - Cards com preview de áudio
  - `UploadModal` - Modal para upload

### **Admin (`/admin`)**

- Dashboard exclusivo para administradores
- Lista completa de áudios com status
- Ações:
  - ✅ Aprovar áudio
  - ❌ Rejeitar áudio
  - ✏️ Editar metadados
  - 🔍 Buscar e filtrar
- Controle de permissões via Firestore Rules

### **Download (`/api/download-audio`)**

- Rota protegida para download de arquivos
- Validação de autenticação
- Stream seguro do Firebase Storage
- Logs de acesso

---

## 🛠️ Detalhes Técnicos

### **Stack de Tecnologia**

| Camada             | Tecnologia               |
| ------------------ | ------------------------ |
| **Frontend**       | Next.js 14+ (App Router) |
| **Linguagem**      | TypeScript               |
| **Styling**        | CSS Modules + PostCSS    |
| **Autenticação**   | Firebase Auth            |
| **Banco de Dados** | Cloud Firestore          |
| **Storage**        | Firebase Storage         |
| **UI Components**  | shadcn/ui                |

### **Arquitetura**

```
app/
├── page.tsx              # Home page principal
├── admin/
│   └── page.tsx          # Dashboard de administração
├── api/
│   └── download-audio/   # Rota segura de download
└── layout.tsx            # Layout global

components/
├── Header.tsx            # Navegação principal
├── SearchBar.tsx         # Componente de busca
├── FilterBar.tsx         # Filtros avançados
├── AudioCard.tsx         # Card de áudio
├── UploadModal.tsx       # Modal de upload
└── ui/                   # Componentes shadcn/ui

lib/
├── firebase.ts           # Inicialização Firebase
├── audio-service.ts      # Lógica de áudio
└── utils.ts              # Utilitários globais

contexts/
└── AuthContext.tsx       # Contexto de autenticação

types/
└── audio.ts              # Tipos TypeScript
```

### **Regras de Segurança**

- **Leitura**: Apenas áudios com status `approved`
- **Escrita**: Autenticados podem fazer upload
- **Admin**: Apenas usuários com role `admin`
- **Storage**: Acesso controlado por Firestore Rules

---

## 🚀 Como Começar

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn
- Conta Firebase ativo

### **Instalação**

```bash
# 1. Clone o repositório
git clone <seu-repo>
cd <seu-projeto>

# 2. Instale as dependências
npm install

# 3. Configure o Firebase
# Veja FIREBASE_SETUP.md para detalhes

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env.local com suas credenciais Firebase

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

---

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm start        # Executa build em produção
npm run lint     # Verifica código com ESLint
npm run type-check # Verifica tipos TypeScript
```

---

## 🔐 Autenticação e Autorização

### **Tipos de Usuário**

1. **Usuário Anônimo**

   - Acesso leitura a áudios aprovados
   - Pode pesquisar e filtrar
   - Não pode fazer upload

2. **Usuário Autenticado**

   - Pode fazer upload de áudios
   - Áudios ficam em status pendente
   - Pode baixar áudios aprovados

3. **Administrador**
   - Acesso total ao painel `/admin`
   - Pode aprovar/rejeitar áudios
   - Pode editar metadados
   - Visualiza áudios pendentes

---

## 📚 Documentação Adicional

- [SETUP.md](SETUP.md) - Instruções de setup completo
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Configuração Firebase
- [FIRESTORE_SETUP.md](FIRESTORE_SETUP.md) - Setup do Firestore
- [FIREBASE_STORAGE_SETUP.md](FIREBASE_STORAGE_SETUP.md) - Setup Storage
- [ADMIN_SETUP.md](ADMIN_SETUP.md) - Configuração de administradores
- [QUICK_START.md](QUICK_START.md) - Início rápido

---

## 🎨 Componentes Principais

### **AudioCard**

Exibe informações de um áudio com player integrado

### **UploadModal**

Modal para upload de novos arquivos com validação

### **FilterBar**

Filtros avançados por categoria, duração, data, etc.

### **Header**

Navegação principal e informações do usuário

---

## 🚢 Deploy

A aplicação está pronta para deploy em:

- **Vercel** (recomendado para Next.js)
- **Firebase Hosting**
- **Qualquer plataforma com suporte a Node.js**

Veja a documentação específica em [SETUP.md](SETUP.md).

---

## 📝 License

Este projeto está sob licença privada.

---

**Desenvolvido com ❤️ para MySound Padrex**
