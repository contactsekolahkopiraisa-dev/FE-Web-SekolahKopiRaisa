"use client";

import { Briefcase, GraduationCap, MapPin, User, Users } from "lucide-react";
import LayananHeader from "../../../../components/layanan/LayananHeader";
import SubNavLayananAdmin from "../../../../components/admin/layanan/SubNavLayananAdmin";
import ServiceCardAdmin from "../../../../components/admin/layanan/ServiceCardAdmin";

export default function AdminLayananPage() {
  const services = [
    {
      id: 1,
      icon: <MapPin size={36} strokeWidth={1.5} />,
      title: "Kunjungan",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Umum",
      image: "/assets/tk1.png",
      fullDescription: [
        "Program Kunjungan Lapangan untuk mengenal industri kopi secara langsung.",
        "Peserta akan diajak melihat proses produksi kopi dari hulu hingga hilir."
      ],
      activities: [],
      slug: "kunjungan",
    },
    {
      id: 2,
      icon: <User size={36} strokeWidth={1.5} />,
      title: "Magang",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Siswa/Mahasiswa",
      image: "/assets/tk1.png",
      fullDescription: [
        "Program Magang untuk memberikan pengalaman praktik langsung di industri kopi.",
        "Peserta akan mengikuti proses operasional sehari-hari di Sekolah Kopi Raisa."
      ],
      activities: [],
      slug: "magang",
    },
    {
      id: 3,
      icon: <GraduationCap size={36} strokeWidth={1.5} />,
      title: "Pelatihan Kopi",
      description: "Pelatihan integratif untuk memahami kopi secara holistik",
      duration: "1 Hari",
      target: "Umum",
      image: "/assets/tk1.png",
      fullDescription: [
        "Pelatihan Kopi merupakan program pembelajaran terintegrasi yang dirancang untuk memberikan pemahaman komprehensif tentang kopi, mulai dari budidaya, pengolahan, hingga penyajian yang berkualitas. Melalui pendekatan teori dan praktik, peserta akan mendapatkan pengetahuan mendalam tentang tanaman kopi, mulai dari pengenalan, persiapan lahan, pemeliharaan, pemanenan, hingga pengolahan pasca panen.",
        "Program ini juga mencakup manajemen bisnis kopi, standar kualitas, dan peluang pemasaran produk kopi lokal yang dilakukan oleh narasumber ahli dan praktisi berpengalaman sehingga peserta memperoleh wawasan mendalam industri kopi dari hulu hingga hilir. Program ini terbuka untuk petani, pelaku UMKM, dan masyarakat umum yang tertarik mengembangkan potensi kopi di daerahnya."
      ],
      activities: [
        {
          category: "Pengenalan Tanaman Kopi",
          items: []
        },
        {
          category: "Persiapan Lahan",
          items: [
            "Pembersihan Areal",
            "Pengolahan Tanah",
            "Pohon Pelindung",
            "Jarak Tanam",
            "Lubang Tanam",
            "Tanaman Belum Menghasilkan (TBM)",
            "Tanaman Menghasilkan (TM)"
          ]
        },
        {
          category: "Pembibitan",
          items: [
            "Perbanyakan Vegetatif",
            "Perbanyakan Generatif"
          ]
        },
        {
          category: "Penanaman",
          items: [
            "Kriteria Bibit Siap Tanam",
            "Waktu Penanaman",
            "Metode Penanaman"
          ]
        },
        {
          category: "Pemeliharaan",
          items: [
            "Pengairan",
            "Pemupukan",
            "Pengendalian Hama & Gulma",
            "Pemangkasan Kopi"
          ]
        },
        {
          category: "Panen",
          items: [
            "Penentuan Lokasi",
            "Persiapan Lapangan",
            "Persiapan Sarana",
            "Kriteria Buah Siap Panen",
            "Metode Pemanenan",
            "Manajemen Panen",
            "Transportasi Hasil Panen"
          ]
        },
        {
          category: "Pasca Panen",
          items: [
            "Sortasi Setelah Panen",
            "Pulping",
            "Fermentasi",
            "Perendaman dan Pencucian",
            "Pengeringan dan Tempering",
            "Huller",
            "Sortasi Kopi Green Bean",
            "Roasting",
            "Grinding",
            "Pengemasan dan Penyimpanan",
            "Brewing (Penyeduhan)",
            "Pemasaran"
          ]
        }
      ],
      slug: "pelatihan",
    },
    {
      id: 4,
      icon: <Users size={36} strokeWidth={1.5} />,
      title: "Undangan Narasumber",
      description: "Program undangan narasumber untuk sharing knowledge",
      duration: "1 Hari",
      target: "Umum",
      image: "/assets/tk1.png",
      fullDescription: [
        "Program Undangan Narasumber untuk berbagi pengetahuan dan pengalaman.",
        "Terbuka untuk para ahli dan praktisi industri kopi."
      ],
      activities: [],
      slug: "undangan-narasumber",
    },
    {
      id: 5,
      icon: <Briefcase size={36} strokeWidth={1.5} />,
      title: "Praktek Kerja Lapangan (PKL)",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Siswa/Mahasiswa",
      image: "/assets/tk1.png",
      fullDescription: [
        "Program Praktek Kerja Lapangan (PKL) untuk siswa dan mahasiswa.",
        "Memberikan pengalaman kerja langsung di industri kopi dengan kurikulum terstruktur."
      ],
      activities: [],
      slug: "pkl",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <LayananHeader title="Layanan" subtitle="Kelola dan Review Pengajuan dari Peserta" />
      <SubNavLayananAdmin />
      <div className="py-4">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <ServiceCardAdmin
                key={s.id}
                id={s.id}
                icon={s.icon}
                title={s.title}
                description={s.description}
                duration={s.duration}
                target={s.target}
                image={s.image}
                fullDescription={s.fullDescription}
                activities={s.activities}
                editHref={`/admin/layanan/daftar-layanan/${s.slug}/edit`}
              />
            ))}
            </div>
          </div>
      </div>
    </div>
  );
}

