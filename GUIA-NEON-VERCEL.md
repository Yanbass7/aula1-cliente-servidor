# Guia: Postgres (Neon) + Vercel (Express)

Este documento descreve **como este projeto foi adaptado** para usar **Postgres (Neon)** e ser **hospedado na Vercel**, incluindo comandos e ajustes feitos.

---

## 1) Visão geral da arquitetura

- **Banco**: Postgres no **Neon**.
- **Backend/API**: Express (`server.js`).
- **Deploy**: Vercel, usando **Serverless Functions** em `api/[...path].js` para encaminhar requisições para o Express.
- **Frontend estático**: pasta `public/` servida pelo Express.

Rotas da API (Express):
- `GET /api/alunos`
- `GET /api/alunos/:id`
- `POST /api/alunos`
- `PUT /api/alunos/:id`
- `DELETE /api/alunos/:id`

Arquivos importantes:
- `database/database.js`: conexão com Postgres via `pg`.
- `controllers/alunos.controller.js`: CRUD.
- `routes/alunos.routes.js`: define as rotas.
- `api/[...path].js`: handler para Vercel.
- `vercel.json`: roteamento/build para Vercel.

---

## 2) Migração: MySQL → Postgres (pg)

Este projeto foi ajustado para Postgres com o pacote `pg`.

### 2.1 Dependência

Instalação:

```bash
npm install pg
```

### 2.2 Ajustes de SQL e placeholders

No MySQL é comum usar `?` como placeholder. No Postgres (pg), placeholders são `$1`, `$2`, etc.

Para manter compatibilidade com os controllers já usando `?`, foi criado um **adapter** em `database/database.js` que converte:

- `SELECT ... WHERE id = ?` → `SELECT ... WHERE id = $1`

### 2.3 INSERT com RETURNING

No Postgres, para obter o id criado, usa-se:

```sql
INSERT ... RETURNING id
```

O adapter converte a resposta para uma estrutura semelhante ao que o controller esperava (`insertId`).

### 2.4 SSL

No Neon, **SSL é obrigatório** (a URL costuma vir com `?sslmode=require`).
O `database/database.js` habilita SSL automaticamente quando detecta Neon/sslmode.

---

## 3) Configurando o Neon (Postgres)

### 3.1 Criar projeto/banco

1. Criar um projeto no Neon.
2. Selecionar a branch (ex.: `main`) e o database (ex.: `neondb`).

### 3.2 Criar as tabelas no Neon (SQL Editor)

No Neon, abrir o **SQL Editor** (dentro do projeto/banco) e executar o SQL do arquivo `banco.sql`.

Sugestão de script inicial (idempotente):

```sql
CREATE TABLE IF NOT EXISTS alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INT NOT NULL,
  curso VARCHAR(100) NOT NULL
);

INSERT INTO alunos (nome, curso, idade)
VALUES ('Maria', 'Backend', 22);

SELECT * FROM alunos;
```

Observação:
- Avisos como `Relation "alunos" already exists, skipping` são normais quando você usa `IF NOT EXISTS`.

---

## 4) Variáveis de ambiente (.env) local

### 4.1 Criar o arquivo `.env`

Na raiz do projeto, criar um arquivo chamado exatamente:

```text
.env
```

Dentro dele, colocar pelo menos:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST.neon.tech/neondb?sslmode=require
```

O Neon também fornece outras variáveis (`POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.). Você pode colar todas no `.env`; o projeto usa preferencialmente `DATABASE_URL`.

### 4.2 Não versionar o `.env`

Adicionar ao `.gitignore`:

```text
.env
```

**Por quê?** O `.env` contém credenciais e não deve ser publicado no GitHub.

---

## 5) Carregar `.env` no servidor (dotenv)

### 5.1 Instalar dotenv

```bash
npm install dotenv
```

### 5.2 Atualizar `server.js`

No topo do `server.js` (primeira linha):

```js
require('dotenv').config();
```

Isso garante que `process.env.DATABASE_URL` esteja disponível localmente.

### 5.3 Teste local

```bash
npm start
```

Teste no navegador:
- `http://localhost:3000/api/alunos`

---

## 6) Subir para o GitHub (commits)

Exemplo de fluxo (caso tenha iniciado do zero):

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aula1-cliente-servidor.git
git push -u origin main
```

Importante:
- Confirme que o `.env` **não** entrou no commit (`.gitignore` deve ignorar).

---

## 7) Deploy na Vercel

### 7.1 Importar projeto

1. Vercel → **Add New Project**
2. Importar o repositório do GitHub.
3. Root Directory: `./` (raiz).

### 7.2 Environment Variables na Vercel

No projeto da Vercel:
**Settings → Environment Variables**

Adicionar pelo menos:
- `DATABASE_URL` = a URL do Neon (mesmo valor do seu `.env` local)

Opcionalmente, adicionar também as demais chaves do Neon:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

Você pode usar o botão **Import .env** na Vercel para colar o conteúdo do seu `.env` e criar tudo automaticamente.

### 7.3 Handler serverless

O arquivo `api/[...path].js` expõe o Express como função serverless e remove o prefixo `/api` quando necessário:

- Requisição Vercel `/api/...` → Express continua vendo `/...`

### 7.4 Corrigir 404 de `/api/*` na Vercel (ponto crítico)

O problema encontrado foi:
- `GET /api/alunos` retornando **404 NOT_FOUND** (a função não estava sendo roteada corretamente).

A correção foi adicionar/ajustar o `vercel.json` para forçar o build e roteamento para `api/[...path].js`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/[...path].js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/[...path].js"
    }
  ]
}
```

Depois disso:

```bash
git add vercel.json
git commit -m "Configurar rotas da Vercel"
git push
```

E a Vercel fez redeploy automaticamente.

### 7.5 Teste em produção

Após deploy:
- `https://SEU_PROJETO.vercel.app/api/alunos`

Se o frontend estiver usando `fetch("/api/alunos")`, ele deve funcionar automaticamente no domínio da Vercel.

---

## 8) Checklist final

- [ ] Tabela `alunos` criada no Neon e com dados (testado via SQL Editor).
- [ ] `.env` existe apenas localmente e está no `.gitignore`.
- [ ] `dotenv` instalado e `require('dotenv').config()` no topo do `server.js`.
- [ ] Variável `DATABASE_URL` configurada na Vercel.
- [ ] `api/[...path].js` existe no GitHub.
- [ ] `vercel.json` roteando tudo para `api/[...path].js`.
- [ ] `GET /api/alunos` funcionando na URL da Vercel.

