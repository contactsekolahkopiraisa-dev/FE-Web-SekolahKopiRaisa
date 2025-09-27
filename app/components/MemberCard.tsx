import Image from "next/image";

interface MemberCardProps {
  id: number;
  image: string;
  name: string;
  position: string;
}

export default function MemberCard({
  id,
  image,
  name,
  position,
}: MemberCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div
        className="relative aspect-[1/1] w-full max-w-sm mx-auto overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-300"
        key={id}
      >
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-gray-300">{position}</p>
        </div>
      </div>
    </div>
  );
}