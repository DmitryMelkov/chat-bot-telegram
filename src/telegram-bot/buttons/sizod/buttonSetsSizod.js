export const getButtonsByActionSizod = (action) => {
  const buttons = {
    production_sizod: [
      [
        { text: 'Дот-Эко', callback_data: 'sizod_dot_eko' },
        // { text: 'Дот-Про', callback_data: 'sizod_dot_pro' },
      ],
      [{ text: 'Назад', callback_data: 'back_to_main' }],
    ],
    sizod_dot_eko: [
      [
        { text: 'Текущие параметры', callback_data: 'sizod_get_params_eko' },
        { text: 'Отчет', callback_data: 'sizod_report_eko' },
      ],
      [
        { text: 'Графики', callback_data: 'sizod_charts_eko' },
        { text: 'Архив Графиков', callback_data: 'sizod_charts_archive_eko' },
      ],
      [{ text: 'Назад', callback_data: 'production_sizod' }],
    ],
    sizod_dot_pro: [
      [
        { text: 'Текущие параметры', callback_data: 'sizod_get_params_pro' },
        { text: 'Отчет', callback_data: 'sizod_report_pro' },
      ],
      [
        { text: 'Графики', callback_data: 'sizod_charts_pro' },
        { text: 'Архив Графиков', callback_data: 'sizod_charts_archive_pro' },
      ],
      [{ text: 'Назад', callback_data: 'production_sizod' }],
    ],
  };

  return buttons[action] || buttons.production_sizod;
};
