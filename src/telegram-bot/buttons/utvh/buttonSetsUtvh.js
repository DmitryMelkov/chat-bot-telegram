export const getButtonsByActionUtvh = (action) => {
  const buttons = {
    production_utvh: [
      [
        { text: 'Котел 1', callback_data: 'utvh_kotel_1' },
        { text: 'Котел 2', callback_data: 'utvh_kotel_2' },
      ],
      [
        { text: 'Котел 3', callback_data: 'utvh_kotel_3' },
        { text: 'Назад', callback_data: 'back_to_main' },
      ],
    ],
    utvh_kotel_1: [
      [
        { text: 'Текущие параметры', callback_data: 'utvh_kotel_1_params' },
        { text: 'Графики', callback_data: 'utvh_kotel_1_charts' },
      ],
      [
        { text: 'Архив графиков', callback_data: 'utvh_kotel_1_archive' },
        { text: 'Сигнализации', callback_data: 'utvh_kotel_1_alarms' },
      ],
      [{ text: 'Назад', callback_data: 'production_utvh' }],
    ],
    utvh_kotel_2: [
      [
        { text: 'Текущие параметры', callback_data: 'utvh_kotel_2_params' },
        { text: 'Графики', callback_data: 'utvh_kotel_2_charts' },
      ],
      [
        { text: 'Архив графиков', callback_data: 'utvh_kotel_2_archive' },
        { text: 'Сигнализации', callback_data: 'utvh_kotel_2_alarms' },
      ],
      [{ text: 'Назад', callback_data: 'production_utvh' }],
    ],
    utvh_kotel_3: [
      [
        { text: 'Текущие параметры', callback_data: 'utvh_kotel_3_params' },
        { text: 'Графики', callback_data: 'utvh_kotel_3_charts' },
      ],
      [
        { text: 'Архив графиков', callback_data: 'utvh_kotel_3_archive' },
        { text: 'Сигнализации', callback_data: 'utvh_kotel_3_alarms' },
      ],
      [{ text: 'Назад', callback_data: 'production_utvh' }],
    ],
    utvh_kotel_1_charts: [
      [
        { text: 'Уровень', callback_data: 'utvh_kotel_1_level' },
        { text: 'Давление', callback_data: 'utvh_kotel_1_pressure' },
      ],
      [{ text: 'Назад', callback_data: 'utvh_kotel_1' }],
    ],
    utvh_kotel_2_charts: [
      [
        { text: 'Уровень', callback_data: 'utvh_kotel_2_level' },
        { text: 'Давление', callback_data: 'utvh_kotel_2_pressure' },
      ],
      [{ text: 'Назад', callback_data: 'utvh_kotel_2' }],
    ],
    utvh_kotel_3_charts: [
      [
        { text: 'Уровень', callback_data: 'utvh_kotel_3_level' },
        { text: 'Давление', callback_data: 'utvh_kotel_3_pressure' },
      ],
      [{ text: 'Назад', callback_data: 'utvh_kotel_3' }],
    ],
    utvh_kotel_1_level: [
      [
        { text: 'За 1 час', callback_data: 'utvh_kotel_1_level_1h' },
        { text: 'За 12 часов', callback_data: 'utvh_kotel_1_level_12h' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'utvh_kotel_1_level_24h' },
        { text: 'Назад', callback_data: 'utvh_kotel_1_charts' },
      ],
    ],
    utvh_kotel_2_level: [
      [
        { text: 'За 1 час', callback_data: 'utvh_kotel_2_level_1h' },
        { text: 'За 12 часов', callback_data: 'utvh_kotel_2_level_12h' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'utvh_kotel_2_level_24h' },
        { text: 'Назад', callback_data: 'utvh_kotel_2_charts' },
      ],
    ],
    utvh_kotel_3_level: [
      [
        { text: 'За 1 час', callback_data: 'utvh_kotel_3_level_1h' },
        { text: 'За 12 часов', callback_data: 'utvh_kotel_3_level_12h' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'utvh_kotel_3_level_24h' },
        { text: 'Назад', callback_data: 'utvh_kotel_3_charts' },
      ],
    ],
    utvh_kotel_1_pressure: [
      [
        { text: 'За 1 час', callback_data: 'utvh_kotel_1_pressure_1h' },
        { text: 'За 12 часов', callback_data: 'utvh_kotel_1_pressure_12h' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'utvh_kotel_1_pressure_24h' },
        { text: 'Назад', callback_data: 'utvh_kotel_1_charts' },
      ],
    ],
    utvh_kotel_2_pressure: [
      [
        { text: 'За 1 час', callback_data: 'utvh_kotel_2_pressure_1h' },
        { text: 'За 12 часов', callback_data: 'utvh_kotel_2_pressure_12h' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'utvh_kotel_2_pressure_24h' },
        { text: 'Назад', callback_data: 'utvh_kotel_2_charts' },
      ],
    ],
    utvh_kotel_3_pressure: [
      [
        { text: 'За 1 час', callback_data: 'utvh_kotel_3_pressure_1h' },
        { text: 'За 12 часов', callback_data: 'utvh_kotel_3_pressure_12h' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'utvh_kotel_3_pressure_24h' },
        { text: 'Назад', callback_data: 'utvh_kotel_3_charts' },
      ],
    ],
  };

  return buttons[action] || buttons.production_utvh;
};