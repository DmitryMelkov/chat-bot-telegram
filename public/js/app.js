const types = {
  rezhim: {
    rezhim1: 'Режим работы печи:'
  },
  temperature: {
    temperature1: 'Температура 1-СК',
    temperature2: 'Температура 2-СК',
    temperature3: 'Температура 3-СК',
  },
  level: {
    level1: 'Уровень в ванне скруббера',
    level2: 'Уровень воды в емкости ХВО',
    level3: 'Уровень воды в барабане котла',
  },
  pressure: {
    pressure1: 'Давление в топке печи',
    pressure2: 'Давление газов после скруббера',
  },
  underpressure: {
    underpressure1: 'Разрежение в пространстве котла утилизатора',
    underpressure2: 'Разрежение низ загрузочной камеры',
  },
};

const sendDataToServer = async (data) => {
  try {
    const response = await fetch('http://169.254.7.86:92/update-values', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.text();
    console.log('Результат:', result);
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

window.addEventListener('message', (event) => {
  if (event.origin !== 'http://techsite4') {
    return;
  }

  const { type, value } = event.data;

  if (value !== null) {
    for (const category in types) {
      if (types[category][type]) {
        const dataToSend = { [types[category][type]]: value };
        console.log('Отправка данных на сервер:', dataToSend);
        sendDataToServer(dataToSend);
        break;
      }
    }
  }
});
