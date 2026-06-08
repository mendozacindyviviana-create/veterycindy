/** Role constants used across the application */
export const ROLES = {
  CLIENT: 'CLIENT',
  VET: 'VET',
  CASHIER: 'CASHIER',
  ADMIN: 'ADMIN',
};

/** Appointment status lifecycle */
export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PAID: 'PAID',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
};

/** Payment status for the cashier flow */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REFUNDED: 'REFUNDED',
};
