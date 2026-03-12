const jwt = require('jsonwebtoken');

// Precisa ser o mesmo segredo usado para assinar o token no login/cadastro.
// Em produção, configure via variável de ambiente.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-trocar-em-producao';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';

  // Esperamos o formato: "Bearer <token>"
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  try {
    // Se o token for válido, o payload vira req.user (ex.: { id, email, role }).
    // Controllers podem usar req.user.role para regras de permissão (admin vs user).
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    // jwt.verify lança erro em token inválido, expirado, ou assinado com outro segredo.
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;

