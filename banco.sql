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