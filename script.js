document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('checkbox');
    const body = document.body;

    // Set dark mode by default
    body.classList.add('dark');
    checkbox.checked = true;

    checkbox.addEventListener('change', () => {
        body.classList.toggle('dark');
        localStorage.setItem('darkMode', body.classList.contains('dark'));
    });

    if (localStorage.getItem('darkMode') === 'false') {
        body.classList.remove('dark');
        checkbox.checked = false;
    }

    fetch('story.json')
        .then(response => response.json())
        .then(data => {
            window.storyData = data;
            const savedNodeKey = loadProgress();
            showStoryNode(savedNodeKey);
        });

    function showStoryNode(nodeKey) {
        const node = window.storyData[nodeKey];
        const storyTextElement = document.getElementById('story-text');
        const choicesElement = document.getElementById('choices');

        storyTextElement.style.opacity = 0;
        setTimeout(() => {
            storyTextElement.innerText = node.text;
            storyTextElement.style.opacity = 1;
        }, 300);

        choicesElement.innerHTML = '';

        node.choices.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.classList.add('choice-button');
            button.addEventListener('click', () => {
                showStoryNode(choice.next);
            });
            choicesElement.appendChild(button);
        });

        saveProgress(nodeKey);
    }

    function saveProgress(nodeKey) {
        localStorage.setItem('storyProgress', nodeKey);
    }

    function loadProgress() {
        const savedNodeKey = localStorage.getItem('storyProgress');
        return savedNodeKey ? savedNodeKey : 'start';
    }

    // Load saved progress if available
    const savedNodeKey = loadProgress();
    showStoryNode(savedNodeKey);
});
