import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 🔐 Senha padrão criptografada
  const hashedPassword = await bcrypt.hash('123456', 10)

  // 👤 Criar usuários
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@clinic.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  const assistant = await prisma.user.upsert({
    where: { email: 'assistente@clinic.com' },
    update: {},
    create: {
      name: 'Assistente',
      email: 'assistente@clinic.com',
      password: hashedPassword,
      role: Role.ASSISTANT,
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: 'cliente@clinic.com' },
    update: {},
    create: {
      name: 'Cliente Exemplo',
      email: 'cliente@clinic.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
    },
  })

  // 🛍️ Produtos
  await prisma.product.createMany({
    data: [
      {
        name: 'Kit Clareamento Dental',
        description: 'Clareamento dental caseiro com moldeiras',
        price: 299.9,
        imageUrl: 'https://via.placeholder.com/300x200?text=Kit+Clareamento',
      },
      {
        name: 'Escova Sônica',
        description: 'Escova com tecnologia de limpeza sônica',
        price: 159.0,
        imageUrl: 'https://via.placeholder.com/300x200?text=Escova+Sônica',
      },
    ],
  })

  // 📅 Agendamentos
  await prisma.appointment.create({
    data: {
      userId: customer.id,
      date: new Date(),
      time: '14:30',
      note: 'Consulta inicial e avaliação',
    },
  })

  console.log('✅ Seed concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
