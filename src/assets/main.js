import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType } from '@capacitor/camera';

let timeElement = document.getElementById("time");
let today = document.getElementById("todayButton");
let newEvent = document.getElementById("NewEventButton");
let calendar = document.getElementById("calendarButton");
let startTime = document.getElementById("StartTime");
let endTime = document.getElementById("EndTime");
let eventName = document.getElementById("EventName");
let takePIC = document.getElementById("pic")
let now = new Date();
let calendarVisible = false;
let events = [];

window.onload = async (event) => {
  let loadedJSON = await getData("event");
  console.log(JSON.parse(loadedJSON));
  events = JSON.parse(loadedJSON) || [];
};

const setData = async (key, data) => {
  await Preferences.set({
    key,
    value: data
  });
  console.log("Data saved: ", data);
};

const getData = async (key) => {
  const { value } = await Preferences.get({ key });
  return value;
};
const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
  
    var imageUrl = image.webPath;
    return imageUrl
};
class Event {
  constructor(name, start, end) {
    this.name = name;
    this.startTime = start;
    this.endTime = end;
    this.created = false;
  }
}

function createEventLayout(event) {
  var eventDiv = document.createElement("div");
  eventDiv.classList.add("event");
  var titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  var titleHeading = document.createElement("h4");
  titleHeading.textContent = event.name;
  titleDiv.appendChild(titleHeading);
  eventDiv.appendChild(titleDiv);
  var startDiv = document.createElement("div");
  startDiv.classList.add("start");
  var startTimeHeading = document.createElement("h5");
  startTimeHeading.textContent = event.startTime;
  var startPara = document.createElement("p");
  startPara.textContent = "Start";
  startDiv.appendChild(startTimeHeading);
  startDiv.appendChild(startPara);
  eventDiv.appendChild(startDiv);
  var endDiv = document.createElement("div");
  endDiv.classList.add("end");
  var endTimeHeading = document.createElement("h5");
  endTimeHeading.textContent = event.endTime;
  var endPara = document.createElement("p");
  endPara.textContent = "End";
  endDiv.appendChild(endTimeHeading);
  endDiv.appendChild(endPara);
  eventDiv.appendChild(endDiv);
  return eventDiv;
}

calendar.addEventListener("click", function() {
  console.log("click");
  calendarVisible = !calendarVisible;
  if (calendarVisible) {
    document.getElementById("tasks").style.zIndex = 6;
    document.getElementById("calendarMenu").style.zIndex = 7;
  } else {
    document.getElementById("tasks").style.zIndex = 7;
    document.getElementById("calendarMenu").style.zIndex = 6;
  }
});

newEvent.addEventListener("click", function() {
  document.getElementById("newEventTab").style.visibility = "visible";
});
takePIC.addEventListener("click", async function() {
    let pic = await takePicture();
    document.getElementById("photo").setAttribute("src", pic);
});


document.getElementById("SubmitButton").addEventListener("click", async function() {
  events.push(new Event(eventName.value, startTime.value, endTime.value));
  document.getElementById("newEventTab").style.visibility = "hidden";
  console.log(events);
  let stringedEvents = JSON.stringify(events);
  console.log(stringedEvents);
  await setData("event", stringedEvents);
});

today.addEventListener("click", function() {
  document.getElementById("tasks").classList.toggle("move-up");
  document.querySelector("h2").classList.toggle("hidden");
});

document.getElementById("clearData").addEventListener("click", async function() {
  await Preferences.remove({ key: "event" });
});

function loop() {
  let currentHours = now.getHours();
  let currentMinutes = now.getMinutes();
  let formattedHours = currentHours < 10 ? "0" + currentHours : currentHours;
  let formattedMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
  let currentTime = formattedHours + ":" + formattedMinutes;
  timeElement.textContent = currentTime;
  console.log(currentTime)
  for (let i = 0; i < events.length; i++) {
    if (events[i].created === false) {
      var eventLayout = createEventLayout(events[i]);
      document.getElementById("eventContainer").appendChild(eventLayout);
      events[i].created = true;
    }
  }
  requestAnimationFrame(loop);
}
loop();
