import { useEffect, useState } from 'react'
import axios from 'axios';
import PrayerData from './PrayerData'

const cities = [
    { name: "القاهرة", value: "Cairo" },
    { name: "الاسكندرية", value: "Alexandria" },
    { name: "الجيزة", value: "Giza" },
    { name: "المنصورة", value: "Mansoura" },
    { name: "أسوان", value: "Aswan" },
    { name: "الأقصر", value: "Luxor" },
]

const prayerNames = [
    { name: "الفجر", key: "Fajr" },
    { name: "الظهر", key: "Dhuhr" },
    { name: "العصر", key: "Asr" },
    { name: "المغرب", key: "Maghrib" },
    { name: "العشاء", key: "Isha" },
];

const getNextPrayer = (timings) => {
    if (!timings) return null;

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    const nextPrayer = prayerNames.find(({ key }) => {
        const [hours, minutes] = timings[key]
            .split(" ")[0]
            .split(":")
            .map(Number);

        const prayerMinutes = hours * 60 + minutes;

        return currentMinutes < prayerMinutes;
    });

    if (nextPrayer) {
        return {
            ...nextPrayer,
            isTomorrow: false,
        };
    }

    return {
        ...prayerNames[0],
        isTomorrow: true,
    };
};

const formatClock = () =>
    new Date().toLocaleTimeString("ar-EG", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

const to12Hour = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(" ")[0].split(":").map(Number);
    const period = h >= 12 ? "م" : "ص";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const getToday = () => new Date().toLocaleDateString("en-GB").replaceAll("/", "-");


function Prayer() {
    const [date, setDate] = useState(formatClock);
    const [today, setToday] = useState(getToday);
    const [prayer, setPrayer] = useState(null);
    const [city, setCity] = useState("Cairo");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const nextPrayer = getNextPrayer(prayer);

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(formatClock());
            setToday(getToday());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchPrayerTimes = async () => {
            setLoading(true);
            setError(null);
            setPrayer(null);

            try {
                const res = await axios.get(
                    `https://api.aladhan.com/v1/timingsByCity/${today}`,
                    {
                        params: { city, country: "Egypt", method: 5 },
                        signal: controller.signal,
                    }
                );
                setPrayer(res.data.data.timings);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error(err);
                    setError("تعذر تحميل مواقيت الصلاة، حاول مرة أخرى");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchPrayerTimes();
        return () => controller.abort();
    }, [city, today, retryCount]);

    return (
        <section className="Prayer min-h-svh flex items-center justify-start
            py-10 px-[5%]
            bg-[linear-gradient(90deg,rgba(10,20,28,0.2),rgba(10,20,28,0.75)),url('/bg.jpg')]
            bg-cover bg-center bg-no-repeat
            max-[480px]:px-3.5 max-[480px]:py-5">

            <div className="w-full max-w-162.5 p-7.5 mr-[5%]
                backdrop-blur-[14px] bg-(--surface-color)
                border border-(--border-color) rounded-[20px]
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                max-[480px]:p-[20px_16px] max-[480px]:rounded-2xl">

                <div className="top_section pb-6 mb-6 border-b border-(--border-color)
                    max-[480px]:pb-4.5 max-[480px]:mb-4.5">

                    <h2 className="mb-2.5 text-(--text-secondary)
                    text-[16px] font-medium">الوقت</h2>

                    <p className="w-fit px-5 py-2 text-(--primary-color) 
                        text-[clamp(28px,4vw,36px)] font-bold tracking-[1px] 
                        bg-[rgba(255,255,255,0.04)] border 
                        border-(--border-color) rounded-xl">{date}</p>
                </div>
                <div className="med_section flex justify-between items-center gap-5
                    pb-6 mb-6 border-b border-(--border-color)
                    max-[480px]:gap-3 max-[480px]:pb-4.5 max-[480px]:mb-4.5">

                    <div className="city flex-1 min-w-0">

                        <h2 className="mb-2.5 text-(--text-secondary)
                    text-[16px] font-medium">المدينة</h2>

                        <select className="w-full max-w-62.5 box-border 
                        py-2.5 px-3 text-(--text-primary) text-[16px] bg-[#263943]
                         border border-(--border-color) rounded-[10px] outline-0
                         transition-colors duration-200 ease-in-out
                         focus:border-(--primary-color)
                         max-[480px]:px-1.5 max-[480px]:py-2.25 max-[480px]:text-sm"
                            value={city} onChange={(e) => setCity(e.target.value)}>

                            {cities.map((c) => (
                                <option className="text-(--text-primary) bg-[#263943]"
                                    key={c.value} value={c.value}>{c.name}</option>
                            ))}

                        </select>
                    </div>
                    <div className="date flex-1 min-w-0">

                        <h2 className="mb-2.5 text-(--text-secondary) 
                        text-[16px] font-medium">التاريخ</h2>

                        <h4 className="text-(--text-primary) text-[18px] font-semibold max-[480px]:text-[15px]">{today}</h4>
                    </div>
                </div>

                {loading && (
                    <p className="text-center py-4 text-(--text-secondary)">
                        جارٍ تحميل مواقيت الصلاة...
                    </p>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-3 py-5 text-center">
                        <p className="text-red-300">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => setRetryCount((count) => count + 1)}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl
                bg-(--primary-color) text-white font-semibold
                transition-opacity duration-200
                hover:opacity-85 disabled:opacity-50
                disabled:cursor-not-allowed"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                )}

                {prayer && prayerNames.map((p) => (
                    <PrayerData
                        key={p.key}
                        name={p.name}
                        time={to12Hour(prayer[p.key])}
                        isNext={nextPrayer?.key === p.key}
                        isTomorrow={nextPrayer?.isTomorrow}
                    />
                ))}
            </div>
        </section>
    )
}

export default Prayer