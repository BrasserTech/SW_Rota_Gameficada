-- Script inicial completo. Não executar novamente após prisma migrate deploy.
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VISITANTE', 'ESTABELECIMENTO', 'ADMIN');

-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('ESTABELECIMENTO', 'PONTO_TURISTICO');

-- CreateEnum
CREATE TYPE "Approval" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('EM_ANDAMENTO', 'VALIDA', 'INVALIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "PointSource" AS ENUM ('VISITA', 'AVALIACAO');

-- CreateTable
CREATE TABLE "usuarios" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VISITANTE',
    "city" TEXT NOT NULL DEFAULT 'Florianópolis, SC',
    "stars" INTEGER NOT NULL DEFAULT 0,
    "starsExpiresAt" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "locais" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" "PlaceType" NOT NULL DEFAULT 'ESTABELECIMENTO',
    "approval" "Approval" NOT NULL DEFAULT 'PENDENTE',
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radiusMeters" INTEGER NOT NULL DEFAULT 150,
    "minMinutes" INTEGER NOT NULL DEFAULT 5,
    "maxMinutes" INTEGER NOT NULL DEFAULT 180,
    "photos" TEXT[],
    "phone" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "hours" TEXT NOT NULL DEFAULT '',
    "ownerId" UUID,

    CONSTRAINT "locais_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "visitas" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dwellSeconds" INTEGER NOT NULL DEFAULT 0,
    "minMinutes" INTEGER NOT NULL,
    "maxMinutes" INTEGER NOT NULL,
    "radiusMeters" INTEGER NOT NULL,
    "maxAccuracyMeters" INTEGER NOT NULL,
    "maxGapSeconds" INTEGER NOT NULL,
    "awardedPoints" INTEGER NOT NULL,
    "reason" TEXT,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "amostras_localizacao" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitId" UUID NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "amostras_localizacao_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "visitId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "transacoes_pontos" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "source" "PointSource" NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "visitId" UUID,
    "reviewId" UUID,

    CONSTRAINT "transacoes_pontos_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "rotas" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "rotas_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "rota_paradas" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "routeId" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "rota_paradas_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "participacoes_rotas" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "routeId" UUID NOT NULL,

    CONSTRAINT "participacoes_rotas_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "telefones_uteis" (
    "chave" UUID NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "telefones_uteis_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "configuracoes_plataforma" (
    "chave" TEXT NOT NULL DEFAULT 'platform',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datahoraalt" TIMESTAMP(3) NOT NULL,
    "datahoracad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitPoints" INTEGER NOT NULL DEFAULT 100,
    "reviewPoints" INTEGER NOT NULL DEFAULT 25,
    "cooldownHours" INTEGER NOT NULL DEFAULT 24,
    "maxAccuracyMeters" INTEGER NOT NULL DEFAULT 100,
    "maxGapSeconds" INTEGER NOT NULL DEFAULT 120,
    "starExpirationDays" INTEGER NOT NULL DEFAULT 365,
    "starRule" TEXT NOT NULL DEFAULT 'PENDENTE_DEFINICAO',

    CONSTRAINT "configuracoes_plataforma_pkey" PRIMARY KEY ("chave")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "visitas_userId_status_idx" ON "visitas"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_visitId_key" ON "avaliacoes"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "transacoes_pontos_visitId_key" ON "transacoes_pontos"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "transacoes_pontos_reviewId_key" ON "transacoes_pontos"("reviewId");

-- CreateIndex
CREATE INDEX "transacoes_pontos_userId_datahoracad_idx" ON "transacoes_pontos"("userId", "datahoracad");

-- CreateIndex
CREATE UNIQUE INDEX "rota_paradas_routeId_placeId_key" ON "rota_paradas"("routeId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "rota_paradas_routeId_position_key" ON "rota_paradas"("routeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "participacoes_rotas_userId_routeId_key" ON "participacoes_rotas"("userId", "routeId");

-- AddForeignKey
ALTER TABLE "locais" ADD CONSTRAINT "locais_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "usuarios"("chave") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "locais"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amostras_localizacao" ADD CONSTRAINT "amostras_localizacao_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visitas"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "locais"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visitas"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_pontos" ADD CONSTRAINT "transacoes_pontos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_pontos" ADD CONSTRAINT "transacoes_pontos_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visitas"("chave") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_pontos" ADD CONSTRAINT "transacoes_pontos_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "avaliacoes"("chave") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rota_paradas" ADD CONSTRAINT "rota_paradas_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "rotas"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rota_paradas" ADD CONSTRAINT "rota_paradas_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "locais"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacoes_rotas" ADD CONSTRAINT "participacoes_rotas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacoes_rotas" ADD CONSTRAINT "participacoes_rotas_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "rotas"("chave") ON DELETE RESTRICT ON UPDATE CASCADE;


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
