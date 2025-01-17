document.addEventListener("DOMContentLoaded", () => {
    const inputBox = document.getElementById('inputBox');
    const outputBox = document.getElementById('outputBox');
    const submitButton = document.getElementById('submitButton');
    const clearButton = document.getElementById('clearButton');
    const audioPlayer = document.getElementById('audioPlayer');
    
async function getApiKey() {
    try {
        const response = await fetch('https://backendservertrial-052e435048ae.herokuapp.com/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const string_response = await response.text();
        console.log(string_response);
        return string_response

    } catch (error) {
        console.log("Error");
    }
}

    
    
    submitButton.addEventListener('click', getResponse)
    
    async function getResponse(){
        const userInput = inputBox.value;
        loading.style.display = 'block';

        // Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
        const apiKey = await getApiKey();
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',  //gpt-3.5-turbo
                messages: [{role: 'user', content: `Pretend to be Sylvia Plath. Respond to the User's input as her. Make your language and style match hers, highly poetic with references to her writing. Reflect on your own life empathetically in your response. Respond in 75 words or less. User input: (${userInput})`}],
                max_tokens: 100
            })
        });

        if (response.ok) {
            const data = await response.json();
            stringResponse = data.choices[0].message.content;
            getAudio(stringResponse)
            setTimeout(()=> {outputBox.value = stringResponse;}, 3500)
            setTimeout(() => {loading.style.display = 'none'}, 3500)

        } else {
            outputBox.value = `Error: ${response.statusText}`;
        }
    };

// Audio Response

async function getAudio(responseString){

    const apiKey = await getApiKey();

    const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'tts-1',
            input: responseString,
            voice: "alloy",
        })
    });
        if (!audioResponse.ok) {
            throw new Error(`Error: ${audioResponse.statusText}`);
        }

        const blob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(blob);
        audioPlayer.src = audioUrl;
        audioPlayer.play();
};


});
