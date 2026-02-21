import { useContext } from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const StudentProgress = () => {
    const { darkMode } = useTheme();

    // Mock data
    const data = [
        { name: 'React Basics', progress: 80 },
        { name: 'Python', progress: 45 },
        { name: 'AI Fundamentals', progress: 20 },
    ];

    const stats = [
        { label: 'Courses in Progress', value: 2 },
        { label: 'Completed Courses', value: 1 },
        { label: 'Hours Spent', value: 12 },
        { label: 'Points Earned', value: 350 },
    ];

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <Sidebar />
            <div className="flex-1 p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6">My Progress</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className={`p-4 rounded shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className={`p-6 rounded shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <h2 className="text-xl font-semibold mb-6">Course Completion Rates</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
                                <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
                                <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: darkMode ? '#333' : '#fff',
                                        borderColor: darkMode ? '#555' : '#ccc',
                                        color: darkMode ? '#fff' : '#000'
                                    }}
                                />
                                <Bar dataKey="progress" fill="#8884d8" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;
