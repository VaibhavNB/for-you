const door = document.getElementById('door');
const openBtn = document.getElementById('openBtn');
const dogContainer = document.querySelector('.dog-container');
const speechBubble = document.querySelector('.speech-bubble');
const heartsContainer = document.getElementById('hearts');
const barkText = document.querySelector('.bark-text');
const dogImage = dogContainer.querySelector('.dog');
const barkSound = document.getElementById('barkSound');
const bgHearts = document.getElementById('bgHearts');
const nextBtn = document.getElementById('nextBtn');
const imageText = document.getElementById('imageText');
const slideContainer = document.getElementById('slideContainer');

let bgHeartInterval;
let isOpen = false;
let dogHeartInterval;
let barkTextInterval;
let barkingStarted = false;
let doorKnockInterval;

// Questions array
const questions = [
  { q: "Do you like me?", yesText: "Amel helteni natak madbyd ig 😏", noText: "Yaar ni 😅", yesResponse: "😉❤️", noResponse: "😅" },
  { q: "Do you know how much I love you?", yesText: "Ha irbek swlp 💙", noText: "Swlpu illa😆", yesResponse: "You are my everything 💙", noResponse: "Hey! 😅" },
  { q: "How about Morning's hall set plan?", yesText: "ha haa nodon anth🥰", noText: "Ninv hogirtav modl allimata 😜", yesResponse: "I knew you'd say this 💖", noResponse: "Strong full 😅" },
  { q: "Do you like this surprise?", yesText: "Pull Like athu 😍", noText: "ha ok ok 😏😜", yesResponse: "💙Nav gottalla💖", noResponse: "Sull bare 😅" },
];

let currentQ = 0;

// QA DOM
const qaContainer = document.getElementById('qaContainer');
const questionText = document.getElementById('questionText');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const responseText = document.getElementById('responseText');

// Follow-up message (below QA)
const followup = document.createElement('div');
followup.id = 'followup';
followup.style.display = 'none';
followup.style.textAlign = 'center';
followup.style.marginTop = '20px';
followup.innerHTML = `
  <p style="color:#1e90ff; font-size:1.2rem;">Still A lot more is there for you..😉 Shall I ?</p>
  <button id="followupYes" class="btn">Yes</button>
`;
qaContainer.appendChild(followup);

// Initial setup
speechBubble.textContent = "Touch Loki";
openBtn.style.display = 'none'; 
qaContainer.style.display = 'none';
slideContainer.style.display = 'none';

// Start barking
function startBarking() {
  if (barkingStarted) return;
  barkingStarted = true;

  barkSound.muted = false;
  barkSound.play().catch(()=>{});

  dogImage.classList.add('dog-jiggle');
  speechBubble.textContent = "Someone is waiting outside! Open the Door Anu";

  openBtn.style.display = 'inline-block';

  startBarkText();
  startDoorKnocking();
}

// Toggle door
function toggleDoor() {
  isOpen = !isOpen;
  door.classList.toggle('open', isOpen);
  door.classList.toggle('closed', !isOpen);

  if (isOpen) {
    // Move Loki to corner
    dogContainer.style.transition = 'transform 1.2s ease';
    dogContainer.style.transform = 'translate(0px, 0px) scale(0.9)';
    dogContainer.style.bottom = '20px';
    dogContainer.style.right = '20px';
    dogContainer.style.left = 'auto';

    speechBubble.style.opacity = 0;
    barkSound.pause();
    barkSound.currentTime = 0;
    dogImage.classList.remove('dog-jiggle');
    clearInterval(barkTextInterval);
    barkText.style.opacity = 0;

    openBtn.textContent = 'Close the door';

    dogHeartInterval = setInterval(spawnDogHearts, 400);
    startBackgroundHearts();

    const surprise = document.createElement('div');
    surprise.className = 'door-surprise';
    surprise.innerHTML = 'Hi Bangaruuu💙<span class="hug-emoji">🤗</span>';
    document.body.appendChild(surprise);
    surprise.style.animation = 'popFade 3s ease forwards';

    setTimeout(() => {
      surprise.remove();
      qaContainer.style.display = 'flex';
      showQuestion();
      // Keep cartoon man always visible
      document.querySelector('.cartoon-man').style.display = 'flex';
    }, 3000);

    clearInterval(doorKnockInterval);
  } else {
    // Reset Loki
    dogContainer.style.transition = 'all 1s ease';
    dogContainer.style.bottom = '60px';
    dogContainer.style.left = '50%';
    dogContainer.style.right = 'auto';
    dogContainer.style.transform = 'translateX(-50%) scale(1)';

    speechBubble.style.opacity = 1;
    openBtn.textContent = 'Open the door';

    barkSound.play().catch(() => {});
    dogImage.classList.add('dog-jiggle');

    clearInterval(dogHeartInterval);
    stopBackgroundHearts();

    startBarkText();
    startDoorKnocking();

    qaContainer.style.display = 'none';

    // Remove pop images and hide slide container
    const popImages = document.querySelectorAll('.pop-image');
    popImages.forEach(img => img.remove());
    slideContainer.style.display = 'none';
  }
}

// Spawn images function
function spawnImages() {
  const room = document.querySelector('.room');
  const imageSources = [
    './img/1.jpg', // Replace with your image paths
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg'
  ];
  const totalImages = imageSources.length;
  const imageWidthPercent = 15; // Approximate width of each image (150px in a 1000px stage)
  const gapPercent = 5; // Gap between images
  const totalWidthPercent = totalImages * imageWidthPercent + (totalImages - 1) * gapPercent;
  const startLeftPercent = 50 - (totalWidthPercent / 2); // Center the group horizontally

  const positions = imageSources.map((_, index) => ({
    left: `${startLeftPercent + index * (imageWidthPercent + gapPercent)}%`,
    top: '15%' // Fixed vertical position for horizontal line
  })); // Positions for a centered horizontal line

  imageSources.forEach((src, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'pop-image';
    imgContainer.style.left = '50%';
    imgContainer.style.top = '50%';
    imgContainer.style.transform = 'translate(-50%, -50%) scale(0.5)';
    imgContainer.style.opacity = '0';
    imgContainer.style.animation = 'popIn 1s ease forwards';
    imgContainer.style.animationDelay = `${index * 0.2}s`;

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Image ${index + 1}`;

    imgContainer.appendChild(img);
    room.appendChild(imgContainer);

    // After pop-in animation, move to final position and start floating
    imgContainer.addEventListener('animationend', (e) => {
      if (e.animationName === 'popIn') {
        imgContainer.style.transition = 'left 1s ease, top 1s ease';
        imgContainer.style.left = positions[index].left;
        imgContainer.style.top = positions[index].top;
        imgContainer.style.opacity = '1'; // Ensure opacity remains 1
        setTimeout(() => {
          imgContainer.style.animation = 'float 2s ease-in-out infinite alternate';
          imgContainer.style.transition = 'none';
          imgContainer.style.transform = 'translate(-50%, -50%)'; // Reset transform for float
        }, 1000);
      }
    });
  });
}

// Dog hearts
function spawnDogHearts() {
  if (!isOpen) return; 
  const heart = document.createElement('div');
  heart.className = 'dog-heart';
  const rect = dogContainer.getBoundingClientRect();
  heart.style.left = `${rect.left + rect.width/2 + (Math.random()*40-20)}px`;
  heart.style.top = `${rect.top + rect.height/4 - 20 + (Math.random()*20-10)}px`;
  heart.textContent = '💙';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1800);
}

// Bark text animation
function startBarkText() {
  clearInterval(barkTextInterval);
  barkTextInterval = setInterval(() => {
    barkText.style.animation = 'barkPop 0.8s ease forwards';
    setTimeout(() => { barkText.style.animation = 'none'; }, 800);
  }, 1200);
}

// Door knocking
function startDoorKnocking() {
  clearInterval(doorKnockInterval);
  if(isOpen) return;
  doorKnockInterval = setInterval(() => {
    if(!isOpen) {
      door.animate([
        {transform:'translateY(0)'},
        {transform:'translateY(-8px)'},
        {transform:'translateY(0)'}
      ], {duration:380, iterations:1, easing:'cubic-bezier(.2,.8,.2,1)'});

      const panels = document.querySelectorAll('.panel');
      panels.forEach((p,i) => {
        p.animate([
          {transform:'translateX(0) rotateY(0deg)'},
          {transform:`translateX(${i?6:-6}px) rotateY(${i?4:-4}deg)`},
          {transform:'translateX(0) rotateY(0deg)'}
        ], {duration:480, delay:40*i});
      });
    }
  }, 1500);
}

// Background hearts
function startBackgroundHearts() {
  clearInterval(bgHeartInterval);
  bgHeartInterval = setInterval(spawnBackgroundHeart, 800);
}
function stopBackgroundHearts() { clearInterval(bgHeartInterval); }
function spawnBackgroundHeart() {
  if (!isOpen) return; 
  const heart = document.createElement('div');
  heart.className = 'bg-heart';
  heart.textContent = Math.random() < 0.7 ? '💙' : '💖';
  const startX = Math.random() * window.innerWidth;
  heart.style.left = `${startX}px`;
  heart.style.top = `-60px`;
  const size = Math.random() * 15 + 30;
  heart.style.fontSize = `${size}px`;
  bgHearts.appendChild(heart);
  const duration = Math.random() * 5 + 10;
  requestAnimationFrame(() => {
    heart.style.transform = `translateY(${window.innerHeight + 100}px)`;
    heart.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
    heart.style.opacity = 0;
  });
  setTimeout(() => heart.remove(), duration * 1000);
}

// Q&A logic
function showQuestion() {
  const q = questions[currentQ];
  questionText.textContent = q.q;
  yesBtn.textContent = q.yesText;
  noBtn.textContent = q.noText;
  responseText.textContent = "";
  qaContainer.style.display = 'flex';
}

// Yes button for questions
yesBtn.addEventListener('click', () => {
  const q = questions[currentQ];
  responseText.textContent = q.yesResponse;
  currentQ++;
  if(currentQ < questions.length){
    setTimeout(showQuestion, 1500);
  } else {
    // Keep man visible and show follow-up
    document.querySelector('.cartoon-man').style.display = 'flex';
    followup.style.display = 'block';
  }
});

// No button move-away effect
noBtn.addEventListener('mouseenter', () => {
  const containerRect = qaContainer.getBoundingClientRect();
  const x = Math.random() * (containerRect.width - noBtn.offsetWidth);
  const y = Math.random() * (containerRect.height - noBtn.offsetHeight);
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

// Follow-up Yes button
document.addEventListener('click', e => {
  if(e.target && e.target.id === 'followupYes'){
    const man = document.querySelector('.cartoon-man');
    const qaContainer = document.getElementById('qaContainer');
    const followup = document.getElementById('followup');

    // Show man if hidden
    man.style.display = 'flex';
    man.style.position = 'absolute';
    man.style.bottom = '60px';
    man.style.left = '50%';
    man.style.transform = 'translateX(-50%)';

    // Force reflow
    man.offsetHeight;

    // Smooth slide man to left
    man.style.transition = 'transform 1.2s ease';
    man.style.transform = 'translateX(-350px)';

    // Slide/fade out QA container and follow-up
    qaContainer.style.transition = 'all 1s ease';
    followup.style.transition = 'all 1s ease';

    qaContainer.style.opacity = 0;
    followup.style.opacity = 0;
    qaContainer.style.transform = 'translateY(-50px)';
    followup.style.transform = 'translateY(-50px)';

    // Remove them from display after transition and show images/text/next
    setTimeout(() => {
      qaContainer.style.display = 'none';
      followup.style.display = 'none';

      spawnImages();
      imageText.textContent = "Nammor full cute💙\nwant to see more sweeter than this?\n😉 click next ⭐"; // Replace with your text
      slideContainer.style.display = 'flex';
      setTimeout(() => { imageText.style.opacity = 1; }, 100); // Slight delay for fade in
    }, 1000);
  }
});

// Next button handler
nextBtn.addEventListener('click', () => {
  // Remove images
  const popImages = document.querySelectorAll('.pop-image');
  popImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 1s ease';
    setTimeout(() => img.remove(), 1000);
  });

  // Hide text and next button
  imageText.style.opacity = 0;
  setTimeout(() => { slideContainer.style.display = 'none'; }, 1000);

  // Placeholder for next slide
  alert("Next slide coming soon!");
});

// Event listeners
dogContainer.addEventListener('click', startBarking);
openBtn.addEventListener('click', toggleDoor);
door.addEventListener('click', toggleDoor);
window.addEventListener('load', () => {
  if(barkingStarted && !isOpen) startDoorKnocking();
});