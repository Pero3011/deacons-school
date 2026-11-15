export const TERMS = ["Term1", "Term2", "Term3"] as const;
export type Term = (typeof TERMS)[number];

// Confirm these against your database. Run in SQL:
//   SELECT unnest(enum_range(NULL::"AttendanceStatus"));
export const ATTENDANCE_STATUSES = ["Present", "Absent", "Late", "Excused"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export function isTerm(value: unknown): value is Term {
  return typeof value === "string" && (TERMS as readonly string[]).includes(value);
}

export function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return (
    typeof value === "string" &&
    (ATTENDANCE_STATUSES as readonly string[]).includes(value)
  );
}
