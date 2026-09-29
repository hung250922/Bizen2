import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
const sampleData = [
  { name: 'Chrome', value: 40 },
  { name: 'Safari', value: 25 },
  { name: 'Firefox', value: 20 },
  { name: 'Edge', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ data = sampleData }) => {
    //console.log("PieChartComponent data:", data);
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }
    return (
        <ResponsiveContainer height={400} width="100%">
            <PieChart>
                <Pie
                    data={data} 
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => 
                        `${name}: ${(percent*100).toFixed(0)}%`
                    }
                >
                    {data.map((entry, index) => (   
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>  
                <Tooltip />
                {/* <Legend /> */}
            </PieChart>
        </ResponsiveContainer>
    );
}

export default PieChartComponent;