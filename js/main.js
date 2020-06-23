let currentStory;

const storyText = document.getElementById("story-text");
const storyTitle = document.getElementById("story-title");
const counter = document.getElementById("counter");
const nextRandomButton = document.getElementById("next-random");
const backgroundIframe = document.getElementById("background");
const storiesURL = '/stories.json';
const body = document.body;

const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;

document.addEventListener("keydown", (event) => {
  switch(event.which) {
    case RIGHT_ARROW:
      rightArrowPressed()
      break;
    case LEFT_ARROW:
      leftArrowPressed()
      break;
    default:
      // Unregistered key press, do nothing.
  }
});

(async function () {
  try {
    const response = await fetch(storiesURL);
    if (response.status !== 200) {
      throw(`Unable to fetch stories at ${storyURL}: `, response.status)
    }
    const stories = await response.json();

    let story;

    if (window.location.hash) {
      let storyID = window.location.hash.substr(1);
      story = stories.find((story) => story.permalink == storyID);
    } else {
      story = stories[Math.floor(Math.random() * stories.length)]
    }



    window.location.hash = story.permalink;

    let sentences = story.text.split(".");
    sentences = sentences.map((x) => x.trim());
    sentences = sentences.filter((x) => x)

    currentStory = {
      sentences: sentences,
      sentence: 0,
      sentenceCount: sentences.length,
      title: story.permalink
    };

    renderStory(currentStory);

    backgroundIframe.src = `/backgrounds/${story.background}.html`

    body.classList.add("done");

  setTimeout(() => {
    storyText.classList.add("loaded");
  }, 1000)

  } catch(error) {
    console.log(error);
  } finally {
    console.log("Done");
  }
})()

function renderStory(story) {
  storyText.classList.add("start");
  setTimeout(() => {
    storyTitle.innerHTML = story.title ;
    storyText.innerHTML = story.sentences[story.sentence] + "." ;
    counter.innerHTML = (story.sentence +1) + "/" + story.sentenceCount;
    storyText.classList.remove("start");
  }, 100);
}

function rightArrowPressed() {
  if (currentStory.sentence === currentStory.sentenceCount - 1) {
    console.error("Can't go past the end of the story");
    shakeCounter();
    return;
  }

  playNextSound();
  if (currentStory.sentence === currentStory.sentenceCount - 2){
    nextRandomButton.classList.add("lightup");
  }

  currentStory.sentence += 1;
  renderStory(currentStory);
}

function leftArrowPressed() {
  if (currentStory.sentence === 0) {
    console.error("Can't go further back");
    shakeCounter();
    return;
  }

  playNextSound();
  if (currentStory.sentence < currentStory.sentenceCount ){
    nextRandomButton.classList.remove("lightup");
  }

  currentStory.sentence -= 1;
  renderStory(currentStory);
}

const nextSound = new Audio('/sfx/next.mp3');
const errorSound = new Audio('/sfx/error.mp3');

function playNextSound() {
  nextSound.volume = 0.6;
  nextSound.pause();
  nextSound.currentTime = 0;
  nextSound.play();
}

function playErrorSound() {
  errorSound.volume = 0.2;
  errorSound.pause();
  errorSound.currentTime = 0;
  errorSound.play();
}

let shakeTimeout;
function shakeCounter() {
  playErrorSound();
  counter.classList.add("shake");
  clearTimeout(shakeTimeout);

  shakeTimeout = setTimeout(() => {
    counter.classList.remove("shake");
  }, 200);
}