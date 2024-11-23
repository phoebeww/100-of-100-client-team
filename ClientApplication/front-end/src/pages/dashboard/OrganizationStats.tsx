import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ApiService from "../../services/api";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DepartmentStatsProps {
  clientId: string;
  departmentId: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DepartmentStats: React.FC<DepartmentStatsProps> = ({ clientId, departmentId }) => {
  const [budgetStats, setBudgetStats] = useState<any>(null);
  const [perfStats, setPerfStats] = useState<any>(null);
  const [posStats, setPosStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      console.log('Fetching stats for department:', departmentId);
      try {
        const [budgetRes, perfRes, posRes] = await Promise.all([
          ApiService.getDepartmentBudgetStats(clientId, departmentId),
          ApiService.getDepartmentPerfStats(clientId, departmentId),
          ApiService.getDepartmentPosStats(clientId, departmentId)
        ]);

        console.log('Budget stats:', budgetRes.data);
        console.log('Performance stats:', perfRes.data);
        console.log('Position stats:', posRes.data);

        setBudgetStats(budgetRes.data);
        console.log('Budget stats:', budgetStats);
        setPerfStats(perfRes.data);
        console.log('Performance stats:', perfStats);
        setPosStats(posRes.data);
        console.log('Position stats:', posStats);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load department statistics');
      } finally {
        setLoading(false);
      }
    };

    if (clientId && departmentId) {
      fetchStats();
    }
  }, [clientId, departmentId]);

  if (loading) {
    return <div className="text-center py-4">Loading statistics...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!budgetStats || !perfStats || !posStats) {
    return <div className="text-center py-4">No statistics available</div>;
  }

 // Transform position statistics for pie chart
 const positionData = Object.entries(posStats).map(([name, value]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
  value: Number(value) || 0
})).filter(item => item.value > 0);

// Transform performance data for line chart
const performanceData = [
  { name: "Lowest", value: perfStats.lowest || 0 },
  { name: "25th", value: perfStats.percentile25 || 0 },
  { name: "Median", value: perfStats.median || 0 },
  { name: "75th", value: perfStats.percentile75 || 0 },
  { name: "Highest", value: perfStats.highest || 0 }
].filter(item => item.value !== 0);

// Transform salary data for bar chart
const salaryData = [
  { name: "Average", value: Number(budgetStats.average) || 0 },
  { name: "Lowest", value: Number(budgetStats.lowest) || 0 },
  { name: "Highest", value: Number(budgetStats.highest) || 0 }
].filter(item => item.value > 0);

return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Position Distribution Chart */}
    <Card>
  <CardHeader>
    <CardTitle>Position Distribution</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-[300px]">
      {positionData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={positionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}  // 移除标签
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {positionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, entry) => {
                const total = positionData.reduce((sum, item) => sum + item.value, 0);
                const percent = ((value as number) / total * 100).toFixed(1);
                return [`${value} (${percent}%)`, name];
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No position data available
        </div>
      )}
    </div>
  </CardContent>
</Card>

    {/* Performance Distribution Chart */}
    {performanceData.some(item => item.value > 0) && (
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Performance Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )}

    {/* Department Overview */}
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Department Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
            <p className="mt-1 text-2xl font-semibold">
              ${budgetStats.total?.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Salary</h3>
            <p className="mt-1 text-2xl font-semibold">
              ${budgetStats.average?.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Performance</h3>
            <p className="mt-1 text-2xl font-semibold">
              {perfStats.average?.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
};

export default DepartmentStats;