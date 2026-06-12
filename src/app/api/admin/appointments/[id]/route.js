import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import {
  cancelAppointment,
  deleteAppointment,
  getAppointmentById,
  markAppointmentRead,
  updateAppointment,
} from '@/lib/content/appointments';

export async function GET(request, { params }) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { id } = await params;
    const appointment = await getAppointmentById(id);
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (!appointment.read) {
      await markAppointmentRead(id);
      appointment.read = true;
    }

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();
    const appointment = await updateAppointment(id, body);
    return NextResponse.json(appointment);
  } catch (error) {
    const status = error.message === 'Appointment not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const result = await deleteAppointment(id);
    return NextResponse.json(result);
  } catch (error) {
    const status = error.message === 'Appointment not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'cancel') {
      const appointment = await cancelAppointment(id);
      return NextResponse.json(appointment);
    }

    if (body.action === 'markRead') {
      const appointment = await markAppointmentRead(id);
      return NextResponse.json(appointment);
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    const status = error.message === 'Appointment not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
