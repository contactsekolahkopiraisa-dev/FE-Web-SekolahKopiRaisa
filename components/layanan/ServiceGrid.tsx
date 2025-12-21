import ServiceCard from "./ServiceCard";

interface ServiceActivity {
  category: string;
  items: string[];
}

interface Service {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  target: string;
  route: string;
  image?: string;
  fullDescription?: string[];
  activities?: ServiceActivity[];
}

interface ServiceGridProps {
  services: Service[];
}

export default function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <div className="py-4">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              duration={service.duration}
              target={service.target}
              route={service.route}
              image={service.image}
              fullDescription={service.fullDescription}
              activities={service.activities}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
