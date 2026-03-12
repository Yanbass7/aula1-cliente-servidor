Resumo
O que foi instalado: bcryptjs, jsonwebtoken (além de dotenv já existente).
Onde está a lógica de autenticação:
Backend: controllers/auth.controller.js, routes/auth.routes.js, middleware/auth.js, server.js.
Banco: tabela usuarios definida em banco.sql.
Frontend: public/auth.js (login/cadastro) e public/script.js (uso do token + proteção de rotas).
Como funciona:
Cadastro e login chamam o backend.
Senhas são armazenadas como hash no Neon.
Backend devolve um JWT.
Frontend guarda o token e envia em todas as chamadas da API de alunos.
Sem token válido, as rotas de alunos retornam 401.