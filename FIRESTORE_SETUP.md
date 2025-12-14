# 🔧 Configuração do Firestore

## ✅ Configuração Básica (Obrigatória)

### 1️⃣ Ativar Firestore Database
👉 https://console.firebase.google.com/project/mysoundspadrex/firestore

1. Clique em **"Create database"** (Criar banco de dados)
2. Selecione **"Start in test mode"** (modo teste)
3. Escolha a localização: **southamerica-east1** (São Paulo) ou **us-central1**
4. Clique em **"Enable"** (Ativar)

### 2️⃣ Configurar Regras de Segurança

Na aba **"Rules"**, cole estas regras:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Coleção de áudios
    match /audios/{audioId} {
      // Qualquer pessoa pode ler áudios aprovados
      allow read: if resource.data.status == 'approved';
      
      // Qualquer pessoa pode criar novos áudios (status pending)
      allow create: if request.resource.data.status == 'pending';
      
      // Apenas admins podem atualizar (aprovar/rejeitar)
      allow update: if request.auth != null 
                    && request.auth.token.email == 'rafaelangelowow@gmail.com';
      
      // Apenas admins podem deletar
      allow delete: if request.auth != null 
                    && request.auth.token.email == 'rafaelangelowow@gmail.com';
    }
  }
}
```

Clique em **"Publish"**

---

## 📋 Explicação das Regras

### ✅ **Leitura** (`allow read`)
- Apenas áudios com `status: "approved"` são visíveis publicamente
- Áudios pendentes só são visíveis para admins

### ✅ **Criação** (`allow create`)
- Qualquer pessoa pode enviar áudios
- Novos áudios sempre têm `status: "pending"`

### ✅ **Atualização** (`allow update`)
- Apenas o admin (seu email) pode aprovar/rejeitar
- Usado no painel /admin

### ✅ **Deleção** (`allow delete`)
- Apenas o admin pode deletar áudios

---

## 🧪 Teste Após Configuração

### Upload de Áudio
1. Acesse http://localhost:3000
2. Clique no botão **+** no header
3. Preencha título, tags e selecione um MP3
4. Clique em "Enviar para Aprovação"
5. Deve aparecer: ✅ **"Áudio enviado para aprovação! 🎉"**

### Verificar no Firestore
1. Acesse: https://console.firebase.google.com/project/mysoundspadrex/firestore/databases/-default-/data/~2Faudios
2. Deve aparecer um documento com:
   - `status: "pending"`
   - `title`, `author`, `tags`, `fileUrl`, etc.

### Aprovar Áudio (Admin)
1. Crie a página `/admin` (já está no código)
2. Login com seu email
3. Aprove o áudio
4. Deve aparecer na homepage

---

## 🚨 Problemas Comuns

### Erro "Missing or insufficient permissions"
- Verifique se publicou as regras de segurança
- Confirme que o Firestore está ativo

### Áudios não aparecem na homepage
- Verifique se o áudio tem `status: "approved"`
- Apenas áudios aprovados são listados

### Modal de upload trava (loading infinito)
- Erro provavelmente no Firestore (regras ou não ativado)
- Veja o console do navegador (F12) para detalhes

---

## 📞 Próximos Passos

Após configurar o Firestore:
1. ✅ Faça upload de um áudio teste
2. ✅ Acesse o Firestore Console e aprove manualmente:
   - Edite o documento
   - Mude `status` de `"pending"` para `"approved"`
   - Adicione campo `approvedAt` com timestamp atual
3. ✅ Recarregue a homepage - o áudio deve aparecer!

---

## 🔐 Segurança em Produção

As regras atuais estão em **"test mode"** para facilitar desenvolvimento.

Para produção, ajuste:
- Adicione validação de campos obrigatórios
- Limite tamanho de strings
- Adicione rate limiting
- Use Firebase Authentication para identificar usuários
