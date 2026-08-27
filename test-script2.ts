import { getMemberScheduleSummary } from './src/utils/monthlySchedule';
console.log(getMemberScheduleSummary('test', [], 1).totalDue);
console.log(getMemberScheduleSummary('test', [], 2).totalDue);
