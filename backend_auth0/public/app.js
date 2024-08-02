$(document).ready(function () {
  const bg1 = $('#bg1');
  const bg2 = $('#bg2');
  let currentBg = 1;

  // NASA API
  const apiKey = '4CGYfPiWO7oTAfGUudmEhe1dp5eaHOsAp29VSi4i';
  const epicApiUrl = `https://api.nasa.gov/EPIC/api/natural?api_key=${apiKey}`;

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
      const response = await fetch(epicApiUrl);
      const data = await response.json();
      resultsArray = data.map(image => {
        return {
          url: `https://epic.gsfc.nasa.gov/archive/natural/${image.date.split(" ")[0].replace(/-/g, "/")}/png/${image.image}.png`
        };
      });
      changeBackground();
      setInterval(changeBackground, 10000); // Cambiar cada 10 segundos
    } catch (error) {
      console.error('Error fetching EPIC images:', error);
    }
  };

  fetchImages();
});
