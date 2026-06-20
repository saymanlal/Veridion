import { prisma } from '../../lib/prisma';
import { recordSecurityLog } from '../../services/auditLog';
import { AppError } from '../../utils/errors';
import { generateTicketId } from '../../utils/ids';
import type { CreateTicketInput } from './support.schemas';

function serializeTicket(ticket: {
  displayId: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  date: Date;
  emailNotifications: boolean;
  attachments: { filename: string }[];
  responses: { sender: string; date: Date; message: string }[];
}) {
  return {
    id: ticket.displayId,
    category: ticket.category,
    subject: ticket.subject,
    description: ticket.description,
    status: ticket.status,
    date: ticket.date.toISOString().replace('T', ' ').slice(0, 19),
    emailNotifications: ticket.emailNotifications,
    attachments: ticket.attachments.map((a) => a.filename),
    responses: ticket.responses.map((r) => ({
      sender: r.sender,
      date: r.date.toISOString().replace('T', ' ').slice(0, 19),
      message: r.message,
    })),
  };
}

export async function createTicket(
  userId: string | undefined,
  input: CreateTicketInput,
  files: Express.Multer.File[],
) {
  const ticket = await prisma.ticket.create({
    data: {
      displayId: generateTicketId(),
      userId,
      name: input.name,
      email: input.email,
      category: input.category,
      subject: input.subject,
      description: input.description,
      emailNotifications: input.emailNotifications,
      attachments: {
        create: files.map((file) => ({
          filename: file.originalname,
          path: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),
      },
      responses: {
        create: {
          sender: 'System Gatekeeper',
          message: 'Automated verification check complete. Case assigned to Tier 2 Security Analyst.',
        },
      },
    },
    include: { attachments: true, responses: true },
  });

  if (userId) {
    await recordSecurityLog(userId, `Support ticket filed: ${ticket.displayId}`, 'SUCCESS');
  }

  return serializeTicket(ticket);
}

export async function listTickets(userId: string) {
  const tickets = await prisma.ticket.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    include: { attachments: true, responses: true },
  });
  return tickets.map(serializeTicket);
}

export async function getTicket(userId: string, displayId: string) {
  const ticket = await prisma.ticket.findFirst({
    where: { userId, displayId },
    include: { attachments: true, responses: true },
  });
  if (!ticket) throw AppError.notFound('Ticket not found');
  return serializeTicket(ticket);
}

export async function trackTicket(displayId: string) {
  const ticket = await prisma.ticket.findFirst({
    where: { displayId },
    include: { attachments: true, responses: true },
  });
  if (!ticket) throw AppError.notFound('No ticket found with that reference code');
  return serializeTicket(ticket);
}

export async function getAttachment(userId: string, displayId: string, filename: string) {
  const ticket = await prisma.ticket.findFirst({ where: { userId, displayId } });
  if (!ticket) throw AppError.notFound('Ticket not found');

  const attachment = await prisma.ticketAttachment.findFirst({
    where: { ticketId: ticket.id, filename },
  });
  if (!attachment) throw AppError.notFound('Attachment not found');

  return attachment;
}
