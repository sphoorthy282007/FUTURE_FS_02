import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    convertedLeads: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard Stats:", res.data);

      console.log({
        total: res.data.totalLeads,
        new: res.data.newLeads,
        converted: res.data.convertedLeads,
        others:
          res.data.totalLeads -
          res.data.newLeads -
          res.data.convertedLeads,
      });

      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Dashboard Error:", error);
      setLoading(false);
    }
  };

  const chartData = [
  {
    name: "New",
    value: Number(stats.newLeads),
  },
  {
    name: "Converted",
    value: Number(stats.convertedLeads),
  },
  {
    name: "Others",
    value:
      Number(stats.totalLeads) -
      Number(stats.newLeads) -
      Number(stats.convertedLeads),
  },
];

const COLORS = [
  "#60a5fa", // bright blue
  "#4ade80", // bright green
  "#facc15", // bright yellow
];

  const cardStyle = {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    width: "280px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    cursor: "pointer",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          color: "white",
          background: "#0f172a",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }
console.table(chartData);
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a, #1e3a8a, #312e81)",
        color: "white",
        padding: "40px",
      }}
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          textAlign: "center",
          fontSize: "60px",
          marginBottom: "10px",
        }}
      >
        CRM Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: "center",
          fontSize: "22px",
          color: "#cbd5e1",
          marginBottom: "50px",
        }}
      >
        Welcome Admin 👋
      </motion.p>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        {/* Total Leads */}
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, x: -150 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 25px #38bdf8",
          }}
        >
          <h2>Total Leads</h2>

          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 200,
            }}
            style={{
              fontSize: "56px",
              color: "#38bdf8",
            }}
          >
            {stats.totalLeads}
          </motion.h1>
        </motion.div>

        {/* New Leads */}
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 25px #22c55e",
          }}
        >
          <h2>New Leads</h2>

          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.8,
              type: "spring",
              stiffness: 200,
            }}
            style={{
              fontSize: "56px",
              color: "#22c55e",
            }}
          >
            {stats.newLeads}
          </motion.h1>
        </motion.div>

        {/* Converted Leads */}
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, x: 150 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 25px #f59e0b",
          }}
        >
          <h2>Converted Leads</h2>

          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 1,
              type: "spring",
              stiffness: 200,
            }}
            style={{
              fontSize: "56px",
              color: "#f59e0b",
            }}
          >
            {stats.convertedLeads}
          </motion.h1>
        </motion.div>
      </div>

      {/* Lead Status Chart */}

<div
  style={{
    marginTop: "60px",
    background: "rgba(255,255,255,0.08)",
    padding: "30px",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
  }}
>
  <h2
    style={{
      textAlign: "center",
      marginBottom: "30px",
    }}
  >
    Lead Analytics
  </h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <PieChart>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={140}
        dataKey="value"
        labelLine={false}
        stroke="#ffffff"
        strokeWidth={2}
      >
        {chartData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

      {/* Footer Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          textAlign: "center",
          marginTop: "60px",
          fontSize: "20px",
          color: "#cbd5e1",
        }}
      >
        🚀 Manage Leads • Track Conversions • Grow Business
      </motion.div>
    </div>
  );
}

export default Dashboard;
