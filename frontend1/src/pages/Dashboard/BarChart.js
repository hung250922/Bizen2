import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import { Typography } from "antd";
const { Title } = Typography;
const intl = Intl.NumberFormat();
// const data = [
//   { name: 'Jan', sales: 400, profit: 450 },
//   { name: 'Feb', sales: 300, profit: 310 },
//   { name: 'Mar', sales: 500, profit: 550 },
//   { name: 'Apr', sales: 200, profit: 210 },
// ];

const BarChartComponent = ({ data = [], barNames = [], title }) => {
  return (
    <>
    <Title level={4}>{title}</Title>
        <ResponsiveContainer height="50%" minHeight="300px" width="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => {
                    if(barNames[0].includes("Sale")) {
                      return (intl.format(value) + "đ");
                    }
                    return (intl.format(value));
                  }}
                >
                    {/* <Label value={title} position="top" offset={20} style={{ fontSize: 16, fontWeight: "bold"}}/> */}
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar name={barNames[0]} dataKey="value" fill="#8884d8" />
                <Bar name={barNames[1]} dataKey="value1" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
     </>
  );
}

export default BarChartComponent;