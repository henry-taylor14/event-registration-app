import React from 'react';
import { Group } from '../../types/Group';
import { Card, CardContent } from '../ui/card';

interface DashboardStatsProps {
  groups: Group[];
  maxAttendees: number | null;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ groups, maxAttendees }) => {
  const totalRegistrants = groups.reduce((sum, g) => sum + g.groupSize, 0);
  const totalCheckedIn = groups.reduce((sum, g) => sum + g.numberCheckedIn, 0);
  const totalRevenue = groups.reduce((sum, g) => sum + (g.paymentTotal || 0), 0);

  return (
    <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Total Groups</p>
          <p>{groups.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Total Checked In</p>
          <p>{totalCheckedIn}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Spots left</p>
          <p>{maxAttendees ? (maxAttendees - totalRegistrants) : 'N/A'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Total Registrants</p>
          <p>{totalRegistrants}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Total Revenue</p>
          <p>${totalRevenue.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
