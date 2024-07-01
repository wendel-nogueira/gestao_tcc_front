export interface Schedule {
  id?: string;
  name: string;
  startDate: string | Date | undefined;
  endDate: string | Date | undefined;
}
