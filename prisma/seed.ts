import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const db = new PrismaClient();
const id = (n: number) => `10000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const photo = (key: string) => `https://images.unsplash.com/${key}?auto=format&fit=crop&w=1000&q=85`;
async function main() {
  const passwordHash = await bcrypt.hash('Demo@2026', 12);
  for (const [n, name, email, role] of [[1, 'Marina Costa', 'visitante@rota.demo', 'VISITANTE'], [2, 'Lucas • Café da Ilha', 'parceiro@rota.demo', 'ESTABELECIMENTO'], [3, 'Administrador', 'admin@rota.demo', 'ADMIN']] as const) await db.user.upsert({ where: { email }, update: {}, create: { chave: id(n), name, email, role, passwordHash } });
  await db.platformSettings.upsert({ where: { chave: 'platform' }, update: {}, create: { chave: 'platform' } });
  const places = [
    { name: 'Café da Ilha', category: 'Gastronomia', type: 'ESTABELECIMENTO' as const, description: 'Uma pausa com sabor de Floripa. Cafés especiais, pães artesanais e um cantinho acolhedor para descobrir o melhor da produção local.', address: 'Rua das Flores, 128 • Centro (endereço fictício)', latitude: -27.5969, longitude: -48.5495, photos: [photo('photo-1501339847302-ac426a4a7cbb')], minMinutes: 5, maxMinutes: 120, phone: '(48) 3333-0101', hours: 'Segunda a sábado, 8h às 19h', ownerId: id(2) },
    { name: 'Mirante da Lagoa', category: 'Natureza', type: 'PONTO_TURISTICO' as const, description: 'O azul da lagoa encontra o verde das montanhas. Respire fundo e aproveite uma das vistas mais bonitas da ilha.', address: 'Rodovia Admar Gonzaga • Lagoa da Conceição', latitude: -27.5902, longitude: -48.4712, photos: [photo('photo-1470770841072-f978cf4d019e')], minMinutes: 5, maxMinutes: 120, phone: '', hours: 'Todos os dias, 6h às 18h' },
    { name: 'Mercado de Sabores', category: 'Gastronomia', type: 'ESTABELECIMENTO' as const, description: 'Ingredientes frescos, receitas da ilha e boas conversas. Conheça um espaço dedicado à gastronomia e aos pequenos produtores.', address: 'Rua Conselheiro Mafra, 60 • Centro (local fictício)', latitude: -27.5991, longitude: -48.5523, photos: [photo('photo-1414235077428-338989a2e8c0')], minMinutes: 10, maxMinutes: 180, phone: '(48) 3333-0102', hours: 'Terça a domingo, 11h às 22h' },
    { name: 'Ateliê Raízes', category: 'Cultura', type: 'ESTABELECIMENTO' as const, description: 'Peças feitas à mão e histórias que atravessam gerações. Descubra o trabalho de artesãos locais e leve um pedacinho da ilha.', address: 'Rua Felipe Schmidt, 210 • Centro (local fictício)', latitude: -27.5958, longitude: -48.5511, photos: [photo('photo-1452860606245-08befc0ff44b')], minMinutes: 5, maxMinutes: 90, phone: '(48) 3333-0103', hours: 'Segunda a sábado, 9h às 18h' },
    { name: 'Ponte Hercílio Luz', category: 'Cultura', type: 'PONTO_TURISTICO' as const, description: 'Um encontro com a história de Florianópolis. Caminhe pelo cartão-postal da cidade e descubra novos ângulos da baía.', address: 'Ponte Hercílio Luz • Centro', latitude: -27.5933, longitude: -48.5656, photos: [photo('photo-1519501025264-65ba15a82390')], minMinutes: 5, maxMinutes: 120, phone: '', hours: 'Área externa de livre visitação' },
    { name: 'Pousada Brisa Azul', category: 'Hospedagem', type: 'ESTABELECIMENTO' as const, description: 'Um refúgio para desacelerar, com hospitalidade local e uma vista especial para o mar. Cadastro fictício aguardando aprovação.', address: 'Rua do Mar, 42 • Campeche (local fictício)', latitude: -27.6805, longitude: -48.4811, photos: [photo('photo-1445019980597-93fa8acb246c')], minMinutes: 15, maxMinutes: 240, phone: '(48) 3333-0104', hours: 'Recepção: 8h às 22h' },
  ];
  for (const [i, place] of places.entries()) await db.place.upsert({ where: { chave: id(10 + i) }, update: {}, create: { chave: id(10 + i), ...place, approval: i === 5 ? 'PENDENTE' : 'APROVADO' } });
  for (const [i, route] of [
    { name: 'Sabores & histórias do Centro', description: 'Um passeio a pé entre cafés, sabores e a cultura de quem faz a ilha acontecer.', image: photo('photo-1517248135467-4c7edcad34c4'), category: 'Gastronomia & cultura', duration: '2–3 horas', stops: [10, 12, 13] },
    { name: 'Um novo olhar sobre a ilha', description: 'Paisagens que convidam a fazer uma pausa. Explore o centro e termine com uma vista inesquecível.', image: photo('photo-1470770841072-f978cf4d019e'), category: 'Natureza & descobertas', duration: '3–4 horas', stops: [14, 10, 11] },
  ].entries()) {
    const { stops, ...data } = route;
    await db.route.upsert({ where: { chave: id(30 + i) }, update: {}, create: { chave: id(30 + i), ...data, stops: { create: stops.map((n, position) => ({ placeId: id(n), position })) } } });
  }
  // Historical examples are explicitly seeded; no live GPS validation is bypassed by the API.
  for (const [i, placeId] of [id(10), id(13)].entries()) {
    const endedAt = new Date(Date.now() - (i + 3) * 86400000);
    const startedAt = new Date(endedAt.getTime() - 1200000);
    await db.visit.upsert({ where: { chave: id(50 + i) }, update: {}, create: { chave: id(50 + i), userId: id(1), placeId, status: 'VALIDA', startedAt, endedAt, lastSeenAt: endedAt, dwellSeconds: 1200, minMinutes: 5, maxMinutes: 120, radiusMeters: 150, maxAccuracyMeters: 100, maxGapSeconds: 120, awardedPoints: 100, reason: 'Exemplo histórico fictício do seed.' } });
    await db.pointTransaction.upsert({ where: { visitId: id(50 + i) }, update: {}, create: { userId: id(1), visitId: id(50 + i), source: 'VISITA', amount: 100, description: `Visita a ${i ? 'Ateliê Raízes' : 'Café da Ilha'} • demonstração`, datahoracad: endedAt } });
  }
  const review = await db.review.upsert({ where: { visitId: id(51) }, update: {}, create: { userId: id(1), placeId: id(13), visitId: id(51), rating: 5, comment: 'Um lugar cheio de histórias e peças lindas! Avaliação fictícia de demonstração.' } });
  await db.pointTransaction.upsert({ where: { reviewId: review.chave }, update: {}, create: { userId: id(1), reviewId: review.chave, source: 'AVALIACAO', amount: 25, description: 'Avaliação de Ateliê Raízes • demonstração' } });
  for (const [i, phone] of [
    { name: 'Polícia Militar', number: '190', category: 'Emergência', description: 'Atendimento de emergência policial.' },
    { name: 'SAMU', number: '192', category: 'Emergência', description: 'Serviço de Atendimento Móvel de Urgência.' },
    { name: 'Corpo de Bombeiros', number: '193', category: 'Emergência', description: 'Incêndios, resgates e salvamentos.' },
    { name: 'Defesa Civil', number: '199', category: 'Serviço público', description: 'Situações de risco e desastres.' },
  ].entries()) await db.usefulPhone.upsert({ where: { chave: id(70 + i) }, update: {}, create: { chave: id(70 + i), ...phone } });
  console.log('Demonstração criada. Contas: visitante@rota.demo, parceiro@rota.demo, admin@rota.demo. Senha: Demo@2026');
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
