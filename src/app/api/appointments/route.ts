import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    where: { date: { gte: new Date() } },
    include: { user: true },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(appointments)
}

