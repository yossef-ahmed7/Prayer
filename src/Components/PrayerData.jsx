function PrayerData({ name, time, isNext, isTomorrow }) {
    return (
        <div
            className={`flex justify-between items-center gap-4
                px-5 py-3.5 mb-3 text-(--text-primary)
                text-[18px] font-semibold border rounded-xl
                transition-[background-color,border-color,transform]
                duration-200 ease-in-out hover:bg-(--primary-color)
                hover:-translate-x-1 last:mb-0
                max-[480px]:px-3.5 max-[480px]:py-3
                max-[480px]:text-base
                motion-reduce:transition-none
                motion-reduce:hover:transform-none
                ${
                    isNext
                        ? "bg-[rgba(193,139,85,0.2)] border-(--primary-color) shadow-[0_0_20px_rgba(193,139,85,0.12)]"
                        : "bg-[rgba(255,255,255,0.055)] border-(--border-color)"
                }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <p>{name}</p>

                {isNext && (
                    <span
                        className="px-2 py-1 text-xs font-medium
                            text-(--primary-color)
                            bg-[rgba(193,139,85,0.15)]
                            border border-(--primary-color)
                            rounded-lg whitespace-nowrap"
                    >
                        {isTomorrow ? "غدًا" : "الصلاة القادمة"}
                    </span>
                )}
            </div>

            <p className="time_prayer shrink-0">{time}</p>
        </div>
    );
}

export default PrayerData;
