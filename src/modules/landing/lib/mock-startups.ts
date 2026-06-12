export type MockStartup = {
  id: string;
  title: string;
  shortDescription: string;
  creatorName: string;
  score: number;
  commentCount: number;
  fileCount: number;
};

export const LANDING_MOCK_STARTUPS: MockStartup[] = [
  {
    id: '1',
    title: 'НейроФерма IoT',
    shortDescription:
      'Умный контроль тепличных комплексов и прогнозирование погоды нейросетью.',
    creatorName: 'Елена Сазонова',
    score: 32,
    commentCount: 3,
    fileCount: 2,
  },
  {
    id: '2',
    title: 'ЭкоКоннект',
    shortDescription:
      'B2B маркетплейс вторичного сырья с автоматическим расчетом логистики.',
    creatorName: 'Александр Громов',
    score: 18,
    commentCount: 1,
    fileCount: 1,
  },
  {
    id: '3',
    title: 'DocuFlow AI',
    shortDescription:
      'Автоматизация юридического документооборота для малого бизнеса.',
    creatorName: 'Дмитрий Шеховцов',
    score: 7,
    commentCount: 2,
    fileCount: 3,
  },
];
