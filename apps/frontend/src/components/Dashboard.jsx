import { useState, useEffect } from "react";

export const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalInteractions: 42,
    averageResponse: 2.5,
    userSatisfaction: 92,
    systemUptime: 99.8,
  });

  // Simulated data for interactions over time
  const [interactionData] = useState([
    { hour: "00:00", interactions: 12 },
    { hour: "04:00", interactions: 8 },
    { hour: "08:00", interactions: 24 },
    { hour: "12:00", interactions: 35 },
    { hour: "16:00", interactions: 28 },
    { hour: "20:00", interactions: 42 },
  ]);

  // Simulated sentiment data
  const [sentimentData] = useState([
    { label: "Very Satisfied", value: 68, color: "from-green-400 to-emerald-500" },
    { label: "Satisfied", value: 24, color: "from-blue-400 to-cyan-500" },
    { label: "Neutral", value: 6, color: "from-yellow-400 to-orange-500" },
    { label: "Unsatisfied", value: 2, color: "from-red-400 to-pink-500" },
  ]);

  // Animated chart bars
  const maxInteractions = Math.max(...interactionData.map((d) => d.interactions));

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full overflow-y-auto">
      {/* Header */}
      <div className="pt-8 px-8 pb-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-700 mb-2">Dashboard</h1>
            <p className="text-gray-600">Digital Human AI Assistant Analytics</p>
          </div>
          <button
            onClick={() => onNavigate("chat")}
            className="backdrop-blur-md bg-white bg-opacity-50 hover:bg-opacity-70 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Go to Chat
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Interactions */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-all">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Interactions</p>
            <p className="text-3xl font-bold text-gray-700">{stats.totalInteractions}</p>
            <p className="text-blue-600 text-xs mt-2">↑ 12% from last week</p>
          </div>

          {/* Avg Response Time */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-all">
            <p className="text-gray-600 text-sm font-semibold mb-2">Avg Response Time</p>
            <p className="text-3xl font-bold text-gray-700">{stats.averageResponse}s</p>
            <p className="text-blue-600 text-xs mt-2">↓ 0.3s improvement</p>
          </div>

          {/* User Satisfaction */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-all">
            <p className="text-gray-600 text-sm font-semibold mb-2">User Satisfaction</p>
            <p className="text-3xl font-bold text-gray-700">{stats.userSatisfaction}%</p>
            <p className="text-purple-600 text-xs mt-2">↑ 5% increase</p>
          </div>

          {/* System Uptime */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-all">
            <p className="text-gray-600 text-sm font-semibold mb-2">System Uptime</p>
            <p className="text-3xl font-bold text-gray-700">{stats.systemUptime}%</p>
            <p className="text-green-600 text-xs mt-2">Excellent</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
          {/* Interactions Over Time */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Interactions Over Time</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {interactionData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center w-full">
                  <div className="w-full bg-gray-300 bg-opacity-30 rounded-t-lg relative group overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-blue-400 rounded-t-lg transition-all duration-500 ease-out"
                      style={{
                        height: `${(data.interactions / maxInteractions) * 180}px`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-purple-300 opacity-0 group-hover:opacity-30 transition-opacity" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{data.hour}</p>
                  <p className="text-xs text-gray-500">{data.interactions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Sentiment Distribution */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-6">User Sentiment Distribution</h2>
            <div className="space-y-4">
              {sentimentData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-700">{item.value}%</p>
                  </div>
                  <div className="w-full bg-gray-300 bg-opacity-30 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Pie Chart Representation */}
            <div className="mt-6 flex justify-center">
              <svg width="120" height="120" className="transform">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="15"
                  strokeDasharray={`${sentimentData[0].value * 3.14} 314`}
                  strokeDashoffset="0"
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#grad2)"
                  strokeWidth="15"
                  strokeDasharray={`${sentimentData[1].value * 3.14} 314`}
                  strokeDashoffset={`-${sentimentData[0].value * 3.14}`}
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#grad3)"
                  strokeWidth="15"
                  strokeDasharray={`${sentimentData[2].value * 3.14} 314`}
                  strokeDashoffset={`-${(sentimentData[0].value + sentimentData[1].value) * 3.14}`}
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#grad4)"
                  strokeWidth="15"
                  strokeDasharray={`${sentimentData[3].value * 3.14} 314`}
                  strokeDashoffset={`-${(sentimentData[0].value + sentimentData[1].value + sentimentData[2].value) * 3.14}`}
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Response Quality */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Response Quality Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-sm font-semibold text-gray-700">96%</p>
                </div>
                <div className="w-full bg-gray-300 bg-opacity-30 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 w-[96%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Relevance</p>
                  <p className="text-sm font-semibold text-gray-700">94%</p>
                </div>
                <div className="w-full bg-gray-300 bg-opacity-30 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 w-[94%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Coherence</p>
                  <p className="text-sm font-semibold text-gray-700">98%</p>
                </div>
                <div className="w-full bg-gray-300 bg-opacity-30 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 w-[98%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="backdrop-blur-md bg-white bg-opacity-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { user: "User 42", action: "Started conversation", time: "2 min ago", status: "active" },
                { user: "User 38", action: "Completed session", time: "5 min ago", status: "completed" },
                { user: "User 41", action: "Asked question", time: "8 min ago", status: "active" },
                { user: "User 39", action: "Ended session", time: "12 min ago", status: "completed" },
                { user: "User 37", action: "Started conversation", time: "15 min ago", status: "completed" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "active" ? "bg-green-600" : "bg-gray-400"
                      }`}
                    />
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
