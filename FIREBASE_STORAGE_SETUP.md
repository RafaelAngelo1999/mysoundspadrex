# 🔧 Configuração do Firebase Storage

## ❌ Erro Atual

```
ERR_FAILED - CORS policy blocked
```

Isso acontece porque o **Firebase Storage não está configurado** ou as **regras de segurança** estão bloqueando o upload.

---

## ✅ Solução Passo a Passo

### 1️⃣ Acesse o Firebase Console

👉 [https://console.firebase.google.com/project/mysoundspadrex](https://console.firebase.google.com/project/mysoundspadrex)

### 2️⃣ Ative o Firebase Storage

1. No menu lateral, clique em **"Build"** → **"Storage"**
2. Clique em **"Get Started"** (Começar)
3. Será exibido um modal sobre regras de segurança
4. **Selecione "Start in test mode"** (modo teste) e clique **"Next"**
5. Selecione a localização: **"us-central1"** (ou southamerica-east1 para Brasil)
6. Clique em **"Done"** (Concluir)
7. ⚠️ **AGUARDE 1-2 minutos** para o Storage ser provisionado

### 3️⃣ Configure as Regras de Segurança

1. Ainda na página do Storage, clique na aba **"Rules"** (Regras)
2. Substitua as regras padrão por estas:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Permite leitura pública de todos os arquivos
    match /{allPaths=**} {
      allow read: if true;
    }

    // Permite upload apenas na pasta "audios"
    match /audios/{audioFile} {
      allow write: if request.resource.size < 10 * 1024 * 1024  // Máximo 10MB
                   && request.resource.contentType.matches('audio/.*');  // Apenas arquivos de áudio
    }
  }
}
```

3. Clique em **"Publish"** (Publicar)

### 4️⃣ Verifique o Storage Bucket

**IMPORTANTE:** O arquivo `.env.local` foi corrigido automaticamente para:

```
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mysoundspadrex.appspot.com
```

**Nota:** O formato correto para Firebase free tier é `.appspot.com`, não `.firebasestorage.app`

### 5️⃣ Reinicie o Servidor Next.js

```bash
# Pare o servidor (Ctrl+C no terminal) e inicie novamente
npm run dev
```

### 6️⃣ Limpe o Cache do Navegador

- Pressione **Ctrl+Shift+Delete**
- Selecione "Cached images and files"
- Clique em "Clear data"
- Ou simplesmente: **Ctrl+F5** para hard refresh

---

## 📋 Checklist de Verificação

Antes de testar, certifique-se:

- [ ] Storage está ativo no Firebase Console (aba Build → Storage)
- [ ] Regras de segurança foram publicadas
- [ ] `.env.local` tem `mysoundspadrex.appspot.com` (não `.firebasestorage.app`)
- [ ] Servidor Next.js foi reiniciado após mudanças no `.env.local`
- [ ] Cache do navegador foi limpo

---

## 🧪 Teste Após Configuração

1. Acesse: http://localhost:3000
2. Clique no botão **+** (upload) no header
3. Preencha o formulário e selecione um MP3 pequeno (~1MB)
4. Clique em **"Enviar para Aprovação"**
5. Deve aparecer: ✅ **"Áudio enviado para aprovação! 🎉"**

---

## 🚨 Problemas Comuns

### Erro persiste após todas as configurações?

**1. Verifique se o Storage foi realmente ativado:**

- Acesse: https://console.firebase.google.com/project/mysoundspadrex/storage
- Deve mostrar um bucket chamado `mysoundspadrex.appspot.com`
- Se mostrar "Get Started", o Storage NÃO está ativo ainda

**2. Teste o bucket diretamente no console:**

```javascript
// Abra o console do navegador (F12) e cole:
console.log(firebase.app().storage().ref().bucket);
// Deve retornar: "mysoundspadrex.appspot.com"
```

**3. Verifique as regras no Firebase:**

- Aba Storage → Rules
- Deve ter `allow read: if true;` e `allow write:` na pasta audios

**4. Erro específico "HTTP ok status":**

- Significa que o Storage ainda não foi ativado OU
- As regras estão bloqueando (não publicou corretamente)

### Storage Bucket errado no Firebase?

Se o Firebase criou com nome diferente:

1. No Firebase Console, vá em Storage
2. Copie o nome exato do bucket (ex: `mysoundspadrex.appspot.com`)
3. Cole no `.env.local` em `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
4. Reinicie o servidor

---

## 📞 Ainda não funciona?

Compartilhe:

1. Screenshot da página Storage no Firebase Console
2. Screenshot da aba "Rules"
3. Resultado deste comando no terminal:

```bash
cat .env.local | grep STORAGE
```

---

## 💡 Dica Pro

Após ativar o Storage pela primeira vez, **aguarde 1-2 minutos** antes de tentar fazer upload. O Firebase precisa provisionar o bucket e propagar as configurações.
