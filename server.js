require('dotenv').config();   // carrega o .env

const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const alunosRoutes = require('./routes/alunos.routes');

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