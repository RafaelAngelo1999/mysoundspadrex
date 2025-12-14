# 🔥 Guia Completo de Configuração do Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Add project"**
3. Digite o nome do projeto: **mysoundpadrex**
4. (Opcional) Configure o Google Analytics
5. Clique em **"Criar projeto"**

## Passo 2: Registrar o App Web

1. No painel do projeto, clique no ícone **Web** (</>)
2. Digite um apelido para o app: **MySoundPadRex Web**
3. **Não** marque Firebase Hosting por enquanto
4. Clique em **"Registrar app"**
5. **COPIE** as credenciais que aparecem e cole no arquivo `.env.local`

As credenciais se parecem com isto:
\`\`\`javascript
const firebaseConfig = {
apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
authDomain: "mysoundpadrex.firebaseapp.com",
projectId: "mysoundpadrex",
storageBucket: "mysoundpadrex.appspot.com",
messagingSenderId: "123456789012",
appId: "1:123456789012:web:abcdef123456"
};
\`\`\`

Converta para o formato `.env.local`:
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mysoundpadrex.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mysoundpadrex
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mysoundpadrex.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_ADMIN_EMAIL=seu_email@gmail.com
\`\`\`

## Passo 3: Configurar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Get started"** ou **"Começar"**
3. Vá para a aba **"Sign-in method"** ou **"Método de login"**
4. Clique em **"Google"**
5. Ative o toggle **"Enable"** ou **"Ativar"**
6. Escolha um **email de suporte** (pode ser o seu email)
7. Clique em **"Save"** ou **"Salvar"**

## Passo 4: Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Create database"** ou **"Criar banco de dados"**
3. Escolha **"Start in production mode"** (modo produção)
4. Selecione a localização: **us-central** (ou mais próxima)
5. Clique em **"Enable"** ou **"Ativar"**

### Configurar Regras de Segurança do Firestore

1. Vá para a aba **"Rules"** ou **"Regras"**
2. Copie e cole o conteúdo do arquivo `firestore.rules` deste projeto
3. Clique em **"Publish"** ou **"Publicar"**

### Criar Índices

1. Vá para a aba **"Indexes"** ou **"Índices"**
2. O Firebase pode sugerir índices automaticamente ao usar a aplicação
3. Ou você pode criar manualmente:

**Índice 1:**

- Collection: `audios`
- Fields:
  - `status` (Ascending)
  - `approvedAt` (Descending)
- Query scope: Collection

**Índice 2:**

- Collection: `audios`
- Fields:
  - `status` (Ascending)
  - `uploadedAt` (Descending)
- Query scope: Collection

## Passo 5: Configurar Storage

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Get started"** ou **"Começar"**
3. Aceite as regras padrão e clique em **"Next"** ou **"Próximo"**
4. Escolha a localização (mesma do Firestore)
5. Clique em **"Done"** ou **"Concluir"**

### Configurar Regras de Segurança do Storage

1. Vá para a aba **"Rules"** ou **"Regras"**
2. Copie e cole o conteúdo do arquivo `storage.rules` deste projeto
3. Clique em **"Publish"** ou **"Publicar"**

### Criar pasta audios

1. Vá para a aba **"Files"** ou **"Arquivos"**
2. Clique em **"Create folder"** ou **"Criar pasta"**
3. Digite: `audios`
4. Clique em **"Create"** ou **"Criar"**

## Passo 6: Configurar Email de Admin

No arquivo `.env.local`, configure o email que terá acesso ao painel de administração:

\`\`\`env
NEXT_PUBLIC_ADMIN_EMAIL=seu_email@gmail.com
\`\`\`

**IMPORTANTE:** Use o mesmo email que você vai usar para fazer login com Google na aplicação!

## Passo 7: Testar a Aplicação

1. Salve o arquivo `.env.local` com todas as configurações
2. Execute o projeto:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Abra http://localhost:3000
4. Faça login com Google
5. Teste fazer upload de um áudio
6. Acesse http://localhost:3000/admin para aprovar

## ⚠️ Troubleshooting

### Erro: "Firebase: Error (auth/unauthorized-domain)"

**Solução:**

1. Vá em Authentication > Settings > Authorized domains
2. Adicione `localhost` à lista de domínios autorizados

### Erro: "Missing or insufficient permissions"

**Solução:**

1. Verifique se as regras do Firestore foram publicadas corretamente
2. Certifique-se de que está logado com uma conta autenticada
3. Para ver áudios pendentes, precisa ser admin (email configurado no .env.local)

### Erro: "Storage: User does not have permission"

**Solução:**

1. Verifique se as regras do Storage foram publicadas corretamente
2. Certifique-se de que está fazendo upload de um arquivo de áudio
3. Verifique se o arquivo tem menos de 10MB

### Índices não criados

**Solução:**
O Firebase pode exibir uma mensagem de erro com um link para criar o índice automaticamente. Clique no link que aparece no console do navegador.

## 🎉 Pronto!

Agora sua aplicação está totalmente configurada e pronta para uso!

### Próximos passos:

1. Personalize as cores em `app/globals.css`
2. Adicione mais funcionalidades conforme necessário
3. Configure um domínio personalizado no Firebase Hosting
4. Configure regras de segurança mais específicas se necessário
