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
      [
        { text: 'Сушилка 1', callback_data: 'sushilka_1' },
        { text: 'Сушилка 2', callback_data: 'sushilka_2' },
      ],
      [
        { text: 'Мельницы', callback_data: 'mill_k296' },
        { text: 'Энергоресурсы', callback_data: 'energy_resources_carbon' },
      ],
      [{ text: 'Смоляные реактора', callback_data: 'reactor_k296' }],
      [{ text: 'Назад', callback_data: 'back_to_main' }],
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
    sushilka_1: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_sushilka1' },
        { text: 'Графики', callback_data: 'charts_sushilka1' },
      ],
      [
        { text: 'Архивы графиков', callback_data: 'charts_archive_sushilka1' },
        { text: 'Назад', callback_data: 'production_carbon' },
      ],
    ],
    charts_sushilka1: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_sushilka1' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_sushilka1' },
      ],
      [{ text: 'Назад', callback_data: 'sushilka_1' }],
    ],
    chart_temperature_sushilka1: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_sushilka1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_sushilka1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_sushilka1_Day' },
        { text: 'Назад', callback_data: 'charts_sushilka1' },
      ],
    ],
    chart_pressure_sushilka1: [
      [
        { text: 'За 1 час', callback_data: 'chart_pressure_sushilka1_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_sushilka1_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_sushilka1_Day' },
        { text: 'Назад', callback_data: 'charts_sushilka1' },
      ],
    ],
    charts_archive_sushilka1: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_sushilka1' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_sushilka1' },
      ],
      [{ text: 'Назад', callback_data: 'sushilka_1' }],
    ],
    sushilka_2: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_sushilka2' },
        { text: 'Графики', callback_data: 'charts_sushilka2' },
      ],
      [
        { text: 'Архивы графиков', callback_data: 'charts_archive_sushilka2' },
        { text: 'Назад', callback_data: 'production_carbon' },
      ],
    ],
    charts_sushilka2: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_sushilka2' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_sushilka2' },
      ],
      [{ text: 'Назад', callback_data: 'sushilka_2' }],
    ],
    chart_temperature_sushilka2: [
      [
        { text: 'За 1 час', callback_data: 'chart_temperature_sushilka2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_temperature_sushilka2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_temperature_sushilka2_Day' },
        { text: 'Назад', callback_data: 'charts_sushilka2' },
      ],
    ],
    chart_pressure_sushilka2: [
      [
        { text: 'За 1 час', callback_data: 'chart_pressure_sushilka2_Hour' },
        { text: 'За 12 часов', callback_data: 'chart_pressure_sushilka2_Twelve' },
      ],
      [
        { text: 'За 24 часа', callback_data: 'chart_pressure_sushilka2_Day' },
        { text: 'Назад', callback_data: 'charts_sushilka2' },
      ],
    ],
    charts_archive_sushilka2: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_sushilka2' },
        { text: 'Давление/разрежение', callback_data: 'archive_pressure_sushilka2' },
      ],
      [{ text: 'Назад', callback_data: 'sushilka_2' }],
    ],
    mill_k296: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_mill' },
        { text: 'Графики', callback_data: 'charts_mill' },
      ],
      [
        { text: 'Архивы графиков', callback_data: 'charts_archive_mill' },
        { text: 'Назад', callback_data: 'production_carbon' },
      ],
    ],
    charts_mill: [
      [
        { text: 'Вибрация Мельницы №1', callback_data: 'chart_vibration_mill1' },
        { text: 'Вибрация Мельницы №2', callback_data: 'chart_vibration_mill2' },
      ],
      [
        { text: 'Вибрация Мельниц к.10б', callback_data: 'charts_mill10b' },
        { text: 'Назад', callback_data: 'mill_k296' },
      ],
    ],
    charts_mill10b: [
      [
        { text: 'Вибрация ШБМ №3', callback_data: 'chart_vibration_sbm3' },
        { text: 'Вибрация YGM-9517', callback_data: 'chart_vibration_ygm9517' },
      ],
      [
        { text: 'Вибрация YCVOK-130', callback_data: 'chart_vibration_ycvok130' },
        { text: 'Назад', callback_data: 'charts_mill' },
      ],
    ],
    charts_archive_mill: [
      [
        { text: 'Вибрация Мельницы №1', callback_data: 'archive_vibration_mill1' },
        { text: 'Вибрация Мельницы №2', callback_data: 'archive_vibration_mill2' },
      ],
      [
        { text: 'Вибрация Мельниц к.10б', callback_data: 'charts_archive_mill10b' },
        { text: 'Назад', callback_data: 'mill_k296' },
      ],
    ],
    charts_archive_mill10b: [
      [
        { text: 'Вибрация ШБМ №3', callback_data: 'archive_vibration_sbm3' },
        { text: 'Вибрация YGM-9517', callback_data: 'archive_vibration_ygm9517' },
      ],
      [
        { text: 'Вибрация YCVOK-130', callback_data: 'archive_vibration_ycvok130' },
        { text: 'Назад', callback_data: 'charts_archive_mill' },
      ],
    ],
    reactor_k296: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_reactor' },
        { text: 'Графики', callback_data: 'charts_reactor' },
      ],
      [
        { text: 'Архивы графиков', callback_data: 'charts_archive_reactor' },
        { text: 'Назад', callback_data: 'production_carbon' },
      ],
    ],
    charts_reactor: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_reactor' },
        { text: 'Уровень', callback_data: 'chart_level_reactor' },
      ],
      [{ text: 'Назад', callback_data: 'reactor_k296' }],
    ],
    charts_archive_reactor: [
      [
        { text: 'Температура', callback_data: 'archive_temperature_reactor' },
        { text: 'Уровень', callback_data: 'archive_level_reactor' },
      ],
      [{ text: 'Назад', callback_data: 'reactor_k296' }],
    ],
    energy_resources_carbon: [
      [
        { text: 'Текущие параметры', callback_data: 'get_params_energy_resources_carbon' },
        { text: 'Графики', callback_data: 'charts_energy_resources_carbon' },
      ],
      [{ text: 'Архив графиков', callback_data: 'charts_archive_energy_resources_carbon' }],
      [{ text: 'Назад', callback_data: 'production_carbon' }],
    ],

    charts_energy_resources_carbon: [
      [
        { text: 'Давление пара', callback_data: 'chart_pressure_par_energy_resources_carbon' },
        { text: 'Расход пара', callback_data: 'chart_consumption_par_energy_resources_carbon' },
      ],

      [{ text: 'Назад', callback_data: 'energy_resources_carbon' }],
    ],
    charts_archive_energy_resources_carbon: [
      [
        { text: 'Давление пара', callback_data: 'archive_pressure_par_energy_resources_carbon' },
        { text: 'Расход пара', callback_data: 'archive_consumption_par_energy_resources_carbon' },
      ],
      [{ text: 'Назад', callback_data: 'energy_resources_carbon' }],
    ],
    back_to_production: [
      [
        { text: 'Карбон', callback_data: 'production_carbon' },
        { text: 'Сизод', callback_data: 'production_sizod' },
        { text: 'УТВХ', callback_data: 'production_utvh' },
      ],
    ],
    back_to_main: [
      [
        { text: 'Карбон', callback_data: 'production_carbon' },
        { text: 'Сизод', callback_data: 'production_sizod' },
        { text: 'УТВХ', callback_data: 'production_utvh' },
      ],
    ],
  };

  return buttons[action] || buttons.back_to_production;
};
