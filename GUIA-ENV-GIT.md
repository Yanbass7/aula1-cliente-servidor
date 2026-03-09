## Guia rápido: `.env` + GitHub no VS Code

Este guia explica:
- **Como criar/configurar o `.env`** neste projeto.
- **Como configurar sua conta GitHub no VS Code**.
- **Comandos Git essenciais** usados no terminal.

---

## 1) `.env` – o que é e por que usar

- Arquivo que guarda **variáveis de ambiente** (senhas, URLs de banco, tokens).
- **Nunca** deve ser enviado para o GitHub.
- Neste projeto, é usado para guardar a **connection string do Neon** (`DATABASE_URL`).

---

## 2) Criando o `.env` neste projeto

### 2.1 Nome do arquivo

Na raiz do projeto (`aula1-cliente-servidor`), crie um arquivo chamado **exatamente**:

```text
.env
```

Sem nada antes nem depois (sem extensão `.txt` etc.).

### 2.2 Conteúdo base do `.env`

Exemplo (usando os dados fornecidos pelo Neon):

```env
# Recommended for most uses
DATABASE_URL=postgresql://neondb_owner:SEU_TOKEN@ep-seu-host-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require

# (Opcional) Outras variáveis sugeridas pelo Neon
POSTGRES_URL=postgresql://neondb_owner:SEU_TOKEN@ep-seu-host-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_PRISMA_URL=postgresql://neondb_owner:SEU_TOKEN@ep-seu-host-pooler.sa-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:SEU_TOKEN@ep-seu-host.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

> Substitua a URL pelo valor **exato** que o Neon mostrar na aba `.env.local`.

### 2.3 Carregar o `.env` no Node (dotenv)

1. Instalar o pacote:

   ```bash
   npm install dotenv
   ```

2. No topo do `server.js`, adicionar:

   ```js
   require('dotenv').config();
   ```

Com isso, `process.env.DATABASE_URL` passa a ter o valor definido no `.env`.

### 2.4 Garantir que o `.env` não vá para o GitHub

No arquivo `.gitignore` na raiz do projeto, adicionar (se ainda não existir):

```text
.env
```

Assim o Git ignora o `.env` quando você fizer `git add .`.

---

## 3) Configurando sua conta GitHub no VS Code

Existem duas partes:
- Autenticar o VS Code na sua conta GitHub.
- Configurar nome/e‑mail do Git localmente.

### 3.1 Autenticar VS Code com GitHub (GUI)

1. Abra o **VS Code**.
2. No canto esquerdo, clique em **Source Control** (ícone de ramificação).
3. Se aparecer a opção **“Publish to GitHub”** ou **“Sign in to GitHub”**, clique nela.
4. O VS Code abrirá o navegador pedindo permissão de acesso ao GitHub:
   - Faça login na sua conta GitHub.
   - Autorize o VS Code.
5. Depois disso, o VS Code já consegue criar repositórios no GitHub e enviar commits.

> Alternativa: usar o botão “Sign in” que aparece no canto inferior esquerdo do VS Code (ícone de conta).

### 3.2 Configurar nome e e‑mail do Git (obrigatório para commits)

Abra o terminal integrado do VS Code (Ctrl+`), e rode:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

Esses dados aparecem como autor dos commits.

---

## 4) Criando e conectando o repositório GitHub

### 4.1 Iniciar Git no projeto (uma vez só)

No terminal, dentro da pasta do projeto:

```bash
cd C:\Users\Yan\Documents\aula1-cliente-servidor
git init
```

### 4.2 Primeiro commit local

```bash
git add .
git commit -m "primeiro commit"
```

### 4.3 Criar repositório no GitHub (pelo site)

1. Vá ao GitHub → **New Repository**.
2. Nome sugerido: `aula1-cliente-servidor`.
3. Crie o repositório **vazio** (sem adicionar README, .gitignore, etc. – ou, se adicionar, faça depois um `git pull`).

### 4.4 Ligar o repositório local ao remoto

No terminal do VS Code:

```bash
git remote add origin https://github.com/SEU_USUARIO/aula1-cliente-servidor.git
git branch -M main
git push -u origin main
```

Depois disso, o projeto estará no GitHub.

---

## 5) Fluxo diário de trabalho com Git (comandos principais)

### 5.1 Ver mudanças

```bash
git status
```

### 5.2 Adicionar arquivos modificados ao próximo commit

```bash
git add arquivo1 arquivo2
```

Ou tudo de uma vez:

```bash
git add .
```

### 5.3 Criar um commit com mensagem

```bash
git commit -m "mensagem explicando a mudança"
```

### 5.4 Enviar para o GitHub

```bash
git push
```

Se for o primeiro push da branch:

```bash
git push -u origin main
```

### 5.5 Trazer mudanças do GitHub para sua máquina

```bash
git pull
```

---

## 6) Integração com Vercel (resumo rápido)

1. Com o repositório já no GitHub, entrar na Vercel e clicar em **Add New Project**.
2. Selecionar o repositório `aula1-cliente-servidor`.
3. Root Directory: `./`.
4. Em **Environment Variables**, importar o `.env` ou criar manualmente:
   - `DATABASE_URL` + outras se necessário.
5. Clicar em **Deploy**.

Cada novo `git push` na branch `main` dispara um novo deploy automático na Vercel.

---

## 7) Resumo rápido

- **`.env`**: guarda segredos (Neon, tokens), nunca vai para o GitHub, é carregado com `dotenv`.
- **Git + GitHub**: configurados via VS Code + comandos básicos (`init`, `add`, `commit`, `push`, `pull`).
- **Vercel**: pega o código do GitHub e usa as Environment Variables (baseadas no `.env`) para conectar ao Neon em produção.

