# DevTarefas

Sistema de gerenciamento de tarefas diárias com login (e-mail/senha ou Google), categorias, prioridades e dados salvos na nuvem via Firebase.

## Stack

- **Frontend**: React + Vite
- **Autenticação**: Firebase Authentication
- **Banco de dados**: Firestore (cada usuário só acessa seus próprios dados)
- **Hospedagem**: Vercel ou Netlify

## Passo 1 — Criar o projeto no Firebase (gratuito)

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e clique em **Criar projeto**.
2. Dê um nome (ex: `devtarefas`) e siga os passos padrão.
3. No menu lateral, vá em **Build > Authentication** > **Get started**. Ative os métodos **E-mail/senha** e **Google**.
4. Vá em **Build > Firestore Database** > **Criar banco de dados**. Escolha **modo de produção** e a região mais próxima (ex: `southamerica-east1`).
5. Ainda no Firestore, vá na aba **Regras** e cole o conteúdo do arquivo `firestore.rules` deste projeto. Clique em **Publicar**.
6. Volte em **Configurações do projeto** (ícone de engrenagem) > role até **Seus apps** > clique no ícone `</>` (Web) > registre um app (ex: `devtarefas-web`).
7. Copie as credenciais mostradas (`apiKey`, `authDomain`, etc.) — você vai usá-las no próximo passo.

## Passo 2 — Configurar o projeto localmente

```bash
npm install
cp .env.example .env
```

Abra o arquivo `.env` e preencha com as credenciais copiadas do Firebase:

```
VITE_FIREBASE_API_KEY=sua-chave
VITE_FIREBASE_AUTH_DOMAIN=devtarefas-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=devtarefas-xxxx
VITE_FIREBASE_STORAGE_BUCKET=devtarefas-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Rode localmente:

```bash
npm run dev
```

Acesse `http://localhost:5173` — crie uma conta e comece a usar.

## Passo 3 — Deploy na Vercel (recomendado, gratuito)

1. Suba este projeto para um repositório no GitHub.
2. Acesse [vercel.com](https://vercel.com), clique em **Add New > Project** e importe o repositório.
3. Em **Environment Variables**, adicione as mesmas 6 variáveis do seu `.env`.
4. Clique em **Deploy**. Em ~1 minuto seu site estará no ar com uma URL pública.

### Alternativa: Netlify

1. Acesse [netlify.com](https://netlify.com) > **Add new site > Import an existing project**.
2. Conecte o repositório. Build command: `npm run build`. Publish directory: `dist`.
3. Em **Site settings > Environment variables**, adicione as mesmas 6 variáveis.
4. Clique em **Deploy site**.

## Estrutura do projeto

```
devtarefas/
├── src/
│   ├── components/
│   │   ├── Login.jsx        # tela de login/cadastro
│   │   ├── Dashboard.jsx     # painel principal, conecta ao Firestore
│   │   ├── TaskForm.jsx      # formulário de nova tarefa e categoria
│   │   └── TaskItem.jsx      # card individual de tarefa
│   ├── App.jsx               # controla se mostra Login ou Dashboard
│   ├── firebase.js           # inicialização do Firebase
│   └── index.css             # estilos
├── firestore.rules           # regras de segurança (cada usuário só vê seus dados)
└── .env.example
```

## Próximos passos possíveis

- Notificações/lembretes por e-mail para tarefas com prazo próximo
- Edição de tarefas existentes (hoje só é possível concluir ou excluir)
- Compartilhar categorias/tarefas entre uma equipe
- Modo claro/escuro
