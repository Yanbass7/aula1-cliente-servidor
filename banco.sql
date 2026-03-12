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
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Caso a tabela já exista sem a coluna role, descomente e rode:
-- ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

-- O usuário administrador (admin@admin.com, senha qwertyuiop) é criado automaticamente
-- no primeiro login bem-sucedido com essas credenciais pelo backend.