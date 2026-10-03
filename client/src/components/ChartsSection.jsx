import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export default function ChartsSection({ orders = [], invoices = [] }) {
  const dataList = orders.length > 0 ? orders : invoices;

  // Compute Status Distribution
  const statusCounts = dataList.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Paid', value: statusCounts['Paid'] || 1, color: '#16A34A' },
    { name: 'Delivered / Verified', value: (statusCounts['Delivered'] || 0) + (statusCounts['Received & Verified'] || 0) + 1, color: '#22C55E' },
    { name: 'In Transit', value: (statusCounts['Out for Delivery'] || 0) + (statusCounts['In Transit'] || 0) + 1, color: '#4ADE80' },
    { name: 'Processing / Dispatched', value: (statusCounts['Order Processing'] || 0) + (statusCounts['Order Dispatched'] || 0) + 1, color: '#86EFAC' },
    { name: 'Issue / Replacement', value: statusCounts['Issue Reported'] || 1, color: '#15803D' }
  ];

  // Monthly Cashflow Data in clean green shades
  const monthlyData = [
    { month: 'Jun', paid: 180000, pending: 45000 },
    { month: 'Jul', paid: 240000, pending: 60000 },
    { month: 'Aug', paid: 310000, pending: 85000 },
    { month: 'Sep', paid: 289000, pending: 125000 },
    { month: 'Oct', paid: 340000, pending: 86000 },
  ];

  const processingTimeData = [
    { week: 'W1 Sep', avgDays: 4.2 },
    { week: 'W2 Sep', avgDays: 3.5 },
    { week: 'W3 Sep', avgDays: 2.8 },
    { week: 'W4 Sep', avgDays: 2.1 },
    { week: 'W1 Oct', avgDays: 1.4 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 font-sans">
      
      {/* CHART 1: ORDER STATUS DISTRIBUTION */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
        <h3 className="text-sm font-bold text-charcoal-900 mb-1">
          Order Status Distribution
        </h3>
        <p className="text-xs text-charcoal-500 mb-4">Breakdown by current lifecycle stage</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2EFE7', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: MONTHLY PAYOUT FLOW */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
        <h3 className="text-sm font-bold text-charcoal-900 mb-1">
          Monthly Payout Flow (₹)
        </h3>
        <p className="text-xs text-charcoal-500 mb-4">Paid vs Pending monthly volume comparison</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2EFE7', fontSize: '12px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="paid" name="Paid Volume" fill="#16A34A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pending" name="Pending Volume" fill="#86EFAC" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 3: AVERAGE PROCESSING DURATION TREND */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-charcoal-900">
              Average Payment Processing Turnaround Time
            </h3>
            <p className="text-xs text-charcoal-500">Days from order placement to final payment settlement</p>
          </div>
          <span className="text-xs bg-brand-100 text-brand-800 font-extrabold px-3 py-1 rounded-full border border-brand-200">
            ⚡ 68% Faster Clearances with FlowGuard AI
          </span>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processingTimeData}>
              <defs>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} unit="d" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2EFE7', fontSize: '12px' }} />
              <Area type="monotone" dataKey="avgDays" name="Avg Turnaround (Days)" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
