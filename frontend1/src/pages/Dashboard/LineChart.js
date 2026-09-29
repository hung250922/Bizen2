import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
const intl = Intl.NumberFormat();
// const s = [
//   { name: "Jan", sales: 400, revenue: 240 },
//   { name: "Feb", sales: 300, revenue: 180 },
//   { name: "Mar", sales: 500, revenue: 300 },
//   { name: "Apr", sales: 200, revenue: 120 },
//   { name: "May", sales: 450, revenue: 270 },
// ];


const LineChartComponent = ({ data = [], lineNames = ["Sale M", "Sale A", "Sale E"] }) => {
  return (
    <ResponsiveContainer height={400} width="100%"> 
        <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>    
            <CartesianGrid strokeDasharray="3 3" /> 
            <XAxis dataKey="name" 
              // tickFormatter={(value) => {
              //   return intl.format(value);
              //   //return value;
              // }}
            />
            <YAxis 
              tickFormatter={(value) => {
                if(lineNames[0].includes("Sale")) {
                  return (intl.format(value) + "đ");
                }
                return (intl.format(value));
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#00e676" name={lineNames[0]} strokeWidth={3} activeDot={{ r: 8 }} dot={true} />
            <Line type="monotone" dataKey="value2" stroke="#f9a825" name={lineNames[1]} strokeWidth={3} activeDot={{ r: 8 }} dot={true} />
            <Line type="monotone" dataKey="value3" stroke="#f44336" name={lineNames[2]} strokeWidth={3} activeDot={{ r: 8 }} dot={true} />
        </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;