// Mulberry32 - Seeded Random Number Generator yang lebih robust
function mulberry32(a) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// String hashing untuk seed (djb2 algorithm)
function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i); // hash * 33 + c
    }
    return hash >>> 0; // Convert to unsigned 32-bit integer
}

// Shuffle array dengan seed
function shuffleWithSeed(array, seedStr, cornerTableActive) {
    const seed = hashString(seedStr);
    const random = mulberry32(seed);
    const shuffled = [...array];

    // Fisher-Yates shuffle dengan PRNG yang lebih baik
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Jika meja pojok nonaktif, pastikan 3 slot terakhir diisi "-"
    if (!cornerTableActive) {
        const dashCount = shuffled.filter((p) => p.name === "-").length;
        if (dashCount >= 3) {
            // Cari semua posisi "-" dan pindahkan ke slot terakhir
            const dashPositions = [];
            for (let i = 0; i < shuffled.length; i++) {
                if (shuffled[i].name === "-") {
                    dashPositions.push(i);
                }
            }

            // Ambil 3 "-" terakhir untuk slot 16, 17, 18
            let dashIndex = 0;
            for (let slot = 16; slot <= 18; slot++) {
                if (dashIndex < dashPositions.length) {
                    // Tukar posisi slot saat ini dengan "-" dari dashPositions
                    const fromPos = dashPositions[dashIndex];
                    if (fromPos !== slot && fromPos < 16) {
                        [shuffled[slot], shuffled[fromPos]] = [shuffled[fromPos], shuffled[slot]];
                    }
                    dashIndex++;
                }
            }
        }
    }

    return shuffled;
}

// Get week number dan tahun sebagai seed
function getDateSeed() {
    const now = new Date();

    // Hitung minggu ke-berapa dalam bulan ini (1-4)
    const dayOfMonth = now.getDate();
    let weekNumber = Math.ceil(dayOfMonth / 7);

    const year = now.getFullYear();
    const month = now.toLocaleDateString("id-ID", { month: "long" });

    // // Untuk testing: uncomment dan ganti minggu/tahun
    // weekNumber = 1;

    return {
        seed: `${weekNumber}-${year}-${now.getMonth()}`,
        display: `Minggu ke-${weekNumber}, ${month} ${year}`,
    };
}

export default function App() {
    const people = [
        { id: 1, name: "Ojan Gendut" },
        { id: 2, name: "Satria" },
        { id: 3, name: "Pak Pimen" },
        { id: 4, name: "Ikhsan" },
        { id: 5, name: "Irfan" },
        { id: 6, name: "Zuliana" },
        { id: 7, name: "Ojan Kurus" },
        { id: 8, name: "Max" },
        { id: 9, name: "Pam" },
        { id: 10, name: "Rillo" },
        { id: 11, name: "Try" },
        { id: 12, name: "Lia" },
        { id: 13, name: "Diki" },
        { id: 14, name: "Pak Andri" },
        { id: 15, name: "Bintang" },
        { id: 16, name: "-" },
        { id: 17, name: "-" },
        { id: 18, name: "-" },
        { id: 19, name: "-" },
    ];

    const dateSeed = getDateSeed();

    // useEffect(() => {
    //     // Debug: lihat hash seed di console
    //     console.log("Date Seed:", dateSeed.seed);
    // }, []);

    // Hitung jumlah kosong
    const emptyCount = people.filter((p) => p.name === "-").length;
    // Meja pojok nonaktif jika ada 3 orang kosong
    const cornerTableActive = emptyCount < 3;

    const shuffledPeople = shuffleWithSeed(people, dateSeed.seed, cornerTableActive);

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-mono">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
                {/* Header dengan tanggal */}
                <div className="text-center mb-6">
                    <div className="text-lg text-gray-600 mb-2">📅 {dateSeed.display}</div>
                    <div className="inline-flex items-center gap-2 text-2xl font-bold">
                        🖥️ <span>LAYAR</span>
                    </div>
                </div>

                {/* Container untuk semua meja */}
                <div className="flex justify-center gap-16 items-start">
                    {/* Meja Kiri */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
                            📋 <span>MEJA KIRI</span>
                        </div>

                        <div className="space-y-3">
                            {/* Row 1 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[0].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[1].name}</div>
                            </div>

                            {/* Row 2 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[2].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[3].name}</div>
                            </div>

                            {/* Row 3 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[4].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[5].name}</div>
                            </div>

                            {/* Row 4 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[6].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[7].name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Meja Kanan */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
                            📋 <span>MEJA KANAN</span>
                        </div>

                        <div className="space-y-3">
                            {/* Row 1 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[8].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[9].name}</div>
                            </div>

                            {/* Row 2 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[10].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[11].name}</div>
                            </div>

                            {/* Row 3 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[12].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[13].name}</div>
                            </div>

                            {/* Row 4 */}
                            <div className="flex gap-8">
                                <div className="w-24 text-left">{shuffledPeople[14].name}</div>
                                <div className="text-gray-400">|</div>
                                <div className="w-24 text-left">{shuffledPeople[15].name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Meja Pojok - hanya aktif jika kurang dari 3 orang kosong */}
                    {cornerTableActive && (
                        <div className="self-end ml-8">
                            <div className="flex gap-4 mb-1">
                                <div className="w-20 text-center">{shuffledPeople[16].name}</div>
                                <div className="w-20 text-center">{shuffledPeople[17].name}</div>
                                <div className="w-20 text-center">{shuffledPeople[18].name}</div>
                            </div>
                            <div className="border-b-2 border-gray-400 w-full"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
