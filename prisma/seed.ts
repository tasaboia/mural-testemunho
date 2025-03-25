import { PrismaClient } from '@prisma/client'
import { Role, Categoria } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // Limpar banco de dados
  await prisma.amem.deleteMany({})
  await prisma.testemunho.deleteMany({})
  await prisma.usuario.deleteMany({})

  // Criar usuários
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@exemplo.com',
      nome: 'Administrador',
      imagemPerfil: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: Role.ADMIN,
    },
  })

  const user1 = await prisma.usuario.create({
    data: {
      email: 'maria@exemplo.com',
      nome: 'Maria Silva',
      imagemPerfil: 'https://randomuser.me/api/portraits/women/2.jpg',
      role: Role.USER,
    },
  })

  const user2 = await prisma.usuario.create({
    data: {
      email: 'joao@exemplo.com',
      nome: 'João Santos',
      imagemPerfil: 'https://randomuser.me/api/portraits/men/3.jpg',
      role: Role.USER,
    },
  })

  // Criar testemunhos
  const testemunho1 = await prisma.testemunho.create({
    data: {
      titulo: 'Milagre de cura na minha família',
      conteudo: 'Minha filha estava muito doente e, após muita oração, ela foi completamente curada. Glória a Deus!',
      categoria: Categoria.CURA,
      aprovado: true,
      autorId: user1.id,
    },
  })

  const testemunho2 = await prisma.testemunho.create({
    data: {
      titulo: 'Provisão financeira inesperada',
      conteudo: 'Estava passando por dificuldades financeiras e recebi uma provisão inesperada que cobriu todas as minhas dívidas.',
      categoria: Categoria.PROVISAO,
      aprovado: true,
      autorId: user2.id,
    },
  })

  const testemunho3 = await prisma.testemunho.create({
    data: {
      titulo: 'Restauração do meu casamento',
      conteudo: 'Meu casamento estava em crise, mas após um período de oração e aconselhamento, Deus restaurou nossa relação.',
      categoria: Categoria.FAMILIA,
      aprovado: true,
      autorId: user1.id,
    },
  })

  const testemunhoAnonimo = await prisma.testemunho.create({
    data: {
      titulo: 'Libertação de vício',
      conteudo: 'Sofri por anos com um vício, mas pela graça de Deus fui completamente liberto.',
      categoria: Categoria.LIBERTACAO,
      aprovado: true,
      anonimo: true,
    },
  })
  
  const testemunhoNaoAprovado = await prisma.testemunho.create({
    data: {
      titulo: 'Aguardando aprovação',
      conteudo: 'Este testemunho está aguardando aprovação do administrador.',
      categoria: Categoria.OUTRO,
      aprovado: false,
      autorId: user2.id,
    },
  })

  // Criar amens
  await prisma.amem.create({
    data: {
      testemunhoId: testemunho1.id,
      usuarioId: user2.id,
    },
  })

  await prisma.amem.create({
    data: {
      testemunhoId: testemunho1.id,
      usuarioId: admin.id,
    },
  })

  await prisma.amem.create({
    data: {
      testemunhoId: testemunho2.id,
      usuarioId: user1.id,
    },
  })

  await prisma.amem.create({
    data: {
      testemunhoId: testemunho3.id,
      usuarioId: admin.id,
    },
  })

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 