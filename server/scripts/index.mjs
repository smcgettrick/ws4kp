import {json} from "./modules/utils/fetch.mjs";
import noSleep from "./modules/utils/nosleep.mjs";
import {
  message as navMessage,
  isPlaying,
  resize,
  resetStatuses,
  latLonReceived,
  stopAutoRefreshTimer,
  registerRefreshData,
} from "./modules/navigation.mjs";
import {round2} from "./modules/utils/units.mjs";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

let fullScreenOverride = false;
const isAudioPlaying = false;

const categories = [
  "Land Features",
  "Bay",
  "Channel",
  "Cove",
  "Dam",
  "Delta",
  "Gulf",
  "Lagoon",
  "Lake",
  "Ocean",
  "Reef",
  "Reservoir",
  "Sea",
  "Sound",
  "Strait",
  "Waterfall",
  "Wharf", // Water Features
  "Amusement Park",
  "Historical Monument",
  "Landmark",
  "Tourist Attraction",
  "Zoo", // POI/Arts and Entertainment
  "College", // POI/Education
  "Beach",
  "Campground",
  "Golf Course",
  "Harbor",
  "Nature Reserve",
  "Other Parks and Outdoors",
  "Park",
  "Racetrack",
  "Scenic Overlook",
  "Ski Resort",
  "Sports Center",
  "Sports Field",
  "Wildlife Reserve", // POI/Parks and Outdoors
  "Airport",
  "Ferry",
  "Marina",
  "Pier",
  "Port",
  "Resort", // POI/Travel
  "Postal",
  "Populated Place",
];

const audioList = [];
audioList.push("audio/Andrew Korus - Hello There.mp3");
audioList.push("audio/Ficara - Stormy Weather.mp3");
audioList.push("audio/Incognito - Larc En Ciel De Miles.mp3");
audioList.push("audio/Ozzie Ahlers - Fingerpainting.mp3");
audioList.push("audio/Ray Obiedo - Blue Kiss.mp3");
audioList.push("audio/Richard Tyznik - Hi Times.mp3");
audioList.push("audio/Torcuato Mariano - Ocean Way.mp3");
audioList.push("audio/Gota - All Alone.mp3");
audioList.push("audio/Ficara - High Tides Of Maui.mp3");
audioList.push("audio/Chris Camozzi - Swing Shift.mp3");
audioList.push("audio/Brian Hughes - StringBean.mp3");
audioList.push("audio/Brian Hughes - Postcard From Brazil.mp3");
audioList.push("audio/Brian Hughes - One 2 One.mp3");
audioList.push("audio/Brian Hughes - Here We Go.mp3");
audioList.push("audio/Brian Hughes - Three Graces.mp3");
audioList.push("audio/Ficara - Friends Forever.mp3");
audioList.push("audio/Physical Therapy - What The Flush.mp3");
audioList.push("audio/Trammell Starks - The Blizzard Song.mp3");
audioList.push("audio/Terry Coleman - Just Groovin.mp3");
audioList.push("audio/Terry Coleman - Autumn Dance.mp3");
audioList.push("audio/Terry Coleman - Amazed.mp3");
audioList.push("audio/Ray Obiedo - Sienna.mp3");
audioList.push("audio/Incognito - Sunchild.mp3");
audioList.push("audio/Ficara - Gliding.mp3");
audioList.push("audio/Ficara - Craig.mp3");
audioList.push("audio/Eddie Reasoner - Sea Breeze.mp3");
audioList.push("audio/Chris Camozzi - My Dancing Heart.mp3");
audioList.push("audio/Chris Camozzi - Suede.mp3");
audioList.push("audio/Joe Sample - Rainbow Seeker.mp3");
audioList.push("audio/Norman Brown - Celebration.mp3");
audioList.push("audio/Wayne Gerard - Aint She Sweet.mp3");
audioList.push("audio/Wayman Tisdale - Brazilia.mp3");
audioList.push("audio/The Rippingtons - In Another Life.mp3");
audioList.push("audio/The Rippingtons - Life In The Tropics.mp3");
audioList.push("audio/Chris Camozzi - Hangin Out.mp3");
audioList.push("audio/Bryan Savage - Two Cool.mp3");
audioList.push("audio/Trammell Starks - 50 Below.mp3");
audioList.push("audio/Trammell Starks - After Midnight.mp3");
audioList.push("audio/Trammell Starks - After The Rain.mp3");
audioList.push("audio/Trammell Starks - All I Need To Know.mp3");
audioList.push("audio/Trammell Starks - Autumn Blue.mp3");
audioList.push("audio/Trammell Starks - Better Than Nothing.mp3");
audioList.push("audio/Trammell Starks - Bobbys Theme.mp3");
audioList.push("audio/Trammell Starks - Broken Record.mp3");
audioList.push("audio/Trammell Starks - Crazy Pianos.mp3");
audioList.push("audio/Trammell Starks - Desert Nights.mp3");
audioList.push("audio/Trammell Starks - Here Comes The Rain.mp3");
audioList.push("audio/Trammell Starks - Im So Dizzy.mp3");
audioList.push("audio/Trammell Starks - If You Only Knew.mp3");
audioList.push("audio/Trammell Starks - Just For The Moment.mp3");
audioList.push("audio/Trammell Starks - Midnight Rain.mp3");
audioList.push("audio/Trammell Starks - Pier 32.mp3");
audioList.push("audio/Trammell Starks - Rainbeat.mp3");
audioList.push("audio/Trammell Starks - Road Trip.mp3");
audioList.push("audio/Trammell Starks - Rollercoaster Ride.mp3");
audioList.push("audio/Trammell Starks - Round And Round.mp3");
audioList.push("audio/Trammell Starks - Season On Edge.mp3");
audioList.push("audio/Trammell Starks - Slightly Blued.mp3");
audioList.push("audio/Trammell Starks - Someday.mp3");
audioList.push("audio/Trammell Starks - Something About You.mp3");
audioList.push("audio/Trammell Starks - The End.mp3");
audioList.push("audio/Trammell Starks - The Last Song.mp3");
audioList.push("audio/Trammell Starks - The Mist.mp3");
audioList.push("audio/Trammell Starks - The Only One For Me.mp3");
audioList.push("audio/Trammell Starks - Under The Influence.mp3");
audioList.push("audio/Trammell Starks - Ups And Downs.mp3");
audioList.push("audio/Trammell Starks - Water Colors.mp3");

const category = categories.join(",");
const TXT_ADDRESS_SELECTOR = "#txtAddress";
const TOGGLE_FULL_SCREEN_SELECTOR = "#ToggleFullScreen";
const TOGGLE_VOLUME_SELECTOR = "#ToggleVolume";
const BNT_GET_GPS_SELECTOR = "#btnGetGps";

const init = () => {
  document
    .querySelector(TXT_ADDRESS_SELECTOR)
    .addEventListener("focus", (e) => {
      e.target.select();
    });

  registerRefreshData(loadData);

  document
    .querySelector("#NavigateMenu")
    .addEventListener("click", btnNavigateMenuClick);
  document
    .querySelector("#NavigateRefresh")
    .addEventListener("click", btnNavigateRefreshClick);
  document
    .querySelector("#NavigateNext")
    .addEventListener("click", btnNavigateNextClick);
  document
    .querySelector("#NavigatePrevious")
    .addEventListener("click", btnNavigatePreviousClick);
  document
    .querySelector("#NavigatePlay")
    .addEventListener("click", btnNavigatePlayClick);
  document
    .querySelector(TOGGLE_FULL_SCREEN_SELECTOR)
    .addEventListener("click", btnFullScreenClick);
  document
    .querySelector(TOGGLE_VOLUME_SELECTOR)
    .addEventListener("click", btnVolumeClick);

  const audioPlayer = document
    .querySelector("#audioPlayer")
    .addEventListener("ended", () => {
      audioPlayer.src = getRandomAudio();
      audioPlayer.play();
    });

  const btnGetGps = document.querySelector(BNT_GET_GPS_SELECTOR);
  btnGetGps.addEventListener("click", btnGetGpsClick);
  if (!navigator.geolocation) btnGetGps.style.display = "none";

  document.querySelector("#divTwc").addEventListener("click", () => {
    if (document.fullscreenElement) updateFullScreenNavigate();
  });

  document
    .querySelector(TXT_ADDRESS_SELECTOR)
    .addEventListener("keydown", (key) => {
      if (key.code === "Enter") formSubmit();
    });
  document
    .querySelector("#btnGetLatLng")
    .addEventListener("click", () => formSubmit());

  document.addEventListener("keydown", documentKeydown);
  document.addEventListener("touchmove", (e) => {
    if (fullScreenOverride) e.preventDefault();
  });

  $(TXT_ADDRESS_SELECTOR).devbridgeAutocomplete({
    serviceUrl:
      "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest",
    deferRequestBy: 300,
    paramName: "text",
    params: {
      f: "json",
      countryCode: "USA", // 'USA,PRI,VIR,GUM,ASM',
      category,
      maxSuggestions: 10,
    },
    dataType: "json",
    transformResult: (response) => ({
      suggestions: response.suggestions.map((i) => ({
        value: i.text,
        data: i.magicKey,
      })),
    }),
    minChars: 3,
    showNoSuggestionNotice: true,
    noSuggestionNotice:
      "No results found. Please try a different search string.",
    onSelect(suggestion) {
      autocompleteOnSelect(suggestion, this);
    },
    width: 490,
  });

  const formSubmit = () => {
    const ac = $(TXT_ADDRESS_SELECTOR).devbridgeAutocomplete();
    if (ac.suggestions[0]) {
      $(ac.suggestionsContainer.children[0]).trigger("click");
    }
    return false;
  };

  // Auto load the previous query
  const query = localStorage.getItem("latLonQuery");
  const latLon = localStorage.getItem("latLon");
  const fromGPS = localStorage.getItem("latLonFromGPS");
  if (query && latLon && !fromGPS) {
    const txtAddress = document.querySelector(TXT_ADDRESS_SELECTOR);
    txtAddress.value = query;
    loadData(JSON.parse(latLon));
  }
  if (fromGPS) {
    btnGetGpsClick();
  }

  const play = localStorage.getItem("play");
  if (play === null || play === "true") postMessage("navButton", "play");

  document.querySelector("#btnClearQuery").addEventListener("click", () => {
    document.querySelector("#spanCity").innerHTML = "";
    document.querySelector("#spanState").innerHTML = "";
    document.querySelector("#spanStationId").innerHTML = "";
    document.querySelector("#spanRadarId").innerHTML = "";
    document.querySelector("#spanZoneId").innerHTML = "";

    document.querySelector("#chkAutoRefresh").checked = true;
    localStorage.removeItem("autoRefresh");

    localStorage.removeItem("play");
    postMessage("navButton", "play");

    localStorage.removeItem("latLonQuery");
    localStorage.removeItem("latLon");
    localStorage.removeItem("latLonFromGPS");
    document.querySelector(BNT_GET_GPS_SELECTOR).classList.remove("active");
  });

  // swipe functionality
  document
    .querySelector("#container")
    .addEventListener("swiped-left", () => swipeCallBack("left"));
  document
    .querySelector("#container")
    .addEventListener("swiped-right", () => swipeCallBack("right"));
};

const autocompleteOnSelect = async (suggestion, elem) => {
  // Do not auto get the same city twice.
  if (elem.previousSuggestionValue === suggestion.value) return;

  const data = await json(
    "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find",
    {
      data: {
        text: suggestion.value,
        magicKey: suggestion.data,
        f: "json",
      },
    }
  );

  const loc = data.locations[0];
  if (loc) {
    localStorage.removeItem("latLonFromGPS");
    document.querySelector(BNT_GET_GPS_SELECTOR).classList.remove("active");
    doRedirectToGeometry(loc.feature.geometry);
  } else {
    console.error(
      "An unexpected error occurred. Please try a different search string."
    );
  }
};

const doRedirectToGeometry = (geom, haveDataCallback) => {
  const latLon = {lat: round2(geom.y, 4), lon: round2(geom.x, 4)};
  // Save the query
  localStorage.setItem(
    "latLonQuery",
    document.querySelector(TXT_ADDRESS_SELECTOR).value
  );
  localStorage.setItem("latLon", JSON.stringify(latLon));

  // get the data
  loadData(latLon, haveDataCallback);
};

const btnFullScreenClick = () => {
  if (document.fullscreenElement) {
    exitFullscreen();
  } else {
    enterFullScreen();
  }

  if (isPlaying()) {
    noSleep(true);
  } else {
    noSleep(false);
  }

  updateFullScreenNavigate();

  return false;
};

const btnVolumeClick = () => {
  toggleAudio();

  if (isPlaying()) {
    noSleep(true);
  } else {
    noSleep(false);
  }

  updateFullScreenNavigate();

  return false;
};

const getRandomAudio = () => {
  const randomIndex = Math.floor(Math.random() * audioList.length);
  return audioList[randomIndex];
};

const toggleAudio = () => {
  if (audioPlayer.paused) {
    if (!audioPlayer.src) {
      audioPlayer.src = getRandomAudio();
    }
    audioPlayer.play();
    document.querySelector("#ToggleVolume").src =
      "images/nav/ic_volume_up_white_24dp_2x.png";
  } else {
    audioPlayer.pause();
    document.querySelector("#ToggleVolume").src =
      "images/nav/ic_volume_off_white_24dp_2x.png";
  }
};

const enterFullScreen = () => {
  const element = document.querySelector("#divTwc");

  // Supports most browsers and their versions.
  const requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullscreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element, {navigationUI: "hide"}); // https://bugs.chromium.org/p/chromium/issues/detail?id=933436#c7
  } else {
    // iOS doesn't support FullScreen API.
    window.scrollTo(0, 0);
    fullScreenOverride = true;
  }
  resize();
  updateFullScreenNavigate();

  // change hover text and image
  const img = document.querySelector(TOGGLE_FULL_SCREEN_SELECTOR);
  img.src = "images/nav/ic_fullscreen_exit_white_24dp_2x.png";
  img.title = "Exit fullscreen";
};

const exitFullscreen = () => {
  // exit full-screen

  if (fullScreenOverride) {
    fullScreenOverride = false;
  }

  if (document.exitFullscreen) {
    // Chrome 71 broke this if the user pressed F11 to enter full screen mode.
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  resize();
  // change hover text and image
  const img = document.querySelector(TOGGLE_FULL_SCREEN_SELECTOR);
  img.src = "images/nav/ic_fullscreen_white_24dp_2x.png";
  img.title = "Enter fullscreen";
};

const btnNavigateMenuClick = () => {
  postMessage("navButton", "menu");
  updateFullScreenNavigate();
  return false;
};

const loadData = (_latLon, haveDataCallback) => {
  // if latlon is provided store it locally
  if (_latLon) loadData.latLon = _latLon;
  // get the data
  const {latLon} = loadData;
  // if there's no data stop
  if (!latLon) return;

  document.querySelector(TXT_ADDRESS_SELECTOR).blur();
  stopAutoRefreshTimer();
  latLonReceived(latLon, haveDataCallback);
};

const swipeCallBack = (direction) => {
  switch (direction) {
    case "left":
      btnNavigateNextClick();
      break;

    case "right":
    default:
      btnNavigatePreviousClick();
      break;
  }
};

const btnNavigateRefreshClick = () => {
  resetStatuses();
  loadData();
  updateFullScreenNavigate();

  return false;
};

const btnNavigateNextClick = () => {
  postMessage("navButton", "next");
  updateFullScreenNavigate();

  return false;
};

const btnNavigatePreviousClick = () => {
  postMessage("navButton", "previous");
  updateFullScreenNavigate();

  return false;
};

let navigateFadeIntervalId = null;

const updateFullScreenNavigate = () => {
  document.activeElement.blur();
  const divTwcBottom = document.querySelector("#divTwcBottom");
  divTwcBottom.classList.remove("hidden");
  divTwcBottom.classList.add("visible");

  if (navigateFadeIntervalId) {
    clearTimeout(navigateFadeIntervalId);
    navigateFadeIntervalId = null;
  }

  navigateFadeIntervalId = setTimeout(() => {
    if (document.fullscreenElement) {
      divTwcBottom.classList.remove("visible");
      divTwcBottom.classList.add("hidden");
    }
  }, 2000);
};

const documentKeydown = (e) => {
  const {key} = e;

  if (document.fullscreenElement || document.activeElement === document.body) {
    switch (key) {
      case " ": // Space
        // don't scroll
        e.preventDefault();
        btnNavigatePlayClick();
        return false;

      case "ArrowRight":
      case "PageDown":
        // don't scroll
        e.preventDefault();
        btnNavigateNextClick();
        return false;

      case "ArrowLeft":
      case "PageUp":
        // don't scroll
        e.preventDefault();
        btnNavigatePreviousClick();
        return false;

      case "ArrowUp": // Home
        e.preventDefault();
        btnNavigateMenuClick();
        return false;

      case "0": // "O" Restart
        btnNavigateRefreshClick();
        return false;

      case "F":
      case "f":
        btnFullScreenClick();
        return false;

      default:
    }
  }
  return false;
};

const btnNavigatePlayClick = () => {
  postMessage("navButton", "playToggle");
  updateFullScreenNavigate();

  return false;
};

// post a message to the iframe
const postMessage = (type, myMessage = {}) => {
  navMessage({type, message: myMessage});
};

const getPosition = async () =>
  new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(resolve);
  });

const btnGetGpsClick = async () => {
  if (!navigator.geolocation) return;
  const btn = document.querySelector(BNT_GET_GPS_SELECTOR);

  // toggle first
  if (btn.classList.contains("active")) {
    btn.classList.remove("active");
    localStorage.removeItem("latLonFromGPS");
    return;
  }

  // set gps active
  btn.classList.add("active");

  // get position
  const position = await getPosition();
  const {latitude, longitude} = position.coords;

  const txtAddress = document.querySelector(TXT_ADDRESS_SELECTOR);
  txtAddress.value = `${round2(latitude, 4)}, ${round2(longitude, 4)}`;

  doRedirectToGeometry({y: latitude, x: longitude}, (point) => {
    const location = point.properties.relativeLocation.properties;
    // Save the query
    const query = `${location.city}, ${location.state}`;
    localStorage.setItem(
      "latLon",
      JSON.stringify({lat: latitude, lon: longitude})
    );
    localStorage.setItem("latLonQuery", query);
    localStorage.setItem("latLonFromGPS", true);
    txtAddress.value = `${location.city}, ${location.state}`;
  });
};
