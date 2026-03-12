CREATE TABLE alunos (
	id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INT NOT NULL,
    curso VARCHAR(100) NOT NULL
);

INSERT INTO alunos (nome, curso, idade)
VALUES ('Maria', 'Backend', 22);

SELECT * FROM alunos;

UPDATE alunos
SET idade = 23
WHERE nome = 'Maria';

INSERT INTO alunos (nome, curso, idade)
VALUES ('Pastor', 'papagaiada', 22);

INSERT INTO alunos (nome, curso, idade)
VALUES ('Carlos1', 'backend', 22);

INSERT INTO alunos (nome, curso, idade)
VALUES ('Carlos2', 'frontend', 21);

INSERT INTO alunos (nome, curso, idade)
VALUES ('Carlos3', 'FullStack', 20);


-- ============================================
-- TABELA DE USUÁRIOS PARA LOGIN/CADASTRO REAL
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Exemplo de inserção manual (a senha deve ser um hash gerado no backend com bcrypt)
-- INSERT INTO usuarios (email, senha_hash) VALUES ('admin@exemplo.com', 'HASH_DA_SENHA_AQUI');