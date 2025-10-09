BEGIN TRANSACTION;

-- Rename current table to preserve it while we recreate the desired schema
ALTER TABLE cursos_periodo RENAME TO _cursos_periodo_old;

-- Create new cursos_periodo with id_curso as TEXT referencing cursos.codigo
CREATE TABLE cursos_periodo (
  id_periodo TEXT NOT NULL REFERENCES periodos(id_periodo) ON DELETE CASCADE,
  id_curso TEXT NOT NULL REFERENCES cursos(codigo) ON DELETE CASCADE,
  horario TEXT NOT NULL
);

-- Copy rows from the old table, casting id_curso to text
INSERT INTO cursos_periodo (id_periodo, id_curso, horario)
SELECT id_periodo, CAST(id_curso AS TEXT), horario FROM _cursos_periodo_old;

-- If you have indexes or constraints on the old table, recreate them here.
-- DROP the old table after verifying data
DROP TABLE _cursos_periodo_old;

COMMIT;
