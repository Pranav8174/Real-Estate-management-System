import { Home, Users, Building, Star } from "lucide-react";

const stats = [
  { icon: Home, value: "1000+", label: "Properties Listed" },
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Building, value: "50+", label: "Cities Covered" },
  { icon: Star, value: "4.9", label: "Average Rating" }
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}