const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunos.controller');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de alunos exigem usuário autenticado
router.get('/alunos', authMiddleware, alunosController.listarAlunos);
router.get('/alunos/:id', authMiddleware, alunosController.buscarAluno);
router.post('/alunos', authMiddleware, alunosController.criarAluno);
router.put('/alunos/:id', authMiddleware, alunosController.atualizarAluno);
router.delete('/alunos/:id', authMiddleware, alunosController.deletarAluno);

module.exports = router;