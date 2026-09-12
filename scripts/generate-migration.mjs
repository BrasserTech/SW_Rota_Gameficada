import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const dir = 'prisma/migrations/202609120001_initial';
fs.mkdirSync(dir, { recursive: true });
const sql = execFileSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'diff', '--from-empty', '--to-schema-datamodel', 'prisma/schema.prisma', '--script'], { encoding: 'utf8' });
const constraints = `
-- Platform invariants: also enforced for direct SQL writes.
ALTER TABLE usuarios ADD CONSTRAINT usuarios_estrelas CHECK (stars BETWEEN 0 AND 5);
ALTER TABLE locais ADD CONSTRAINT locais_tempos CHECK ("minMinutes" >= 1 AND "maxMinutes" >= "minMinutes" AND "maxMinutes" <= 1440);
ALTER TABLE locais ADD CONSTRAINT locais_coordenadas CHECK (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180 AND "radiusMeters" BETWEEN 10 AND 1000);
ALTER TABLE avaliacoes ADD CONSTRAINT avaliacoes_nota CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE transacoes_pontos ADD CONSTRAINT pontos_positivos CHECK (amount >= 0);
ALTER TABLE transacoes_pontos ADD CONSTRAINT pontos_origem CHECK ((source = 'VISITA' AND "visitId" IS NOT NULL AND "reviewId" IS NULL) OR (source = 'AVALIACAO' AND "reviewId" IS NOT NULL AND "visitId" IS NULL));
ALTER TABLE configuracoes_plataforma ADD CONSTRAINT regras_validas CHECK ("visitPoints" BETWEEN 0 AND 10000 AND "reviewPoints" BETWEEN 0 AND 10000 AND "cooldownHours" BETWEEN 1 AND 720 AND "maxAccuracyMeters" BETWEEN 5 AND 100 AND "maxGapSeconds" BETWEEN 60 AND 300 AND "starExpirationDays" BETWEEN 1 AND 3650 AND "starRule" = 'PENDENTE_DEFINICAO');
CREATE UNIQUE INDEX visita_ativa_por_usuario ON visitas ("userId") WHERE status = 'EM_ANDAMENTO';

-- datahoraalt maintained even when records are changed directly through SQL.
CREATE FUNCTION atualizar_datahoraalt() RETURNS trigger AS $$
BEGIN
  NEW.datahoraalt = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DO $$
DECLARE tabela text;
BEGIN
  FOREACH tabela IN ARRAY ARRAY['usuarios','locais','visitas','amostras_localizacao','avaliacoes','transacoes_pontos','rotas','rota_paradas','participacoes_rotas','telefones_uteis','configuracoes_plataforma'] LOOP
    EXECUTE format('ALTER TABLE %I ALTER COLUMN datahoraalt SET DEFAULT CURRENT_TIMESTAMP', tabela);
    EXECUTE format('CREATE TRIGGER manter_datahoraalt BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION atualizar_datahoraalt()', tabela);
  END LOOP;
END;
$$;
`;
fs.writeFileSync(`${dir}/migration.sql`, sql + constraints);
fs.writeFileSync('migration.sql', '-- Script inicial completo. Não executar novamente após prisma migrate deploy.\n' + sql + constraints);
fs.writeFileSync('prisma/migrations/migration_lock.toml', 'provider = "postgresql"\n');
console.log('migration.sql e migration Prisma geradas.');
