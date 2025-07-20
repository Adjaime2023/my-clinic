import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const now = new Date()

  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(startOfToday)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)

  const [todayAppointments, weekAppointments, pendingAppointments, canceledAppointments] = await Promise.all([
    prisma.appointment.count({
      where: { date: { gte: startOfToday }, canceled: false },
    }),
    prisma.appointment.count({
      where: { date: { gte: startOfWeek }, canceled: false },
    }),
    prisma.appointment.count({
      where: { date: { gte: now }, canceled: false },
    }),
    prisma.appointment.count({
      where: { canceled: true },
    }),
  ])

  return NextResponse.json({
    todayAppointments,
    weekAppointments,
    pendingAppointments,
    canceledAppointments,
  })
}
