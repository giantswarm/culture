let currentStory = {
  text: "",
  page: "",
  totalPages: ""
};

const storyText = document.getElementById("story-text");
const counter = document.getElementById("counter");
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

    const randomStory = stories[Math.floor(Math.random() * stories.length)]

    let sentences = randomStory.text.split(".");
    sentences = sentences.map((x) => x.trim());
    sentences = sentences.filter((x) => x)

    currentStory = {
      sentences: sentences,
      sentence: 0,
      sentenceCount: sentences.length
    };

    renderStory(currentStory);

    backgroundIframe.src = `/backgrounds/${randomStory.background}.html`

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

  currentStory.sentence += 1;
  renderStory(currentStory);
}

function leftArrowPressed() {
  if (currentStory.sentence === 0) {
    console.error("Can't go further back");
    shakeCounter();
    return;
  }

  currentStory.sentence -= 1;
  renderStory(currentStory);
}

let shakeTimeout;

function shakeCounter() {
    counter.classList.add("shake");
    clearTimeout(shakeTimeout);

    shakeTimeout = setTimeout(() => {
      counter.classList.remove("shake");
    }, 200);
}