window.addEventListener('message', (event) => {
  if (event.origin !== 'http://techsite4') {
    return;
  }

  const message = event.data;
  const temperatureTypes = {
    temperatureValue1: 'temperatureValue1',
    temperatureValue2: 'temperatureValue2',
    temperatureValue3: 'temperatureValue3',
  };

  if (temperatureTypes[message.type]) {
    if (message.value !== null) {
      const temperature = message.value;
      // Создаем переменную для каждого типа температуры и выводим в консоль
      const temperatureValue = temperature;
      console.log(`Переменная ${temperatureTypes[message.type]}:`, temperatureValue);
    }
  }
});
