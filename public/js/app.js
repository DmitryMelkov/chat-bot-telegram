const types = {
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

const sendDataToServer = (data) => {
  fetch('http://169.254.7.86:92/update-values', {
    // Ваш адрес сервера
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((result) => console.log('Результат:', result))
    .catch((error) => console.error('Ошибка:', error));
};

window.addEventListener('message', (event) => {
  if (event.origin !== 'http://techsite4') {
    return;
  }

  const message = event.data;

  // Проверка всех типов параметров
  for (const type in types) {
    if (types[type][message.type]) {
      if (message.value !== null) {
        const dataToSend = {};
        dataToSend[types[type][message.type]] = message.value;
        console.log('Отправка данных на сервер:', dataToSend); // Добавьте логирование
        sendDataToServer(dataToSend);
      }
    }
  }
});
