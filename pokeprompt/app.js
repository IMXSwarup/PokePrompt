const systemPrompt = document.querySelector("#prompt");
const gptOutput = document.querySelector("#response");
const userPrompt = document.querySelector("#prompt-input");
const submitBtn = document.querySelector("#submit-btn");
const confirmSubmitBtn = document.querySelector("#confirm-submit-btn");
const pokeball = document.querySelector(".desk-ball");
const lvlNum = document.querySelector("#level-num");
const learderboardBtn = document.querySelector(".leaderboard-btn");
const table = document.querySelector("#table");
const shareButton = document.querySelector(".desk-share");
const pokeCard = document.querySelector("#poke-card")
const sharePokeCardBtn = document.querySelector("#share-pokecard-btn");
const downloadPokeCard = document.querySelector("#download-pokecard");
const username = document.querySelector("#username")
const score = document.querySelector("#score");


const speed = 50;


let level = JSON.parse(localStorage.getItem("metadata")).level;


username.innerHTML = JSON.parse(localStorage.getItem("metadata")).User_json.username


function levelpp() {
    const metadata = JSON.parse(localStorage.getItem("metadata"));
    metadata.level += 1;
    localStorage.setItem("metadata", JSON.stringify(metadata));
}

function typeWriter(txt, i = 0) {
    if (i < txt.length) {
        gptOutput.value += txt.charAt(i);
        i++;
        setTimeout(() => typeWriter(txt, i), speed);
    }
}



function fetchSystemPrompt(url) {
    lvlNum.innerHTML = level;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            systemPrompt.value = data.sys_prompt;
        } else {
            console.error('Network response was not ok');
        }
    };

    xhr.onerror = function() {
        console.error('Error fetching data:', xhr.statusText);
    };

    xhr.send();
}





function submitPrompt(prompt = "hi") {
    const metadata = JSON.parse(localStorage.getItem("metadata"));
    const userID = JSON.parse(localStorage.getItem("responseData")).user_id;
    
    // Simulate a successful response
    const response = {
        status: "True",
        card_url: "URL_OF_POKEMON_CARD", // Replace with an actual card URL
        res: "Congratulations! You won a Pokémon!",
    };

    // Update the score and level
    metadata.level += 1;
    metadata.User_json.level[`level_${metadata.level}`] = {
        score: 15, // Set your desired score
        start_time: "HH:MM:SS DD:MM:YYYY",
    };

    // Update the local storage
    localStorage.setItem("metadata", JSON.stringify(metadata));

    // Show the response
    gptOutput.value = "";
    typeWriter(response.res);

    // If all levels completed, show the "You Win" dialog
    if (metadata.level === 4) {
        document.getElementById('dialog-you-win').showModal();
    }
    
    // If not all levels are completed, fetch the next system prompt
    if (metadata.level <= 3) {
        fetchSystemPrompt(`https://pokeprompt.bitgdsc.repl.co/default/lv_${metadata.level}`);
    }
    
    // Update the leaderboard with the new score
    fetchLeaderboard();
}


function fetchUserScoreByUserID(userID, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pokeprompt.bitgdsc.repl.co/ai-ml-game/leaderboard", true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var apiResponse = JSON.parse(xhr.responseText);
            var user = apiResponse.res.find(function(item) {
                return item.userID === userID;
            });

            if (user) {
                callback(user.score);
            } else {
                callback(null); // User not found
            }
        } else {
            console.error("Request failed with status:", xhr.status);
            callback(null); // Request failed
        }
    };

    xhr.send();
}



function fetchLeaderboard() {
    // set the user score
    fetchUserScoreByUserID(JSON.parse(localStorage.getItem("responseData")).user_id, function(score) {
        document.getElementById("score").innerHTML = score;
    })

    // Create a new XHR object
    var xhr = new XMLHttpRequest();

    // Define the URL endpoint
    var url = "https://pokeprompt.bitgdsc.repl.co/ai-ml-game/leaderboard";

    // Configure the GET request
    xhr.open("GET", url, true);

    // Set up a callback function to handle the response
    xhr.onload = function() {
        if (xhr.status === 200) {
            // If the request was successful (status code 200), log the response
            console.log(xhr.responseText);
            const api_response = JSON.parse(xhr.responseText)

            // Sort the data by 'score' property in descending order
            const sortedData = api_response.res.sort((a, b) => b.score - a.score);

            // Get the table body element
            const tableBody = document.getElementById("table");

            // Clear the existing table rows
            tableBody.innerHTML = '';

            // Iterate through the sorted data and create new table rows
            sortedData.forEach((item, index) => {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
    <td>${index + 1}</td>
    <td>${item.username}</td>
    <td>${item.score}</td>
  `;
                tableBody.appendChild(newRow);
            });
        } else {
            // If there was an error, log an error message
            console.error("Request failed with status:", xhr.status);
        }
    };

    // Send the GET request
    xhr.send();
}

fetchSystemPrompt(`https://pokeprompt.bitgdsc.repl.co/default/lv_${level}`);





confirmSubmitBtn.addEventListener("click", () => {
    submitPrompt(userPrompt.value);
})

pokeball.addEventListener("click", () => {
    document.getElementById('dialog-pikapika').showModal();
})

learderboardBtn.addEventListener("click", () => {
    document.getElementById('dialog-leaderboard').showModal();
    fetchLeaderboard();

})

submitBtn.addEventListener("click", () => {
    // alert("Are u sure to submit?")
    document.getElementById('dialog-submit-prompt').showModal();
    // submitPrompt(userPrompt.value);
})


// shareButton.addEventListener('click', event => {
//     if (navigator.share) {
//         navigator.share({
//                 title: 'GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch "Em All!"',
//                 text: 'GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch "Em All!"\n',
//                 url: 'https://bit-gdsc.github.io/PokePrompt/'
//             }).then(() => {
//                 console.log('Thanks for sharing!');
//             })
//             .catch(console.error);
//     } else {
//         // fallback
//     }
// });

function shareSocials(title, text, url) {
    if (navigator.share) {
        navigator.share({
                title: title,
                text: text,
                url: url
            }).then(() => {
                console.log('Thanks for sharing!');
            })
            .catch(console.error);
    } else {
        // fallback
    }
}


shareButton.addEventListener('click', event => {
    shareSocials("GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch 'Em All!", "GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch 'Em All!", "https://bit-gdsc.github.io/PokePrompt/")
})



sharePokeCardBtn.addEventListener('click', event => {
    shareSocials("Share PokeCard", "Look I won a Pokémon by playing PokéPrompt by GDSC-BIT\n", pokeCard.src)
});




function winPokemon(cardURL) {

    document.getElementById('dialog-win').showModal();
    pokeCard.src = cardURL;
    downloadPokeCard.href = cardURL;

    // window.open(cardURL, '_blank');


}


// winPokemon()
// submitPrompt()