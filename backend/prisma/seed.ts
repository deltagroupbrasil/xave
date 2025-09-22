import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { id: 'first-interaction' },
      update: {},
      create: {
        id: 'first-interaction',
        name: 'Primeira Interação',
        description: 'Complete sua primeira conversa com o avatar',
        type: 'INTERACTION_COUNT',
        requirement: { interactions: 1 },
        icon: '🎯',
        xpReward: 50,
      },
    }),
    prisma.achievement.upsert({
      where: { id: 'charmer' },
      update: {},
      create: {
        id: 'charmer',
        name: 'Charmoso(a)',
        description: 'Obtenha uma pontuação acima de 80 em 5 interações',
        type: 'SKILL_LEVEL',
        requirement: { highScores: 5, minScore: 80 },
        icon: '💫',
        xpReward: 100,
      },
    }),
    prisma.achievement.upsert({
      where: { id: 'fashion-guru' },
      update: {},
      create: {
        id: 'fashion-guru',
        name: 'Guru da Moda',
        description: 'Analise 10 looks diferentes',
        type: 'INTERACTION_COUNT',
        requirement: { fashionAnalyses: 10 },
        icon: '👗',
        xpReward: 75,
      },
    }),
    prisma.achievement.upsert({
      where: { id: 'daily-warrior' },
      update: {},
      create: {
        id: 'daily-warrior',
        name: 'Guerreiro(a) Diário',
        description: 'Complete missões diárias por 7 dias consecutivos',
        type: 'STREAK',
        requirement: { dailyStreak: 7 },
        icon: '🔥',
        xpReward: 200,
      },
    }),
  ]);

  console.log(`✅ Created ${achievements.length} achievements`);

  // Create sample missions
  const missions = await Promise.all([
    prisma.mission.upsert({
      where: { id: 'daily-compliment' },
      update: {},
      create: {
        id: 'daily-compliment',
        type: 'DAILY',
        title: 'Elogio Criativo',
        description: 'Crie um elogio original e criativo',
        difficulty: 1,
        requirements: {
          type: 'text_interaction',
          keywords: ['bonita', 'linda', 'incrível', 'especial'],
          minScore: 70,
        },
        xpReward: 25,
      },
    }),
    prisma.mission.upsert({
      where: { id: 'daily-question' },
      update: {},
      create: {
        id: 'daily-question',
        type: 'DAILY',
        title: 'Pergunta Inteligente',
        description: 'Faça uma pergunta interessante para iniciar uma conversa',
        difficulty: 1,
        requirements: {
          type: 'text_interaction',
          mustContain: '?',
          minLength: 15,
        },
        xpReward: 20,
      },
    }),
    prisma.mission.upsert({
      where: { id: 'weekly-fashion' },
      update: {},
      create: {
        id: 'weekly-fashion',
        type: 'WEEKLY',
        title: 'Análise de Estilo',
        description: 'Analise 3 looks diferentes durante a semana',
        difficulty: 2,
        requirements: {
          type: 'fashion_analysis',
          count: 3,
        },
        xpReward: 100,
      },
    }),
  ]);

  console.log(`✅ Created ${missions.length} missions`);

  // Create sample fashion trends
  const fashionTrends = await Promise.all([
    prisma.fashionTrend.upsert({
      where: { id: 'casual-chic-2024' },
      update: {},
      create: {
        id: 'casual-chic-2024',
        name: 'Casual Chic',
        category: 'CASUAL',
        season: 'Verão 2024',
        description: 'Combine peças casuais com acessórios elegantes para um look despojado mas sofisticado',
        tags: ['casual', 'chic', 'verão', 'elegante'],
      },
    }),
    prisma.fashionTrend.upsert({
      where: { id: 'smart-casual-2024' },
      update: {},
      create: {
        id: 'smart-casual-2024',
        name: 'Smart Casual',
        category: 'FORMAL',
        season: 'Verão 2024',
        description: 'O equilíbrio perfeito entre formal e casual para diversas ocasiões',
        tags: ['smart', 'casual', 'versátil', 'moderno'],
      },
    }),
    prisma.fashionTrend.upsert({
      where: { id: 'boho-style-2024' },
      update: {},
      create: {
        id: 'boho-style-2024',
        name: 'Estilo Boho',
        category: 'BOHEMIAN',
        season: 'Primavera 2024',
        description: 'Looks fluidos e naturais com estampas e texturas únicas',
        tags: ['boho', 'natural', 'fluido', 'estampas'],
      },
    }),
  ]);

  console.log(`✅ Created ${fashionTrends.length} fashion trends`);

  // Create a test user (only in development)
  if (process.env.NODE_ENV === 'development') {
    const testUserEmail = 'test@flertegamificado.com';
    
    const existingUser = await prisma.user.findUnique({
      where: { email: testUserEmail },
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash('Test123!', 12);
      
      const testUser = await prisma.user.create({
        data: {
          email: testUserEmail,
          passwordHash,
          firstName: 'Usuário',
          lastName: 'Teste',
          dateOfBirth: new Date('1995-06-15'),
          gender: 'MALE',
          authProvider: 'EMAIL',
          emailVerified: true,
        },
      });

      // Create basic subscription
      await prisma.subscription.create({
        data: {
          userId: testUser.id,
          plan: 'BASIC',
          status: 'ACTIVE',
          startDate: new Date(),
          autoRenew: true,
        },
      });

      // Create character config
      await prisma.characterConfig.create({
        data: {
          userId: testUser.id,
          name: 'Sofia',
          personality: 'friendly',
          interests: ['música', 'cinema', 'viagem', 'culinária'],
          communicationStyle: 'casual',
          responseLength: 'medium',
          humorLevel: 6,
          flirtinessLevel: 5,
          supportivenessLevel: 8,
        },
      });

      console.log(`✅ Created test user: ${testUserEmail} (password: Test123!)`);
    }
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
