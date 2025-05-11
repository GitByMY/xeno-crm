import React from 'react';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for dashboard
  const stats = [
    { name: 'Total Customers', value: '1,284', icon: <Users className="w-5 h-5" />, color: 'bg-primary-500' },
    { name: 'Active Campaigns', value: '3', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-accent-500' },
    { name: 'Campaign Delivery Rate', value: '94%', icon: <CheckCircle className="w-5 h-5" />, color: 'bg-success-500' },
    { name: 'New Customers (30d)', value: '+124', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-secondary-500' },
  ];

  const recentCampaigns = [
    { 
      id: '1', 
      name: 'Summer Sale Promotion', 
      date: '2 days ago', 
      audienceSize: 743, 
      sentCount: 712, 
      status: 'completed',
      performance: 'High engagement from premium customers with 96% delivery rate'
    },
    { 
      id: '2', 
      name: 'Re-engagement for Inactive Users', 
      date: '1 week ago', 
      audienceSize: 521, 
      sentCount: 486, 
      status: 'completed',
      performance: 'Moderate success with 12% response rate from previously inactive customers'
    },
    { 
      id: '3', 
      name: 'First Purchase Discount', 
      date: 'Today', 
      audienceSize: 124, 
      sentCount: 89, 
      status: 'in-progress',
      performance: 'Ongoing campaign targeting new subscribers'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/campaigns/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-soft rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3 text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white shadow-soft rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Campaigns</h2>
          <button
            onClick={() => navigate('/campaigns/history')}
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            View all
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{campaign.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{campaign.audienceSize} customers</div>
                    <div className="text-xs text-gray-500">{campaign.sentCount} messages sent</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.status === 'completed' 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-accent-100 text-accent-800'
                    }`}>
                      {campaign.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {campaign.performance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white shadow-soft rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/customers')}
              className="w-full flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 text-left"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 text-primary-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">View All Customers</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => navigate('/campaigns/create')}
              className="w-full flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 text-left"
            >
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-accent-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">Create New Campaign</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => navigate('/campaigns/history')}
              className="w-full flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 text-left"
            >
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-secondary-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">View Performance Analytics</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-white shadow-soft rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-success-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Healthy Delivery Rate</h4>
                <p className="text-sm text-gray-500">Your campaign delivery rate is above industry average.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-warning-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Customer Data Update</h4>
                <p className="text-sm text-gray-500">Consider refreshing customer data for more accurate segmentation.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Growth Trend</h4>
                <p className="text-sm text-gray-500">Your customer base has grown by 10% in the last 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;