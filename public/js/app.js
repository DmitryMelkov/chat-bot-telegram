const types = {
  rezhim: {
    pechVr1rezhim1: 'Печь ВР1 Режим работы печи:',
    pechVr2rezhim1: 'Печь ВР2 Режим работы печи:',
  },
  temperature: {
    pechVr1temperature1: 'Температура 1-СК печь ВР1',
    pechVr1temperature2: 'Температура 2-СК печь ВР1',
    pechVr1temperature3: 'Температура 3-СК печь ВР1',
    pechVr1temperature4: 'Температура в топке печь ВР1',
    pechVr1temperature5: 'Температура вверху камеры загрузки печь ВР1',
    pechVr1temperature6: 'Температура внизу камеры загрузки печь ВР1',
    pechVr1temperature7: 'Температура на входе печи дожига печь ВР1',
    pechVr1temperature8: 'Температура на выходе печи дожига печь ВР1',
    pechVr1temperature9: 'Температура камеры выгрузки печь ВР1',
    pechVr1temperature10: 'Температура дымовых газов котла печь ВР1',
    pechVr1temperature11: 'Температура газов до скруббера печь ВР1',
    pechVr1temperature12: 'Температура газов после скруббера печь ВР1',
    pechVr1temperature13: 'Температура воды в ванне скруббер печь ВР1',
    pechVr1temperature14: 'Температура гранул после холод-ка печь ВР1',
    pechVr2temperature1: 'Температура 1-СК печь ВР2',
    pechVr2temperature2: 'Температура 2-СК печь ВР2',
    pechVr2temperature3: 'Температура 3-СК печь ВР2',
    pechVr2temperature4: 'Температура в топке печь ВР2',
    pechVr2temperature5: 'Температура вверху камеры загрузки печь ВР2',
    pechVr2temperature6: 'Температура внизу камеры загрузки печь ВР2',
    pechVr2temperature7: 'Температура на входе печи дожига печь ВР2',
    pechVr2temperature8: 'Температура на выходе печи дожига печь ВР2',
    pechVr2temperature9: 'Температура камеры выгрузки печь ВР2',
    pechVr2temperature10: 'Температура дымовых газов котла печь ВР2',
    pechVr2temperature11: 'Температура газов до скруббера печь ВР2',
    pechVr2temperature12: 'Температура газов после скруббера печь ВР2',
    pechVr2temperature13: 'Температура воды в ванне скруббер печь ВР2',
    pechVr2temperature14: 'Температура гранул после холод-ка печь ВР2',
  },
  level: {
    pechVr1level1: 'Уровень в ванне скруббера печь ВР1',
    pechVr1level2: 'Уровень воды в емкости ХВО печь ВР1',
    pechVr1level3: 'Уровень воды в барабане котла печь ВР1',
    pechVr2level1: 'Уровень в ванне скруббера печь ВР2',
    pechVr2level2: 'Уровень воды в емкости ХВО печь ВР2',
    pechVr2level3: 'Уровень воды в барабане котла печь ВР2',
  },
  pressure: {
    pechVr1pressure1: 'Давление газов после скруббера печь ВР1',
    pechVr1pressure2: 'Давление пара в барабане котла печь ВР1',
    pechVr2pressure1: 'Давление газов после скруббера печь ВР2',
    pechVr2pressure2: 'Давление пара в барабане котла печь ВР2',
  },
  underpressure: {
    pechVr1underpressure1: 'Разрежение в топке печи печь ВР1',
    pechVr1underpressure2: 'Разрежение в пространстве котла утилизатора печь ВР1',
    pechVr1underpressure3: 'Разрежение низ загрузочной камеры печь ВР1',
    pechVr2underpressure1: 'Разрежение в топке печи печь ВР2',
    pechVr2underpressure2: 'Разрежение в пространстве котла утилизатора печь ВР2',
    pechVr2underpressure3: 'Разрежение низ загрузочной камеры печь ВР2',
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

const autoRefreshIframe = () => {
  setInterval(() => {
    const iframe = document.querySelector('.iframe');
    iframe.src = iframe.src;
  }, 60000);
};

window.onload = autoRefreshIframe;
