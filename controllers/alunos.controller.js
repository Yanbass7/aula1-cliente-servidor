const db = require('../database/database');


// LISTAR TODOS
exports.listarAlunos = (req, res) => {
  db.query("SELECT * FROM alunos", (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
};


// BUSCAR POR ID
exports.buscarAluno = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM alunos WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensagem: "Aluno não encontrado" });
    }

    res.json(results[0]);
  });
};


// INSERIR
exports.criarAluno = (req, res) => {
  const { nome, idade, curso } = req.body;

  db.query(
    "INSERT INTO alunos (nome, idade, curso) VALUES (?, ?, ?) RETURNING id",
    [nome, idade, curso],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({
        mensagem: "Aluno criado com sucesso!",
        id: result.insertId
      });
    }
  );
};


// ATUALIZAR
exports.atualizarAluno = (req, res) => {
  const id = req.params.id;
  const { nome, idade, curso } = req.body;

  db.query(
    "UPDATE alunos SET nome = ?, idade = ?, curso = ? WHERE id = ?",
    [nome, idade, curso, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Aluno não encontrado" });
      }

      res.json({ mensagem: "Aluno atualizado com sucesso!" });
    }
  );
};


// DELETAR
exports.deletarAluno = (req, res) => {
  const id = req.params.id;

  // Apenas administrador pode excluir
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ mensagem: 'Apenas o administrador pode excluir alunos.' });
  }

  db.query("DELETE FROM alunos WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Aluno não encontrado" });
    }

    res.json({ mensagem: "Aluno deletado com sucesso!" });
  });
};