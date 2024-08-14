const types = {
  rezhim: {
    rezhim1: 'Режим работы печи:'
  },
  temperature: {
    temperature1: 'Температура 1-СК',
    temperature2: 'Температура 2-СК',
    temperature3: 'Температура 3-СК',
    temperature4: 'Температура в топке',
    temperature5: 'Температура вверху камеры загрузки',
    temperature6: 'Температура внизу камеры загрузки',
    temperature7: 'Температура на входе печи дожига',
    temperature8: 'Температура на выходе печи дожига',
    temperature9: 'Температура камеры выгрузки',
    temperature10: 'Температура дымовых газов котла',
    temperature11: 'Температура газов до скруббера',
    temperature12: 'Температура газов после скруббера',
    temperature13: 'Температура воды в ванне скруббер',
    temperature14: 'Температура гранул после холод-ка',
  },
  level: {
    level1: 'Уровень в ванне скруббера',
    level2: 'Уровень воды в емкости ХВО',
    level3: 'Уровень воды в барабане котла',
  },
  pressure: {
    pressure1: 'Давление газов после скруббера',
    pressure2: 'Давление пара в барабане котла',
  },
  underpressure: {
    underpressure1: 'Разрежение в топке печи',
    underpressure2: 'Разрежение в пространстве котла утилизатора',
    underpressure3: 'Разрежение низ загрузочной камеры',
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
