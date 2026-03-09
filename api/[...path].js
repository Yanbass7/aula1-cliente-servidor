const app = require('../server');

module.exports = (req, res) => {
  // No Vercel, esta função responde em /api/*.
  // Normalizamos a URL para o Express continuar enxergando /alunos, etc.
  if (typeof req.url === 'string' && req.url.startsWith('/api')) {
    req.url = req.url.slice('/api'.length) || '/';
  }

  return app(req, res);
};

