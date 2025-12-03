import Spline from "@splinetool/react-spline";
import { Link } from "react-router-dom";
import { Sparkles, CircuitBoard, ScanLine, LineChart } from "lucide-react";

export function HomePage() {
  const menuItems = [
    {
      title: "Create Exam",
      description: "Create new exams for students",
      path: "/create-exam",
      icon: Sparkles,
    },
    {
      title: "Manage Exams",
      description: "Edit and manage existing exams",
      path: "/manage-exams",
      icon: CircuitBoard,
    },
    {
      title: "Take Test",
      description: "Students can take available exams",
      path: "/take-exam",
      icon: ScanLine,
    },
    {
      title: "Check Results",
      description: "View exam results and analytics",
      path: "/check-results",
      icon: LineChart,
    },
    {
      title: "Register Students",
      description: "Register Student",
      path: "/register-students",
      icon: LineChart,
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Spline 3D background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Spline scene="https://prod.spline.design/n9zVH8ok4ea2ZOoa/scene.splinecode" />
        </div>

        {/* ======= Futuristic Sidebar Overlay ======= */}
        <div className="w-20 h-[100vh] flex flex-col items-center justify-center py-8 space-y-6 bg-white/5 backdrop-blur-md rounded-r-xl shadow-md">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="w-12 h-12 flex items-center justify-center rounded-full 
             bg-white/20 backdrop-blur-md border border-white/30
             shadow-[0_0_15px_#00A0A0] hover:shadow-[0_0_25px_#00A0A0]
             transition-all duration-300"
            >
              <item.icon className="text-cyan-500 w-6 h-6" />
              <span className="sr-only">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Center Hero Text */}
      </div>
    </div>
  );
}
