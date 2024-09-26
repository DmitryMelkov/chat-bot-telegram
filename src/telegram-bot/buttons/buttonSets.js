export const getButtonsByAction = (action) => {
  const buttons = {
    furnace_1: [
      [
        { text: 'Текущие параметры', callback_data: 'get_temperature_1' },
        { text: 'Графики', callback_data: 'charts_1' },
      ],
      [
        { text: 'Архив графиков', callback_data: 'charts_archive_1' },
        { text: 'Назад', callback_data: 'production_carbon' }
      ],
    ],
    furnace_2: [
      [
        { text: 'Текущие параметры', callback_data: 'get_temperature_2' },
        { text: 'Графики', callback_data: 'charts_2' },
      ],
      [{ text: 'Архив графиков', callback_data: 'charts_archive_2' },
        { text: 'Назад', callback_data: 'production_carbon' }],
    ],
    production_carbon: [
      [
        { text: 'ПК 1', callback_data: 'furnace_1' },
        { text: 'ПК 2', callback_data: 'furnace_2' },
      ],
    ],
    charts_1: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_1' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_1' },
      ],
      [
        { text: 'Уровень', callback_data: 'chart_level_1' },
        { text: 'Назад', callback_data: 'furnace_1' },
      ],
    ],
    chart_temperature_1: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_1_Day' },
        { text: 'Назад', callback_data: 'charts_1' },
      ],
    ],
    chart_pressure_1: [
      [
        { text: 'За 1 час', callback_data: 'chart_pressure_1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_1_Day' },
        { text: 'Назад', callback_data: 'charts_1' },
      ],
    ],
    chart_level_1: [
      [
        { text: 'За 1 час', callback_data: 'chart_level_1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_level_1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_level_1_Day' },
        { text: 'Назад', callback_data: 'charts_1' },
      ],
    ],
    charts_2: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_2' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_2' },
      ],
      [
        { text: 'Уровень', callback_data: 'chart_level_2' },
        { text: 'Назад', callback_data: 'furnace_2' },
      ],
    ],
    chart_temperature_2: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_2_Day' },
        { text: 'Назад', callback_data: 'charts_2' },
      ],
    ],
    chart_pressure_2: [
      [
        { text: 'За  1час', callback_data: 'chart_pressure_2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_2_Day' },
        { text: 'Назад', callback_data: 'charts_2' },
      ],
    ],
    chart_level_2: [
      [
        { text: 'За 1 час', callback_data: 'chart_level_2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_level_2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_level_2_Day' },
        { text: 'Назад', callback_data: 'charts_2' },
      ],
    ],
    charts_archive_1: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_1' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_1' },
      ],
      [
        { text: 'Уровень', callback_data: 'archive_level_1' },
        { text: 'Назад', callback_data: 'furnace_1' },
      ],
    ],
    charts_archive_2: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_2' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_2' },
      ],
      [
        { text: 'Уровень', callback_data: 'archive_level_2' },
        { text: 'Назад', callback_data: 'furnace_2' },
      ],
    ],
    back_to_production: [[{ text: 'Карбон', callback_data: 'production_carbon' }]],
    help: [[{ text: 'Назад', callback_data: 'back_to_main' }]],
    back_to_main: [
      [
        { text: 'Карбон', callback_data: 'production_carbon' },
        { text: 'Справка', callback_data: 'help' },
      ],
    ],
  };

  return buttons[action] || buttons.back_to_production;
};
