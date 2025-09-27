export interface ReportListAdminProps {
    id?: number;
    title?: string;
    city?: string;
    date?: string;
    eventType?: string;
    image?: string;
    // onEdit: (id: number) => void;
    // onDelete: (id: number) => void;
}

export default function ReportListAdmin({
    id,
    title,
    city,
    date,
    eventType,
    image,
}: ReportListAdminProps) {
    return (
        <div className="cursor-pointer rounded-xl overflow-hidden shadow-lg border border-gray-300 p-3 flex flex-col justify-between bg-white relative">
            <img
                src={image}
                alt={title}
                className="h-50 object-cover rounded-lg"
            />
            <div className="mt-3 flex flex-col justify-between flex-grow text-sm">
                <div>
                    <h2 className="font-medium text-black leading-snug text-lg">
                        {title}
                    </h2>
                    <h2 className="font-medium text-black leading-snug text-lg">
                        {city}
                    </h2>
                    <p className="font-light text-xs text-black pb-1.5">
                        {date ? new Date(date).toLocaleDateString("id-ID") : ""}
                    </p>
                    <span className="font-semibold text-xs text-gray-200 px-2 py-1 rounded-full bg-amber-950">
                        {eventType}
                    </span>
                </div>
            </div>
        </div>
    );
}
