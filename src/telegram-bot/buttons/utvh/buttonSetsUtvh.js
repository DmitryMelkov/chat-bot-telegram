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
  };

  return buttons[action] || buttons.production_utvh;
};