const db = require('../database/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-trocar-em-producao';
const JWT_EXPIRES_IN = '2h';

exports.registrar = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  db.query('SELECT id FROM usuarios WHERE email = ?', [email], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (rows.length > 0) {
      return res.status(409).json({ mensagem: 'Já existe um usuário com esse e-mail.' });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);

    db.query(
      'INSERT INTO usuarios (email, senha_hash) VALUES (?, ?) RETURNING id',
      [email, senhaHash],
      (insertErr, result) => {
        if (insertErr) {
          return res.status(500).json({ erro: insertErr.message });
        }

        const userId = result.insertId;
        const token = jwt.sign({ id: userId, email }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN
        });

        res.status(201).json({
          mensagem: 'Usuário cadastrado com sucesso.',
          token,
          email
        });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const usuario = rows[0];
    const senhaConfere = bcrypt.compareSync(senha, usuario.senha_hash);

    if (!senhaConfere) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      email: usuario.email
    });
  });
};

