export type Algorithm = 'Best' | 'LightGBM' | 'LogisticRegression' | 'RandomForest' | 'XGBoost';
export type ForecastMode = 'forecast' | 'evaluation';
export type Horizon = 1 | 3 | 7;

export interface ProvinceOption {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  location: string;
  province: string;
  provinceLabel: string;
  dateTime: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  pressure: number;
  latitude: number;
  longitude: number;
  algorithm: Algorithm;
  horizon: Horizon;
  mode: ForecastMode;
  evaluationDate?: string;
}

export interface WeatherRequestPayload {
  province: string;
  algorithm: Algorithm;
  horizon: Horizon;
  mode: ForecastMode;
  evaluation_date?: string;
}

export const SUPPORTED_PROVINCES: ProvinceOption[] = [
  { value: 'An_Giang', label: 'An Giang', latitude: 10.5216, longitude: 105.1259 },
  { value: 'Bac_Ninh', label: 'Bắc Ninh', latitude: 21.1861, longitude: 106.0763 },
  { value: 'Can_Tho', label: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469 },
  { value: 'Cao_Bang', label: 'Cao Bằng', latitude: 22.6667, longitude: 106.25 },
  { value: 'Ca_Mau', label: 'Cà Mau', latitude: 9.1769, longitude: 105.1524 },
  { value: 'Dak_Lak', label: 'Đắk Lắk', latitude: 12.71, longitude: 108.2378 },
  { value: 'Da_Nang', label: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022 },
  { value: 'Dien_Bien', label: 'Điện Biên', latitude: 21.386, longitude: 103.023 },
  { value: 'Dong_Nai', label: 'Đồng Nai', latitude: 10.9453, longitude: 106.824 },
  { value: 'Dong_Thap', label: 'Đồng Tháp', latitude: 10.4938, longitude: 105.6881 },
  { value: 'Gia_Lai', label: 'Gia Lai', latitude: 13.9833, longitude: 108 },
  { value: 'Hai_Phong', label: 'Hải Phòng', latitude: 20.8449, longitude: 106.6881 },
  { value: 'Ha_Noi', label: 'Hà Nội', latitude: 21.0285, longitude: 105.8542 },
  { value: 'Ha_Tinh', label: 'Hà Tĩnh', latitude: 18.355, longitude: 105.8877 },
  { value: 'Ho_Chi_Minh', label: 'Hồ Chí Minh', latitude: 10.8231, longitude: 106.6297 },
  { value: 'Hue', label: 'Thừa Thiên Huế', latitude: 16.4637, longitude: 107.5909 },
  { value: 'Hung_Yen', label: 'Hưng Yên', latitude: 20.6464, longitude: 106.0511 },
  { value: 'Khanh_Hoa', label: 'Khánh Hòa', latitude: 12.2388, longitude: 109.1967 },
  { value: 'Lai_Chau', label: 'Lai Châu', latitude: 22.3964, longitude: 103.4582 },
  { value: 'Lam_Dong', label: 'Lâm Đồng', latitude: 11.9404, longitude: 108.4583 },
  { value: 'Lang_Son', label: 'Lạng Sơn', latitude: 21.8537, longitude: 106.761 },
  { value: 'Lao_Cai', label: 'Lào Cai', latitude: 22.4856, longitude: 103.9707 },
  { value: 'Nghe_An', label: 'Nghệ An', latitude: 18.6796, longitude: 105.6813 },
  { value: 'Ninh_Binh', label: 'Ninh Bình', latitude: 20.2506, longitude: 105.9745 },
  { value: 'Phu_Tho', label: 'Phú Thọ', latitude: 21.3227, longitude: 105.401 },
  { value: 'Quang_Ngai', label: 'Quảng Ngãi', latitude: 15.1214, longitude: 108.8044 },
  { value: 'Quang_Ninh', label: 'Quảng Ninh', latitude: 21.0064, longitude: 107.2925 },
  { value: 'Quang_Tri', label: 'Quảng Trị', latitude: 16.75, longitude: 107.2 },
  { value: 'Son_La', label: 'Sơn La', latitude: 21.3256, longitude: 103.9188 },
  { value: 'Tay_Ninh', label: 'Tây Ninh', latitude: 11.3352, longitude: 106.1099 },
  { value: 'Thai_Nguyen', label: 'Thái Nguyên', latitude: 21.5942, longitude: 105.8482 },
  { value: 'Thanh_Hoa', label: 'Thanh Hóa', latitude: 19.8067, longitude: 105.7852 },
  { value: 'Tuyen_Quang', label: 'Tuyên Quang', latitude: 21.8233, longitude: 105.2181 },
  { value: 'Vinh_Long', label: 'Vĩnh Long', latitude: 10.2537, longitude: 105.9722 },
];

export const ALGORITHM_OPTIONS: { value: Algorithm; label: string }[] = [
  { value: 'Best', label: 'Best model by metric' },
  { value: 'XGBoost', label: 'XGBoost' },
  { value: 'LightGBM', label: 'LightGBM' },
  { value: 'RandomForest', label: 'Random Forest' },
  { value: 'LogisticRegression', label: 'Logistic Regression' },
];

export const HORIZON_OPTIONS: { value: Horizon; label: string }[] = [
  { value: 1, label: '1 day' },
  { value: 3, label: '3 days' },
  { value: 7, label: '7 days' },
];

export function getProvinceOption(value: string) {
  return SUPPORTED_PROVINCES.find((province) => province.value === value) ?? SUPPORTED_PROVINCES[0];
}
