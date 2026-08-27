import { getMemberScheduleSummary } from './src/utils/monthlySchedule';
const summary = getMemberScheduleSummary('test', [], 1);
console.log(summary.totalDue);
