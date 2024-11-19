export const getButtonsByAction = (action) => {
  const buttons = {
    production_carbon: [
      [
        { text: 'ПК 1', callback_data: 'furnace_vr1' },
        { text: 'ПК 2', callback_data: 'furnace_vr2' },
      ],
      [
        { text: 'МПА 2', callback_data: 'furnace_mpa2' },
        { text: 'МПА 3', callback_data: 'furnace_mpa3' },
      ],
    ],
    furnace_vr1: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_vr1' },
        { text: 'Нотисы', callback_data: 'get_dose_notis_vr1' },
      ],
      [
        { text: 'Графики', callback_data: 'charts_vr1' },
        { text: 'Архив графиков', callback_data: 'charts_archive_vr1' },
      ],
      [{ text: 'Назад', callback_data: 'production_carbon' }],
    ],
    charts_vr1: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_vr1' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_vr1' },
      ],
      [
        { text: 'Уровень', callback_data: 'chart_level_vr1' },
        { text: 'Нотисы', callback_data: 'chart_dose_vr1' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_vr1' }],
    ],
    chart_temperature_vr1: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_vr1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_vr1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_vr1_Day' },
        { text: 'Назад', callback_data: 'charts_vr1' },
      ],
    ],
    chart_pressure_vr1: [
      [
        { text: 'За 1 час', callback_data: 'chart_pressure_vr1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_vr1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_vr1_Day' },
        { text: 'Назад', callback_data: 'charts_vr1' },
      ],
    ],
    chart_level_vr1: [
      [
        { text: 'За 1 час', callback_data: 'chart_level_vr1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_level_vr1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_level_vr1_Day' },
        { text: 'Назад', callback_data: 'charts_vr1' },
      ],
    ],
    chart_dose_vr1: [
      [
        { text: 'За 1 час', callback_data: 'chart_dose_vr1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_dose_vr1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_dose_vr1_Day' },
        { text: 'Назад', callback_data: 'charts_vr1' },
      ],
    ],
    charts_archive_vr1: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_vr1' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_vr1' },
      ],
      [
        { text: 'Уровень', callback_data: 'archive_level_vr1' },
        { text: 'Нотисы', callback_data: 'archive_dose_vr1' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_vr1' }],
    ],
    furnace_vr2: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_vr2' },
        { text: 'Нотисы', callback_data: 'get_dose_notis_2' },
      ],
      [
        { text: 'Графики', callback_data: 'charts_vr2' },
        { text: 'Архив графиков', callback_data: 'charts_archive_vr2' },
      ],
      [{ text: 'Назад', callback_data: 'production_carbon' }],
    ],
    charts_vr2: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_vr2' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_vr2' },
      ],
      [
        { text: 'Уровень', callback_data: 'chart_level_vr2' },
        { text: 'Нотисы', callback_data: 'chart_dose_vr2' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_vr2' }],
    ],
    chart_temperature_vr2: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_vr2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_vr2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_vr2_Day' },
        { text: 'Назад', callback_data: 'charts_vr2' },
      ],
    ],
    chart_pressure_vr2: [
      [
        { text: 'За 1 час', callback_data: 'chart_pressure_vr2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_vr2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_vr2_Day' },
        { text: 'Назад', callback_data: 'charts_vr2' },
      ],
    ],
    chart_level_vr2: [
      [
        { text: 'За 1 час', callback_data: 'chart_level_vr2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_level_vr2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_level_vr2_Day' },
        { text: 'Назад', callback_data: 'charts_vr2' },
      ],
    ],
    chart_dose_vr2: [
      [
        { text: 'За 1 час', callback_data: 'chart_dose_vr2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_dose_vr2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_dose_vr2_Day' },
        { text: 'Назад', callback_data: 'charts_vr2' },
      ],
    ],
    charts_archive_vr2: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_vr2' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_vr2' },
      ],
      [
        { text: 'Уровень', callback_data: 'archive_level_vr2' },
        { text: 'Нотисы', callback_data: 'archive_dose_vr2' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_vr2' }],
    ],
    furnace_mpa2: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_mpa2' },
        { text: 'Графики', callback_data: 'charts_mpa2' },
      ],
      [
        { text: 'Архивы графиков', callback_data: 'charts_archive_mpa2' },
        { text: 'Назад', callback_data: 'production_carbon' },
      ],
    ],
    charts_mpa2: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_mpa2' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_mpa2' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_mpa2' }],
    ],
    chart_temperature_mpa2: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_mpa2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_mpa2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_mpa2_Day' },
        { text: 'Назад', callback_data: 'charts_mpa2' },
      ],
    ],
    chart_pressure_mpa2: [
      [
        { text: 'За 1 час', callback_data: 'chart_pressure_mpa2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_mpa2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_mpa2_Day' },
        { text: 'Назад', callback_data: 'charts_mpa2' },
      ],
    ],
    charts_archive_mpa2: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_mpa2' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_mpa2' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_mpa2' }],
    ],
    furnace_mpa3: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_mpa3' },
        { text: 'Графики', callback_data: 'charts_mpa3' },
      ],
      [
        { text: 'Архивы графиков', callback_data: 'charts_archive_mpa3' },
        { text: 'Назад', callback_data: 'production_carbon' },
      ],
    ],
    charts_mpa3: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_mpa3' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_mpa3' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_mpa3' }],
    ],
    chart_temperature_mpa3: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_mpa3_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_mpa3_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_mpa3_Day' },
        { text: 'Назад', callback_data: 'charts_mpa3' },
      ],
    ],
    chart_pressure_mpa3: [
      [
        { text: 'За 1 час', callback_data: 'chart_pressure_mpa3_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_mpa3_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_mpa3_Day' },
        { text: 'Назад', callback_data: 'charts_mpa3' },
      ],
    ],
    charts_archive_mpa3: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_mpa3' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_mpa3' },
      ],
      [{ text: 'Назад', callback_data: 'furnace_mpa3' }],
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
