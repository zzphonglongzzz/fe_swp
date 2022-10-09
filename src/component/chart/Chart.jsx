import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Junuary", Total: 1200 },
  { name: "Feb", Total: 1000 },
  { name: "Mar", Total: 800 },
  { name: "April", Total: 1600 },
  { name: "May", Total: 12200 },
  { name: "June", Total: 7000 },
  { name: "July", Total: 7200 },
  { name: "Aug", Total: 600 },
  { name: "Oc", Total: 750 },
  { name: "Nov", Total: 10000 },
  { name: "Dec", Total: 9200 },
];
const Chart = () => {
  return (
    <div className="chart">
      <div className="title"><h4>Last 6 months (Revenue)</h4></div>
      <ResponsiveContainer width="100%" aspect={2/1}>
        <AreaChart
          width={730}
          height={500}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            
          </defs>
          <XAxis dataKey="name" stroke="gray"/>
          {/* <YAxis /> */}
          <CartesianGrid strokeDasharray="3 3" className="chartGrid"/>
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
