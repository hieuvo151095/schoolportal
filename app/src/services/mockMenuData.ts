import type { WeeklyMenu, DayMealSchedule, WeekdayKey } from '../types/menu.ts';

const sampleWeekSchedule: Record<WeekdayKey, DayMealSchedule> = {
  monday: {
    breakfast: [
      {
        id: 'dish-m-b-1',
        name: 'Phở bò Hà Nội',
        calories: 380,
        ingredients: [
          {
            id: 'ing-1',
            name: 'Thịt bò phi lê',
            traceabilityMethod: 'gtin',
            gtin: '8938501102931',
            lotNumber: 'LOT-20260915-B1',
            supplierName: 'Tập đoàn Masan MEATDeli',
            supplierVerified: true,
            status: 'dat_chuan',
          },
          {
            id: 'ing-2',
            name: 'Bánh phở tươi',
            traceabilityMethod: 'internal',
            internalCode: 'TEM-NB-PHO-0915',
            status: 'dat_chuan',
          },
          {
            id: 'ing-3',
            name: 'Rau mùi tàu, húng quế',
            traceabilityMethod: 'gtin',
            gtin: '8936014002194',
            lotNumber: 'LOT-DLG-891',
            supplierName: 'Hợp tác xã Rau sạch Đà Lạt Gap',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-m-b-2',
        name: 'Sữa hạt sen mè đen',
        calories: 120,
        ingredients: [
          {
            id: 'ing-4',
            name: 'Hạt sen tươi Huế',
            status: 'chua_truy_xuat',
          },
        ],
      },
    ],
    lunch: [
      {
        id: 'dish-m-l-1',
        name: 'Cơm tám thơm Điện Biên',
        calories: 220,
        ingredients: [
          {
            id: 'ing-5',
            name: 'Gạo tám thơm',
            traceabilityMethod: 'gtin',
            gtin: '8936036021045',
            lotNumber: 'GAO-CP-0926',
            supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-m-l-2',
        name: 'Thịt kho trứng cút',
        calories: 320,
        ingredients: [
          {
            id: 'ing-6',
            name: 'Thịt ba chỉ heo sạch',
            traceabilityMethod: 'gtin',
            gtin: '8936036028812',
            lotNumber: 'HEO-CP-0915A',
            supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
            supplierVerified: true,
            status: 'dat_chuan',
          },
          {
            id: 'ing-7',
            name: 'Trứng cút Ba Huân',
            traceabilityMethod: 'internal',
            internalCode: 'TEM-NB-TC-2026',
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-m-l-3',
        name: 'Canh bí xanh nấu tôm thịt',
        calories: 95,
        ingredients: [
          {
            id: 'ing-8',
            name: 'Bí xanh hữu cơ',
            traceabilityMethod: 'gtin',
            gtin: '8936014110023',
            lotNumber: 'BX-DL-992',
            supplierName: 'Hợp tác xã Rau sạch Đà Lạt Gap',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-m-l-4',
        name: 'Chuối tiêu tráng miệng',
        calories: 85,
        ingredients: [],
      },
    ],
    snack: [
      {
        id: 'dish-m-s-1',
        name: 'Bánh flan sữa chua Ba Vì',
        calories: 140,
        ingredients: [
          {
            id: 'ing-9',
            name: 'Sữa tươi nguyên chất Ba Vì',
            traceabilityMethod: 'gtin',
            gtin: '8935001001234',
            lotNumber: 'BV-MILK-0915',
            supplierName: 'Công ty Cổ phần Sữa Ba Vì',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
    ],
    tickXanh: {
      breakfast: {
        url: 'https://tfd.tf/26198-B-29-0040260',
        verified: true,
      },
      lunch: {
        url: 'https://tfd.tf/26198-B-29-0040261',
        verified: true,
      },
      snack: {
        url: 'https://tfd.tf/26198-B-29-0040262',
        verified: true,
      },
    },
  },
  tuesday: {
    breakfast: [
      {
        id: 'dish-t-b-1',
        name: 'Bánh cuốn chả quế Vissan',
        calories: 360,
        ingredients: [
          {
            id: 'ing-10',
            name: 'Chả quế heo nạc',
            traceabilityMethod: 'gtin',
            gtin: '8934608112233',
            lotNumber: 'VIS-CQ-0916',
            supplierName: 'Công ty Việt Nam Kỹ Nghệ Súc Sản (Vissan)',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
    ],
    lunch: [
      {
        id: 'dish-t-l-1',
        name: 'Cơm trắng & Gà om nấm đông cô',
        calories: 450,
        ingredients: [
          {
            id: 'ing-11',
            name: 'Thịt gà ta thả vườn San Hà',
            traceabilityMethod: 'gtin',
            gtin: '8935217990012',
            lotNumber: 'SH-GA-0916B',
            supplierName: 'Công ty TNHH San Hà (Gia cầm sạch)',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-t-l-2',
        name: 'Canh rau ngót nấu thịt nạc',
        calories: 90,
        ingredients: [],
      },
    ],
    snack: [
      {
        id: 'dish-t-s-1',
        name: 'Sữa tươi Vinamilk 100% ít đường',
        calories: 110,
        ingredients: [
          {
            id: 'ing-12',
            name: 'Sữa tươi tiệt trùng Vinamilk',
            traceabilityMethod: 'gtin',
            gtin: '8934563889910',
            lotNumber: 'VNM-2026-SEP-01',
            supplierName: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
    ],
    tickXanh: {
      breakfast: {
        url: 'https://tfd.tf/26198-B-29-0040263',
        verified: true,
      },
      lunch: {
        url: 'https://tfd.tf/26198-B-29-0040264',
        verified: true,
      },
      snack: {
        url: 'https://tfd.tf/26198-B-29-0040265',
        verified: true,
      },
    },
  },
  wednesday: {
    breakfast: [
      {
        id: 'dish-w-b-1',
        name: 'Cháo sườn bắp non',
        calories: 310,
        ingredients: [
          {
            id: 'ing-13',
            name: 'Sườn heo non C.P',
            traceabilityMethod: 'gtin',
            gtin: '8936036028812',
            lotNumber: 'CP-SUON-0917',
            supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
    ],
    lunch: [
      {
        id: 'dish-w-l-1',
        name: 'Cơm trắng & Cá basa sốt cà chua',
        calories: 420,
        ingredients: [
          {
            id: 'ing-14',
            name: 'Cá basa phi lê',
            traceabilityMethod: 'internal',
            internalCode: 'TEM-NB-CA-0917',
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-w-l-2',
        name: 'Canh cải cúc nấu ngao',
        calories: 80,
        ingredients: [],
      },
    ],
    snack: [
      {
        id: 'dish-w-s-1',
        name: 'Chè đậu đỏ hạt sen',
        calories: 160,
        ingredients: [],
      },
    ],
    tickXanh: {
      breakfast: {
        url: 'https://tfd.tf/26198-B-29-0040266',
        verified: true,
      },
      // lunch has no tick xanh (displays "Chưa có tick xanh" matching screenshot)
      snack: {
        url: 'https://tfd.tf/26198-B-29-0040267',
        verified: true,
      },
    },
  },
  thursday: {
    breakfast: [
      {
        id: 'dish-th-b-1',
        name: 'Xôi gà xé hạt sen',
        calories: 390,
        ingredients: [
          {
            id: 'ing-15',
            name: 'Gạo nếp cái hoa vàng',
            traceabilityMethod: 'gtin',
            gtin: '8936036021045',
            lotNumber: 'LOT-NEP-0918',
            supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
            supplierVerified: true,
            status: 'dat_chuan',
          },
          {
            id: 'ing-16',
            name: 'Thịt ức gà San Hà',
            traceabilityMethod: 'gtin',
            gtin: '8935217990012',
            lotNumber: 'SH-GA-0918A',
            supplierName: 'Công ty TNHH San Hà (Gia cầm sạch)',
            supplierVerified: true,
            status: 'dat_chuan',
          },
          {
            id: 'ing-17',
            name: 'Hạt sen Huế sấy',
            traceabilityMethod: 'internal',
            internalCode: 'TEM-SEN-0918',
            status: 'dat_chuan',
          },
        ],
      },
    ],
    lunch: [
      {
        id: 'dish-th-l-1',
        name: 'Cơm tấm sườn nướng mật ong',
        calories: 510,
        ingredients: [
          {
            id: 'ing-18',
            name: 'Sườn cốt lết heo C.P',
            traceabilityMethod: 'gtin',
            gtin: '8936036028812',
            lotNumber: 'CP-SUON-0918B',
            supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-th-l-2',
        name: 'Canh củ quả hầm xương',
        calories: 110,
        ingredients: [],
      },
    ],
    snack: [
      {
        id: 'dish-th-s-1',
        name: 'Sữa chua dầm hoa quả tươi',
        calories: 130,
        ingredients: [],
      },
    ],
    tickXanh: {
      breakfast: {
        url: 'https://tfd.tf/26198-B-29-0040268',
        verified: true,
      },
      lunch: {
        url: 'https://tfd.tf/26198-B-29-0040269',
        verified: true,
      },
      snack: {
        url: 'https://tfd.tf/26198-B-29-0040270',
        verified: true,
      },
    },
  },
  friday: {
    breakfast: [
      {
        id: 'dish-f-b-1',
        name: 'Mì Quảng tôm thịt',
        calories: 370,
        ingredients: [
          {
            id: 'ing-19',
            name: 'Mì sợi Quảng Nam',
            traceabilityMethod: 'internal',
            internalCode: 'TEM-MI-0919',
            status: 'dat_chuan',
          },
        ],
      },
    ],
    lunch: [
      {
        id: 'dish-f-l-1',
        name: 'Cơm trắng & Bò xào cần tỏi',
        calories: 460,
        ingredients: [
          {
            id: 'ing-20',
            name: 'Thịt bò MEATDeli',
            traceabilityMethod: 'gtin',
            gtin: '8938501102931',
            lotNumber: 'MD-BO-0919',
            supplierName: 'Tập đoàn Masan MEATDeli',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-f-l-2',
        name: 'Canh chua cá lóc rau muống',
        calories: 105,
        ingredients: [],
      },
    ],
    snack: [
      {
        id: 'dish-f-s-1',
        name: 'Bánh bao nhân thịt trứng cút',
        calories: 190,
        ingredients: [],
      },
    ],
    tickXanh: {
      breakfast: {
        url: 'https://tfd.tf/26198-B-29-0040271',
        verified: true,
      },
      lunch: {
        url: 'https://tfd.tf/26198-B-29-0040272',
        verified: true,
      },
      snack: {
        url: 'https://tfd.tf/26198-B-29-0040273',
        verified: true,
      },
    },
  },
  saturday: {
    breakfast: [
      {
        id: 'dish-sa-b-1',
        name: 'Bún mọc sườn chua',
        calories: 340,
        ingredients: [
          {
            id: 'ing-21',
            name: 'Mọc giò sống Vissan',
            traceabilityMethod: 'gtin',
            gtin: '8934608112233',
            lotNumber: 'VIS-MOC-0920',
            supplierName: 'Công ty Việt Nam Kỹ Nghệ Súc Sản (Vissan)',
            supplierVerified: true,
            status: 'dat_chuan',
          },
          {
            id: 'ing-22',
            name: 'Sườn heo C.P',
            traceabilityMethod: 'gtin',
            gtin: '8936036028812',
            lotNumber: 'CP-SUON-0920',
            supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
            supplierVerified: true,
            status: 'dat_chuan',
          },
          {
            id: 'ing-23',
            name: 'Rau dọc mùng Đà Lạt Gap',
            traceabilityMethod: 'gtin',
            gtin: '8936014002194',
            lotNumber: 'DLG-DM-0920',
            supplierName: 'Hợp tác xã Rau sạch Đà Lạt Gap',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      },
      {
        id: 'dish-sa-b-2',
        name: 'Cơm tấm',
        calories: 420,
        ingredients: [
          {
            id: 'ing-24',
            name: 'Gạo tấm thơm',
            traceabilityMethod: 'internal',
            internalCode: 'TEM-TAM-0920',
            status: 'dat_chuan',
          },
        ],
      },
    ],
    lunch: [
      {
        id: 'dish-sa-l-1',
        name: 'Bún',
        calories: 280,
        ingredients: [],
      },
      {
        id: 'dish-sa-l-2',
        name: 'Sữa',
        calories: 120,
        ingredients: [],
      },
      {
        id: 'dish-sa-l-3',
        name: 'Trái cây',
        calories: 60,
        ingredients: [],
      },
    ],
    snack: [
      {
        id: 'dish-sa-s-1',
        name: 'Nui xào thịt bằm',
        calories: 210,
        ingredients: [],
      },
    ],
    tickXanh: {
      breakfast: {
        url: 'https://tfd.tf/26198-B-29-0040274',
        verified: true,
      },
      lunch: {
        url: 'https://tfd.tf/26198-B-29-0040275',
        verified: true,
      },
      snack: {
        url: 'https://tfd.tf/26198-B-29-0040276',
        verified: true,
      },
    },
  },
};

export const INITIAL_MENUS: WeeklyMenu[] = [
  {
    id: '135',
    title: 'Thực đơn tuần: 12/10/2026 - 17/10/2026',
    scope: 'all',
    weekNumber: 42,
    year: 2026,
    startDate: '2026-10-12',
    endDate: '2026-10-17',
    contentType: 'grid',
    status: 'published',
    publishedViaAnnouncement: true,
    publishedAt: '2026-10-01T16:04:00Z',
    updatedAt: '2026-10-01T16:04:00Z',
    schedule: {
      monday: {
        breakfast: [
          {
            id: 'dish-135-m-b-1',
            name: 'Nui',
            calories: 320,
            ingredients: [
              {
                id: 'ing-135-1',
                name: 'Nui ống Safoco',
                traceabilityMethod: 'gtin',
                gtin: '8936014002194',
                lotNumber: 'LOT-NUI-1012',
                supplierName: 'Công ty Cổ phần Lương thực Safoco',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
          {
            id: 'dish-135-m-b-2',
            name: 'Trà sữa',
            calories: 180,
            ingredients: [
              {
                id: 'ing-135-2',
                name: 'Sữa tươi Vinamilk',
                traceabilityMethod: 'gtin',
                gtin: '8934563889910',
                lotNumber: 'VNM-MILK-1012',
                supplierName: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
        lunch: [
          {
            id: 'dish-135-m-l-1',
            name: 'Cơm gà',
            calories: 450,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'dish-135-m-s-1',
            name: 'Cơm bò',
            calories: 380,
            ingredients: [],
          },
        ],
        tickXanh: {
          breakfast: {
            url: 'https://tfd.tf/26198-B-29-0040260',
            verified: true,
          },
          lunch: {
            url: 'https://tfd.tf/26198-B-29-0040261',
            verified: true,
          },
          snack: {
            url: 'https://tfd.tf/26198-B-29-0040262',
            verified: true,
          },
        },
      },
      tuesday: {
        breakfast: [
          {
            id: 'dish-135-t-b-1',
            name: 'Bánh canh',
            calories: 350,
            ingredients: [
              {
                id: 'ing-135-3',
                name: 'Sợi bánh canh bột gạo',
                traceabilityMethod: 'internal',
                internalCode: 'TEM-BC-1013',
                status: 'dat_chuan',
              },
            ],
          },
        ],
        lunch: [
          {
            id: 'dish-135-t-l-1',
            name: 'Phở',
            calories: 410,
            ingredients: [
              {
                id: 'ing-135-4',
                name: 'Thịt bò MEATDeli',
                traceabilityMethod: 'gtin',
                gtin: '8938501102931',
                lotNumber: 'MD-BO-1013',
                supplierName: 'Tập đoàn Masan MEATDeli',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
        snack: [
          {
            id: 'dish-135-t-s-1',
            name: 'Hủ tíu',
            calories: 320,
            ingredients: [],
          },
        ],
        tickXanh: {
          breakfast: {
            url: 'https://tfd.tf/26198-B-29-0040263',
            verified: true,
          },
          lunch: {
            url: 'https://tfd.tf/26198-B-29-0040264',
            verified: true,
          },
          snack: {
            url: 'https://tfd.tf/26198-B-29-0040265',
            verified: true,
          },
        },
      },
      wednesday: {
        breakfast: [
          {
            id: 'dish-135-w-b-1',
            name: 'Cơm gà',
            calories: 420,
            ingredients: [
              {
                id: 'ing-135-5',
                name: 'Gà ta San Hà',
                traceabilityMethod: 'gtin',
                gtin: '8935217990012',
                lotNumber: 'SH-GA-1014',
                supplierName: 'Công ty TNHH San Hà (Gia cầm sạch)',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
        lunch: [
          {
            id: 'dish-135-w-l-1',
            name: 'Cơm vịt',
            calories: 460,
            ingredients: [
              {
                id: 'ing-135-6',
                name: 'Vịt cỏ sạch San Hà',
                traceabilityMethod: 'gtin',
                gtin: '8935217990012',
                lotNumber: 'SH-VIT-1014',
                supplierName: 'Công ty TNHH San Hà (Gia cầm sạch)',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
        snack: [
          {
            id: 'dish-135-w-s-1',
            name: 'Cơm bò',
            calories: 390,
            ingredients: [],
          },
        ],
        tickXanh: {
          breakfast: {
            url: 'https://tfd.tf/26198-B-29-0040266',
            verified: true,
          },
          // lunch is missing URL -> "Chưa có tick xanh" (matches user screenshot!)
          snack: {
            url: 'https://tfd.tf/26198-B-29-0040267',
            verified: true,
          },
        },
      },
      thursday: {
        breakfast: [
          {
            id: 'dish-135-th-b-1',
            name: 'Bún bò',
            calories: 430,
            ingredients: [
              {
                id: 'ing-135-7',
                name: 'Thịt bắp bò Masan',
                traceabilityMethod: 'gtin',
                gtin: '8938501102931',
                lotNumber: 'MD-BB-1015',
                supplierName: 'Tập đoàn Masan MEATDeli',
                supplierVerified: true,
                status: 'dat_chuan',
              },
              {
                id: 'ing-135-8',
                name: 'Bún tươi sợi lớn',
                traceabilityMethod: 'internal',
                internalCode: 'TEM-BUN-1015',
                status: 'dat_chuan',
              },
              {
                id: 'ing-135-9',
                name: 'Rau sống ăn kèm',
                traceabilityMethod: 'gtin',
                gtin: '8936014002194',
                lotNumber: 'DLG-RS-1015',
                supplierName: 'Hợp tác xã Rau sạch Đà Lạt Gap',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
        lunch: [
          {
            id: 'dish-135-th-l-1',
            name: 'Cơm cá',
            calories: 400,
            ingredients: [
              {
                id: 'ing-135-10',
                name: 'Cá hồi Nauy sạch',
                traceabilityMethod: 'internal',
                internalCode: 'TEM-CA-1015',
                status: 'dat_chuan',
              },
            ],
          },
        ],
        snack: [
          {
            id: 'dish-135-th-s-1',
            name: 'Mì',
            calories: 310,
            ingredients: [],
          },
        ],
        tickXanh: {
          breakfast: {
            url: 'https://tfd.tf/26198-B-29-0040268',
            verified: true,
          },
          lunch: {
            url: 'https://tfd.tf/26198-B-29-0040269',
            verified: true,
          },
          snack: {
            url: 'https://tfd.tf/26198-B-29-0040270',
            verified: true,
          },
        },
      },
      friday: {
        breakfast: [
          {
            id: 'dish-135-f-b-1',
            name: 'Bún riêu',
            calories: 390,
            ingredients: [
              {
                id: 'ing-135-11',
                name: 'Cua đồng xay sạch',
                traceabilityMethod: 'internal',
                internalCode: 'TEM-CUA-1016',
                status: 'dat_chuan',
              },
            ],
          },
        ],
        lunch: [
          {
            id: 'dish-135-f-l-1',
            name: 'Cơm sườn',
            calories: 490,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'dish-135-f-s-1',
            name: 'Cháo gà',
            calories: 280,
            ingredients: [],
          },
        ],
        tickXanh: {
          breakfast: {
            url: 'https://tfd.tf/26198-B-29-0040271',
            verified: true,
          },
          lunch: {
            url: 'https://tfd.tf/26198-B-29-0040272',
            verified: true,
          },
          snack: {
            url: 'https://tfd.tf/26198-B-29-0040273',
            verified: true,
          },
        },
      },
      saturday: {
        breakfast: [
          {
            id: 'dish-135-sa-b-1',
            name: 'cơm chay',
            calories: 350,
            ingredients: [
              {
                id: 'ing-135-12',
                name: 'Đậu hũ non hữu cơ',
                traceabilityMethod: 'gtin',
                gtin: '8936014002194',
                lotNumber: 'LOT-DH-1017',
                supplierName: 'Hợp tác xã Rau sạch Đà Lạt Gap',
                supplierVerified: true,
                status: 'dat_chuan',
              },
              {
                id: 'ing-135-13',
                name: 'Nấm đùi gà',
                traceabilityMethod: 'gtin',
                gtin: '8936014002194',
                lotNumber: 'LOT-NAM-1017',
                supplierName: 'Hợp tác xã Rau sạch Đà Lạt Gap',
                supplierVerified: true,
                status: 'dat_chuan',
              },
              {
                id: 'ing-135-14',
                name: 'Chả lụa chay',
                traceabilityMethod: 'internal',
                internalCode: 'TEM-CHAY-1017',
                status: 'dat_chuan',
              },
            ],
          },
          {
            id: 'dish-135-sa-b-2',
            name: 'cơm tấm',
            calories: 440,
            ingredients: [
              {
                id: 'ing-135-15',
                name: 'Gạo tấm thơm C.P',
                traceabilityMethod: 'gtin',
                gtin: '8936036021045',
                lotNumber: 'GAO-CP-1017',
                supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
        lunch: [
          {
            id: 'dish-135-sa-l-1',
            name: 'bún',
            calories: 220,
            ingredients: [],
          },
          {
            id: 'dish-135-sa-l-2',
            name: 'sữa',
            calories: 110,
            ingredients: [],
          },
          {
            id: 'dish-135-sa-l-3',
            name: 'trái cây',
            calories: 70,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'dish-135-sa-s-1',
            name: 'nui',
            calories: 240,
            ingredients: [],
          },
        ],
        tickXanh: {
          breakfast: {
            url: 'https://tfd.tf/26198-B-29-0040274',
            verified: true,
          },
          lunch: {
            url: 'https://tfd.tf/26198-B-29-0040275',
            verified: true,
          },
          snack: {
            url: 'https://tfd.tf/26198-B-29-0040276',
            verified: true,
          },
        },
      },
    },
    sendHistory: [
      {
        id: 'sh-135-01',
        sentAt: '2026-10-01T16:04:00Z',
        senderName: 'Tran Pham',
        senderRole: 'Quản trị viên',
        channel: 'announcement_board',
        note: 'Xuất bản thực đơn tuần 42 kèm Tick Xanh Trách Nhiệm theo từng buổi ăn',
      },
    ],
  },
  {
    id: 'menu-w38-all',
    title: 'Thực đơn tuần: 15/09/2026 - 20/09/2026',
    scope: 'all',
    weekNumber: 38,
    year: 2026,
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    contentType: 'grid',
    status: 'published',
    publishedViaAnnouncement: true,
    publishedAt: '2026-09-14T08:30:00Z',
    updatedAt: '2026-09-14T08:30:00Z',
    schedule: sampleWeekSchedule,
    sendHistory: [
      {
        id: 'sh-001',
        sentAt: '2026-09-14T08:30:00Z',
        senderName: 'Trần Thị Thu Thảo',
        senderRole: 'Bếp trưởng điều hành',
        channel: 'announcement_board',
        note: 'Công bố kèm thông báo Bảng Thông Tin cho phụ huynh toàn trường',
      },
      {
        id: 'sh-002',
        sentAt: '2026-09-15T09:00:00Z',
        senderName: 'Nguyễn Văn Nam',
        senderRole: 'Quản trị viên',
        channel: 'announcement_board',
        note: 'Cập nhật bổ sung giấy chứng nhận kiểm dịch thịt heo MEATDeli',
      },
    ],
  },
  {
    id: 'menu-w38-10a1',
    title: 'Thực đơn tuần: 15/09/2026 - 20/09/2026',
    scope: 'class',
    classId: '10A1',
    className: 'Lớp 10A1',
    weekNumber: 38,
    year: 2026,
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    contentType: 'grid',
    status: 'published',
    publishedViaAnnouncement: false,
    publishedAt: '2026-09-14T10:15:00Z',
    updatedAt: '2026-09-14T10:15:00Z',
    schedule: sampleWeekSchedule,
    sendHistory: [
      {
        id: 'sh-003',
        sentAt: '2026-09-14T10:15:00Z',
        senderName: 'Trần Thị Thu Thảo',
        senderRole: 'Bếp trưởng điều hành',
        channel: 'portal_only',
        note: 'Chế độ ăn tăng cường calo cho học sinh nội trú chuyên ban tự nhiên',
      },
    ],
  },
  {
    id: 'menu-w38-file-mamnon',
    title: 'Thực đơn tuần: 15/09/2026 - 20/09/2026',
    scope: 'class',
    classId: 'MN-CHOI',
    className: 'Lớp Chồi 1 (Mầm non)',
    weekNumber: 38,
    year: 2026,
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    contentType: 'file',
    status: 'published',
    publishedViaAnnouncement: true,
    publishedAt: '2026-09-13T16:00:00Z',
    updatedAt: '2026-09-13T16:00:00Z',
    fileAttachment: {
      name: 'Thuc_don_Mam_Non_Tuan_38.pdf',
      size: 1420500,
      url: '/files/menus/Thuc_don_Mam_Non_Tuan_38.pdf',
      mimeType: 'application/pdf',
    },
    sendHistory: [
      {
        id: 'sh-004',
        sentAt: '2026-09-13T16:00:00Z',
        senderName: 'Lê Hoàng Anh',
        senderRole: 'Chuyên viên dinh dưỡng mầm non',
        channel: 'announcement_board',
      },
    ],
  },
  {
    id: 'menu-w39-all',
    title: 'Thực đơn tuần: 22/09/2026 - 27/09/2026',
    scope: 'all',
    weekNumber: 39,
    year: 2026,
    startDate: '2026-09-22',
    endDate: '2026-09-27',
    contentType: 'grid',
    status: 'draft',
    updatedAt: '2026-09-20T11:00:00Z',
    schedule: sampleWeekSchedule,
    sendHistory: [],
  },
  {
    id: 'menu-w39-file-12a1',
    title: 'Thực đơn tuần: 22/09/2026 - 27/09/2026',
    scope: 'class',
    classId: '12A1',
    className: 'Lớp 12A1',
    weekNumber: 39,
    year: 2026,
    startDate: '2026-09-22',
    endDate: '2026-09-27',
    contentType: 'file',
    status: 'draft',
    updatedAt: '2026-09-21T09:30:00Z',
    fileAttachment: {
      name: 'Thuc_don_Noi_Tru_Lop12_Tuan39.png',
      size: 948200,
      url: '/files/menus/Thuc_don_Noi_Tru_Lop12_Tuan39.png',
      mimeType: 'image/png',
    },
    sendHistory: [],
  },
  {
    id: 'menu-w40-all',
    title: 'Thực đơn tuần: 29/09/2026 - 04/10/2026',
    scope: 'all',
    weekNumber: 40,
    year: 2026,
    startDate: '2026-09-29',
    endDate: '2026-10-04',
    contentType: 'grid',
    status: 'draft',
    updatedAt: '2026-09-22T14:15:00Z',
    schedule: sampleWeekSchedule,
    sendHistory: [],
  },
];
