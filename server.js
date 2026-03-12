require('dotenv').config();   // carrega o .env

const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Rota da landing page (login/cadastro)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Arquivos estáticos (inclui index.html, CSS, JS etc.)
app.use(express.static(path.join(__dirname, 'public')));

const alunosRoutes = require('./routes/alunos.routes');
const authRoutes = require('./routes/auth.routes');

// Rotas de autenticação
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Rotas protegidas de alunos
app.use('/api', alunosRoutes);
// Compatibilidade com ambientes que removem o prefixo /api ao rotear a função serverless
app.use('/', alunosRoutes);

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}