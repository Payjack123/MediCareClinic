import React from 'react';
import ReportsClient from './ReportsClient';
import { getReceptionistReportData, getFilterOptions } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Báo Cáo Trong Ngày - Lễ Tân | MediCare',
  description: 'Báo cáo tiếp đón bệnh nhân và đối soát doanh thu chốt két quầy lễ tân trong ngày',
};

export default async function ReceptionistReportsPage() {
  const [reportResult, filterResult] = await Promise.all([
    getReceptionistReportData({ preset: 'today' }),
    getFilterOptions(),
  ]);

  const initialData = reportResult.success ? reportResult.data : null;
  const initialOptions = filterResult.success ? filterResult.data : { specialties: [], doctors: [] };

  return (
    <ReportsClient 
      initialData={initialData} 
      initialOptions={initialOptions} 
    />
  );
}
