"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ParkingActivity {
  id: string;
  action: "entry" | "exit";
  licensePlate: string;
  ownerName: string;
  room?: string;
  spaceNumber: string;
  timestamp: string;
  duration?: string;
  amount?: number;
}

interface RecentActivitiesProps {
  activities: ParkingActivity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant={activity.action === "entry" ? "default" : "outline"}
                >
                  {activity.action === "entry" ? "Entrada" : "Salida"}
                </Badge>
                <div>
                  <p className="font-medium">
                    {activity.licensePlate} - {activity.ownerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Espacio {activity.spaceNumber}
                    {activity.room && ` • Habitación ${activity.room}`}
                    {activity.duration && ` • ${activity.duration}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
                {activity.amount && (
                  <p className="text-sm font-medium">
                    ${activity.amount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
