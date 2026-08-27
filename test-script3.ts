import { getMonthlySchedule } from './src/utils/monthlySchedule';
console.log(getMonthlySchedule(1).filter(m => m.id <= '2026-08').map(m => m.id));
