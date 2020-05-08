(async function () {
  const storyText = document.getElementById("story-text");
  const backgroundIframe = document.getElementById("background");
  const storiesURL = '/stories.json';
  const body = document.body;

  try {
    const response = await fetch(storiesURL);
    if (response.status !== 200) {
      throw(`Unable to fetch stories at ${storyURL}: `, response.status)
    }
    const stories = await response.json();

    const randomStory = stories[Math.floor(Math.random() * stories.length)]

    storyText.innerHTML = randomStory.text;

    backgroundIframe.src = `/backgrounds/${randomStory.background}.html`

    body.classList.add("done");

  } catch(error) {
    console.log(error);
  } finally {
    console.log("Done");
  }
})()