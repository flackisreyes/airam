/** Tipos compartidos entre la web pública, la API y el panel de administración. */

export type Schedule = {
  /** Primera hora reservable "HH:MM". */
  firstSlot: string;
  /** Última hora reservable "HH:MM". */
  lastSlot: string;
  /** Minutos entre un horario y el siguiente. */
  stepMinutes: number;
  /** Días de la semana cerrados (0 = domingo … 6 = sábado). */
  closedWeekdays: number[];
  /** Días que se puede reservar por adelantado. */
  maxDaysAhead: number;
  /** Minutos de margen para reservar el mismo día. */
  sameDayLeadMinutes: number;
};

export type Blocked = {
  /** Días completos cerrados (YYYY-MM-DD). */
  dates: string[];
  /** Horas concretas bloqueadas por día: { "2026-12-24": ["18:00", "18:30"] }. */
  slots: Record<string, string[]>;
};

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export type Appointment = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
};

/** Datos públicos de disponibilidad (sin información personal). */
export type Availability = {
  schedule: Schedule;
  blocked: Blocked;
  /** Horas ya ocupadas por citas activas: { "2026-12-01": ["13:00"] }. */
  taken: Record<string, string[]>;
  /** Fecha de hoy en la zona horaria del salón. */
  today: string;
};
