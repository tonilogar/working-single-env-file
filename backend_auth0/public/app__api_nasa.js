$(document).ready(function () {
  const bg1 = $('#bg1');
  const bg2 = $('#bg2');
  let currentBg = 1;

  // NASA API
  const count = 30;
  const apiKey = 'BSiWx0OSzxJvAp8L9p0p8tcwwGYTS5eC55nVxUhd';
  const nasaApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

  let resultsArray = [];

  const changeBackground = () => {
    const randomIndex = Math.floor(Math.random() * resultsArray.length);
    const imageUrl = resultsArray[randomIndex].url;

    if (currentBg === 1) {
      bg2.css('background-image', `url(${imageUrl})`);
      bg2.css('opacity', 1);
      bg1.css('opacity', 0);
      currentBg = 2;
    } else {
      bg1.css('background-image', `url(${imageUrl})`);
      bg1.css('opacity', 1);
      bg2.css('opacity', 0);
      currentBg = 1;
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(nasaApiUrl);
      resultsArray = await response.json();
      changeBackground();
      setInterval(changeBackground, 5000); // Cambiar cada 10 segundos
    } catch (error) {
      console.error('Error fetching NASA pictures:', error);
    }
  };

  fetchImages();
});
