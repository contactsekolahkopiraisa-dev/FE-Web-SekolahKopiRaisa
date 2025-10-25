// lib/dummySignUpUMKM.ts
export interface KodePosUMKM {
    id: number;
    kodePos: number;
}

export interface ProvinsiUMKM {
    id: number;
    provinsi: string;
}

export interface KabupatenUMKM {
    id: number;
    kabupaten: string;
}

export interface KecamatanUMKM {
    id: number;
    kecamatan: string;
}

export interface DesaUMKM {
    id: number;
    desa: string;
}

export const dummyKodePosUMKM : KodePosUMKM[] = [
    {
        id: 1,
        kodePos: 6081,
    },
    {
        id: 2,
        kodePos: 4071,
    },
    {
        id: 3,
        kodePos: 2021,
    },
]

export const dummyProvinsiUMKM : ProvinsiUMKM[] = [
    {
        id: 1,
        provinsi: "Jawa Timur",
    },
    {
        id: 2,
        provinsi: "Jawa Barat",
    },
    {
        id: 3,
        provinsi: "Sumatra Timur",
    },
]

export const dummyKabupatenUMKM : KabupatenUMKM[] = [
    {
        id: 1,
        kabupaten: "Jember",
    },
    {
        id: 2,
        kabupaten: "Malang",
    },
    {
        id: 3,
        kabupaten: "Kediri",
    },
]

export const dummyKecamatanUMKM : KecamatanUMKM[] = [
    {
        id: 1,
        kecamatan: "Ambulu",
    },
    {
        id: 2,
        kecamatan: "Bangsalsari",
    },
    {
        id: 3,
        kecamatan: "Sumbersari",
    },
]

export const dummyDesaUMKM : DesaUMKM[] = [
    {
        id: 1,
        desa: "Cakru",
    },
    {
        id: 2,
        desa: "Jatiroto",
    },
    {
        id: 3,
        desa: "Sempolan",
    },
]