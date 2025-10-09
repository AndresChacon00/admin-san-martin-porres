Run the SQL migration files in the migrations/ folder against your sqlite database (san-martin.db).

From PowerShell (workspace root):

# preview the SQL

Get-Content .\migrations\20251008_cursos_periodo_idcurso_text.sql | Out-Host

# Apply migration (make a backup first)

copy .\san-martin.db .\san-martin.db.bak;
sqlite3 .\san-martin.db < .\migrations\20251008_cursos_periodo_idcurso_text.sql

Notes:

- The migration recreates the cursos_periodo table with id_curso as TEXT and copies existing rows.
- If you have additional constraints or indexes on cursos_periodo, add statements to recreate them in the SQL file.
- Always backup the DB before running migrations.
