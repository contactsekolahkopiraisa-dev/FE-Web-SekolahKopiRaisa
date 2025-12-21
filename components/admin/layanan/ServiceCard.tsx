import React from "react";
import ServiceCardAdmin from "./ServiceCardAdmin";
import { Briefcase } from "lucide-react";
export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Pelatihan Kopi",
      description: "Program pelatihan komprehensif tentang budidaya kopi",
      duration: "1 Hari",
      target: "Umum",
      image: "/images/pelatihan-kopi.jpg",
      fullDescription: [],
      activities: [],
      editHref: "/admin/services/edit/1",
      isActive: true, // Layanan aktif
    },
    {
      id: 2,
      title: "Pelatihan Pertanian",
      description: "Program pelatihan pertanian organik",
      duration: "2 Hari",
      target: "Umum",
      image: "/images/pelatihan-pertanian.jpg",
      fullDescription: [],
      activities: [],
      editHref: "/admin/services/edit/2",
      isActive: false, // Layanan nonaktif
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCardAdmin key={service.id} icon={<Briefcase size={32} />} {...service} />
      ))}
    </div>
  );
}