export const sendDataToServer = async (data) => {
  try {
    const response = await fetch('http://169.254.7.86:3001/update-values', {
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
