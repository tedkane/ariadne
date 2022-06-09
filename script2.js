
//list of functions and the orders.
//1. gatherSuggestions(searchTerm); get's all of the data from the api and asynchronously return it to an array.
//2. wordsAPIdatasort(data): sifts through all of the words api data and puts it togeher into single array.
//3. generateSuggestions (data): sifts through all of the possible combinations to find the most relevant information.
//4. displaySuggestions(): will display all of the suggestions in the placeholder
//5. 

//const { BoxHelper } = require("three");

//google search api key: AIzaSyBmXNooJF2_4DkQppYJo_CVqu-zX6CUabA
const wordAPIoptions = {method: 'GET', headers: {'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com', 'X-RapidAPI-Key': '6cb3104d99mshc3942cfe7a278d5p19915ajsnc0adf403291a'}};
const dataMuseoptions = {method: 'GET'}
const Pinterestoptions = {method: 'GET', headers: {'X-RapidAPI-Host': 'pinterest-pin-search.p.rapidapi.com','X-RapidAPI-Key': '6cb3104d99mshc3942cfe7a278d5p19915ajsnc0adf403291a'}};







var position = -1;
//All terms is an array containing all of the searched terms and there constituent related terms
//for example: [{searchTerm: [Hello, mate] ,Suggestions: [], Words}]
//if the word is a multi word terms then the api will gather suggestions for the first two terms,
var allTerms = [];
var saved = [];
var suggestions = 0;

const form = document.querySelector('#inputForm');
const simWord = document.querySelector('#similarWord');
var elem = document.querySelector('#success');


form.addEventListener('submit', (e) =>{
        e.preventDefault();
        console.log("hello");
        e.preventDefault();    
        elem.innerHTML = "success";
        var searchTerm = form.name.value;
        position++
        getBing(searchTerm);
        
        
        //gatherSuggestions(searchTerm);
        journeySearch(searchTerm);
        //get3D(searchTerm)
        
        
        
        /*fetch(url, options)
        .then(res => res.json())
        .then(data => {console.log("hello" + data.synonyms[1]);
        let word = data.synonyms[1];
        console.log("hey"+ word);
        simWord.innerHTML = word;
    })        
        .catch(err => console.error(err));
        */
        form.name.value = '';
    })
/*
    function renderQuotes(word) {
        console.log(word)
        simWord.innerHTML = word;
        
     };
     */
//this function gathers all relevant data for any given search term!!
function gatherSuggestions(searchTerm) { 
    
    //first we gather a general suggestion from bing for the entire word and assign it to a value in the array
    
        
    getGPT3C(searchTerm);
    getGPT3S(searchTerm)
    console.log(allTerms); 
    //splits whatever the search term is into an array of strings  
    wordArray = searchTerm.split(' ');
    // now we want to loop through each word in the string and fetch the relevant values for each word by making a query 
    allTerms[position].breakdown = [];
    var wordLength = wordArray.length;
    allTerms[position].noWords = wordLength;

    let i = 0;

    
    (async () => {
        for (let i = 0; i < wordLength; i++) {
            let currentWord = wordArray[i]
            var word = {word: currentWord};
            //add the word from the term to array
            allTerms[position].breakdown.push(word);
            //get the wordAPI shit
            allTerms[position].breakdown[i].wordAPI = await getWordAPI(currentWord);
            if(i== 0){
                //allTerms[position].GPT1 = await getGPT3C(searchTerm);
                //allTerms[position].GPT2 = await getGPT3S(searchTerm);
            } 
            
            //get the data muse shit
            allTerms[position].breakdown[i].dataMuseJJA = await DatamuseJJA(currentWord); 
            allTerms[position].breakdown[i].datamuseJJB = await DatamuseJJB(currentWord);  
            allTerms[position].breakdown[i].datamuseTRG = await DatamuseTRG(currentWord); 
            
            //get all the GPT-3 stuff

            console.log(allTerms);
            if (i == (wordLength-1)){
                wordsAPIdatasort(allTerms) 
            }
            
           }} )();
    
           
}; 
async function getBing(searchTerm) {
    doCoolStuff2();   
    allTerms.push({term: searchTerm}); 
    console.log(allTerms); 
    console.log(position);

    let bingRes = await makeRequest(searchTerm);
    console.log("dataReturned")
    
    let parse = JSON.parse(bingRes);
    for(let i = 0; i< parse[1].length; i++){
        if (parse[1][i].includes(".")){
            parse[1].splice(i, 1);
        }
    }
    console.log(parse);
    allTerms[position].bing = parse;
    gatherSuggestions(searchTerm);
    return parse;
    // code below here will only execute when await makeRequest() finished loading
}


// function makeRequest(method, url) {
//     return new Promise(function (resolve, reject) {
//         let xhr = new XMLHttpRequest();
//         xhr.open(method, url);
//         xhr.onload = function () {
//             if (this.status >= 200 && this.status < 300) {
//                 resolve(xhr.response);
//             } else {
//                 reject({
//                     status: this.status,
//                     statusText: xhr.statusText
//                 });
//             }
//         };
//         xhr.onerror = function () {
//             reject({
//                 status: this.status,
//                 statusText: xhr.statusText
//             });
//         };
//         xhr.send();
//     });
// }


async function makeRequest(searchTerm){
    return new Promise(function (resolve, reject) {
    var url = "https://us-central1-ariadne-1651675220635.cloudfunctions.net/cors";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      resolve(xhr.response);
   }};
   xhr.onerror = function () {
                 reject({
                     status: this.status,
                     statusText: xhr.statusText
                 });
             };

let string = searchTerm.replace(/ /g, '%20');
var data = '{"url": "https://api.bing.com/osjson.aspx?query='+string+'"}';

xhr.send(data);
console.log(data)

});
}
//similar
async function getGPT3C(searchTerm) {
    var data = JSON.stringify({"prompt": "suggest 6 words in connection to "+searchTerm, "temperature": 1, "max_tokens": 100});
    const GPT3 = {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer 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'}, body : data};
    //returns all of the possible resutls for this word
    var url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
    const response = await fetch(url, GPT3);
    if (!response.ok){console.log("error")}
    const  wordAPIdata = await response.json()
    console.log(wordAPIdata);
    return wordAPIdata;        
}
//divergent
async function getGPT3S(searchTerm) {
    var data = JSON.stringify({"prompt": "suggest 6 words opposite to "+searchTerm, "temperature": 1, "max_tokens": 100});
    const GPT3 = {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer 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'}, body : data};
    //returns all of the possible resutls for this word
    var url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
    const response = await fetch(url, GPT3);
    if (!response.ok){console.log("error")}
    const  wordAPIdata = await response.json()
    console.log(wordAPIdata);
    return wordAPIdata;        
}





// async function getBing(bingQuery) {
//     //returns the BING search results via proxy server
//     var string = bingQuery.replace(/ /g, '%20');
//     let url = "https://api.bing.com/osjson.aspx?query="+string;
//     const bingOptions = {method: "POST", mode: "cors", headers: {"Content-Type": "application/json"}, body: {"url": "https://api.bing.com/osjson.aspx?query=yo" }}
//     let URL = "https://us-central1-ariadne-1651675220635.cloudfunctions.net/cors";
//     const response = await fetch(URL, bingOptions);
//     if (!response.ok){console.log("error")}
//     const  bingSuggestion = await response.json()
//     console.log(bingSuggestion);
//     return bingSuggestion;        
// }

async function getWordAPI(word) {
    //returns all of the possible resutls for this word
    let url = 'https://wordsapiv1.p.rapidapi.com/words/' + word;
    const response = await fetch(url, wordAPIoptions);
    if (!response.ok){console.log("error")}
    const  wordAPIdata = await response.json()
    console.log("the data;"+wordAPIdata);
    return wordAPIdata;        
}

//nouns that are often described by the adjective rel_jja
async function DatamuseJJA(word) {
    //returns all of the possible resutls for this word
    let url = "https://api.datamuse.com/words?rel_jja=" + word;
    const response = await fetch(url, dataMuseoptions);
    if (!response.ok){console.log("error")}
    const  dataMusedata = await response.json()
    console.log(dataMusedata);
    return dataMusedata;        
}
//adjectives that are often used to describe noun
async function DatamuseJJB(word) {
    //returns all of the possible resutls for this word
    let url = "https://api.datamuse.com/words?rel_jjb=" + word;
    const response = await fetch(url, dataMuseoptions);
    if (!response.ok){console.log("error")}
    const  dataMusedata = await response.json()
    console.log(dataMusedata);
    return dataMusedata;        
}
//words that are triggered by (strongly associated with) the word rel_trg
async function DatamuseTRG(word) {
    //returns all of the possible resutls for this word
    let url = "https://api.datamuse.com/words?rel_trg=" + word;
    const response = await fetch(url, dataMuseoptions);
    if (!response.ok){console.log("error")}
    const  dataMusedata = await response.json()
    console.log(dataMusedata);
    return dataMusedata;        
}
// function sortGPT3(data){
//     if ( data.indexOf(",") > -1 ){
//         console.log("comma seperated")
//         const remove = data.slice(2);
//         const GPT3data = remove.split(",");
//         console.log(GPT3data)
//         //the 
//     } else if ( data.indexOf("\n-") > -1 ){
//         console.log("\/-")
//         const remove = data.slice(2);
//         const GPT3data = remove.split("\n-");
//         console.log(GPT3data)
//         //the 
//     } else if ( data.indexOf(" 1. ") > -1 ){
//         console.log("open list")
//         const remove = data.slice(4);
//         const GPT3data = remove.split("");
//         console.log(GPT3data)

//     } else if ( data.indexOf("\n1. ") > -1 ){
//         console.log("line list")
//         var GPT3 = [];
//         var temp = data;
//         for (let i = 1; i<7; i++){
//             console.log("\n/"+i+".")
//             var GPT3 = temp.split((+i+"."), ",");
//             console.log(temp)
//         }
//         console.log(GPT3)

//     } else {
//         console.log("line serperated")
//         const remove = data.slice(2);
//         const GPT3data = remove.split("\n/");
//         console.log(GPT3data)
//     }

// }

function wordsAPIdatasort(data) {
    const wordData = data[position];
    const noWords = wordData.noWords;
    // console.log(noWords);
    // let GPT3D = allTerms[position].GPT1.choices[0].text;
    // let GPT3S = allTerms[position].GPT2.choices[0].text;
    // console.log(GPT3D);
    // console.log(GPT3S);
    // sortGPT3(GPT3D);
    // sortGPT3(GPT3S);


    //loop through eah word in the break down and print of the kind of word it is
    //make a clause here to sort this shit out
    
    (async () => {for (let i = 0; i<noWords; i++){
            //the first word
            const wordType = wordData.breakdown[i]
            if (wordData.breakdown[i].wordAPI.hasOwnProperty('results') == true){
            const noDefinitions = wordData.breakdown[i].wordAPI.results.length;
            //when the results exist
            console.log(noDefinitions);
            var synonyms = [];
            var antonyms = [];
            var similarTos = [];
            var typeOfs = [];
            var hasTypes = [];
            var typeOfs = [];
            var hasParts = [];
            var partOf = [];
            var hasCategories = [];
            

            for (let j = 0; j<noDefinitions; j++){
                let defResults = wordData.breakdown[i].wordAPI.results[j];
                let synonym = defResults.synonyms;
                let antonym = defResults.antonyms;
                let similarTo = defResults.similarTo;
                let typeOf = defResults.typeOf;
                let hasType = defResults.hasTypes;
                let hasCategorie = defResults.hasCategories;
                let hasPart = defResults.hasParts;
                let part = defResults.partOf;
                synonyms.push.apply(synonyms, synonym);
                antonyms.push.apply(antonyms, antonym);
                similarTos.push.apply(similarTos, similarTo);
                typeOfs.push.apply(typeOfs, typeOf);
                hasTypes.push.apply(hasTypes, hasType);    
                hasCategories.push.apply(hasCategories, hasCategorie);
                hasParts.push.apply(hasParts, hasPart); 
                partOf.push.apply(partOf, part);           
        }
    }
        synonyms = [...new Set(synonyms)];
        antonyms = [...new Set(antonyms)];
        similarTos = [...new Set(similarTos)];
        typeOfs = [...new Set(typeOfs)];
        hasCategories = [...new Set(hasCategories)];
        hasParts= [...new Set(hasParts)];
        partOf= [...new Set(partOf)];
        hasTypes= [...new Set(hasTypes)];
        wordData.breakdown[i].wordAPI.synonyms = synonyms;
        wordData.breakdown[i].wordAPI.antonyms = antonyms;
        wordData.breakdown[i].wordAPI.similarTos = similarTos;
        wordData.breakdown[i].wordAPI.typeOfs = typeOfs;
        wordData.breakdown[i].wordAPI.hasTypes = hasTypes;
        wordData.breakdown[i].wordAPI.hasCategories = hasCategories;
        wordData.breakdown[i].wordAPI.hasParts= hasParts;
        wordData.breakdown[i].wordAPI.partOf = partOf;
    if (wordData.breakdown[i].wordAPI.hasOwnProperty("partOfSpeech") == false) {
        console.log("YO")
        wordData.breakdown[i].wordAPI.type = "noun";
    } else {
        wordData.breakdown[i].wordAPI.type = wordData.breakdown[i].wordAPI.results[0].partOfSpeech;
    }
    
    
    }})();
    console.log("wordAPI sort")
    console.log(allTerms);
    generateSuggestions(allTerms)
}


function generateSuggestions(data) {
    const term = data[position];
    console.log("generate suggestion")
    console.log(allTerms);
    if (term.noWords<2){
        //if the word is single then and noun
        console.log("single word");
        let i = 0
        const wordType = term.breakdown[i].wordAPI.type;
        
        if (wordType == "noun"){
            const wordData = term.breakdown[i];
            var searchTerm = term.breakdown[i].word;
            term.suggestions = []
            term.suggestions.push(searchTerm)
            //first find two converging alternative pathways
            convergingNoun(wordData);
            //now find 2 diverging pathways
            divergingNoun(wordData);
            //now find a combining pathway
            combiningNoun(wordData);

    
        } else if(wordType == "adjective"){
            console.log("adjective")
            const wordData = term.breakdown[i];
            var searchTerm = term.breakdown[i].word;
            term.suggestions = []
            term.suggestions.push(searchTerm)
            //first find two converging alternative pathways
            convergingAdjective(wordData)
            //now find 2 diverging pathways
            divergingAdjective(wordData)
            //now find a combining pathway
            combiningAdjective(wordData)

        } else if(wordType == "verb"){
            console.log("verb")
            const wordData = term.breakdown[i];
            var searchTerm = term.breakdown[i].word;
            term.suggestions = []
            term.suggestions.push(searchTerm)
            //first find two converging alternative pathways
            convergingVerb(wordData)
            //now find 2 diverging pathways
            divergingVerb(wordData)
            //now find a combining pathway
            combiningVerb(wordData)

        }  else if(wordType == "adverb"){
            console.log("adverb")
            const wordData = term.breakdown[i];
            var searchTerm = term.breakdown[i].word;
            term.suggestions = []
            term.suggestions.push(searchTerm)
            //first find two converging alternative pathways
            convergingVerb(wordData)
            //now find 2 diverging pathways
            divergingVerb(wordData)
            //now find a combining pathway
            combiningVerb(wordData)

        }  else if(wordType == "conjuction"){
        console.log("adverb")
        const wordData = term.breakdown[i];
        var searchTerm = term.breakdown[i].word;
        term.suggestions = []
        term.suggestions.push(searchTerm)
        //first find two converging alternative pathways
        convergingVerb(wordData)
        //now find 2 diverging pathways
        divergingVerb(wordData)
        //now find a combining pathway
        combiningVerb(wordData)
        }
       
    } else {
        console.log("multiwords word");
        term.suggestions = []
        term.suggestions.push(term.term) 
        var converge = 0;
        var diverge = 0;
        var combining = 0;
        var adjPos = null;
        //this will loop through all of the words in the term and it find the type
        for (let i = 0; i < term.noWords; i++) { 
            const wordData = term.breakdown[i];
            const wordType = term.breakdown[i].wordAPI.type;
            if (wordType == "noun" && converge <1) {
                //perform the adjective shit     
                convergingNoun2 (wordData);
                console.log("Cnoun1") 
                converge ++;            
            } else if (wordType == "adjective" && converge <1) {
                convergingAdjective2 (wordData); 
                console.log("Cadjective1") 
                converge ++;  
            } else if (wordType == "noun" && converge <2) {
                convergingNoun2 (wordData); 
                console.log("Cnoun2") 
                converge ++;  
            } else if (wordType == "adjective" && converge <2) {
                convergingAdjective2 (wordData); 
                console.log("Cadjective1") 
                converge ++;  
            } 
        }

        for (let i = 0; i < term.noWords; i++) { 
            const wordData = term.breakdown[i];
            const wordType = term.breakdown[i].wordAPI.type;
            if (wordType == "noun" && diverge <1) {
                //perform the adjective shit
                console.log("Dnoun1")      
                divergingNoun2 (wordData); 
                diverge ++;            
            } else if (wordType == "adjective" && diverge <1) {
                divergingAdjective2 (wordData); 
                console.log("Dadjective1") 
                diverge ++;  
            } else if (wordType == "noun" && diverge <2) {
                divergingNoun2 (wordData);
                console.log("Dnoun2")  
                diverge ++;  
            } else if (wordType == "adjective" && diverge <2) {
                divergingAdjective2 (wordData); 
                console.log("Dadjective2") 
                diverge ++;  
            } 
        }

        for (let i = 0; i < term.noWords; i++) { 
            const wordData = term.breakdown[i];
            const wordType = term.breakdown[i].wordAPI.type;
            if (wordType == "noun" && combining <1) {
                //perform the adjective shit
                console.log("Conoun1")      
                combiningNoun2 (wordData); 
                combining ++;            
            } else if (wordType == "adjective" && combining <1) {
                combiningAdjective2 (wordData); 
                console.log("Coadjective1") 
                combining ++;  
            } else if (wordType == "noun" && combining <2) {
                combiningNoun2 (wordData);
                console.log("Conoun2")  
                converge ++;  
            } else if (wordType == "adjective" && combining <2) {
                combiningAdjective2 (wordData); 
                console.log("Coadjective2") 
                combining ++;  
            } else if (wordType == "verb" && combining <2) {
                combiningVerb2 (wordData); 
                console.log("Coadjective2") 
                combining ++;  
            } 
        }


        //converging suggestions
        
    }
    displaySuggestions (data) 
}


//function to implement is randomness required
//const randomElement = array[Math.floor(Math.random() * array.length)];
//CONVERGING FUNCTIONS
function convergingNoun (wordData){
    const wordInfo = wordData;
    console.log("converging")
    console.log(allTerms[position])

    var myString1 = allTerms[position].term;
    var bing = allTerms[position].bing[1];
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;

    console.log(bing)

    if (wordInfo.wordAPI.hasTypes.length > 0 && wordInfo.wordAPI.hasParts.length > 0) {
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.hasTypes[Math.floor(Math.random() * wordInfo.wordAPI.hasTypes.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.word+" "+wordInfo.wordAPI.hasParts[Math.floor(Math.random() * wordInfo.wordAPI.hasParts.length)]);//chaging for types 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.hasTypes.length > 1 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.hasTypes[Math.floor(Math.random() * wordInfo.wordAPI.hasTypes.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.hasTypes[Math.floor(Math.random() * wordInfo.wordAPI.hasTypes.length)]);//chaging synonym types 1
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.hasParts.length > 1 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.word+" "+wordInfo.wordAPI.hasParts[Math.floor(Math.random() * wordInfo.wordAPI.hasParts.length)]);//chaging for types 2
        allTerms[position].suggestions.push(word2);
        var word2 = myString2.split(oldWord2).join(wordInfo.word+" "+wordInfo.wordAPI.hasParts[Math.floor(Math.random() * wordInfo.wordAPI.hasParts.length)]);//chaging for types 2
        allTerms[position].suggestions.push(word2);
    } else if (wordInfo.wordAPI.hasTypes.length > 0 &&  wordInfo.wordAPI.synonyms.length > 0){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.hasTypes[Math.floor(Math.random() * wordInfo.wordAPI.hasTypes.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.synonyms[Math.floor(Math.random() * wordInfo.wordAPI.synonyms.length)]);//chaging synonym types 1
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.hasParts.length > 0 && wordInfo.wordAPI.synonyms.length > 0){
        var word1 = myString1.split(oldWord1).join(wordInfo.word+" "+wordInfo.wordAPI.hasParts[Math.floor(Math.random() * wordInfo.wordAPI.hasParts.length)]);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.synonyms[Math.floor(Math.random() * wordInfo.wordAPI.synonyms.length)]);//chaging synonym types 1
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.synonyms.length > 1){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.synonyms[Math.floor(Math.random() * wordInfo.wordAPI.synonyms.length)]);//chaging synonym types 1
        allTerms[position].suggestions.push(word2)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.synonyms[Math.floor(Math.random() * wordInfo.wordAPI.synonyms.length)]);//chaging synonym types 1
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.datamuseTRG.length > 0 && wordInfo.datamuseJJB.length) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.word+" "+wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.word+" "+wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)        
    } else if (wordInfo.datamuseJJB.length > 0 && wordInfo.wordAPI.synonyms.length >0) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.word+" "+wordInfo.wordAPI.synonyms[Math.floor(Math.random() * wordInfo.wordAPI.synonyms.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.word+" "+wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        
    }  else if(wordInfo.datamuseJJB.length > 0 && bing.length >0){
        var word1 = myString1.split(oldWord1).join(wordInfo.word+" "+wordInfo.wordAPI.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word2)
    }  else if(bing.length >0){
        var word1 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word2)
    
    }
}   
function convergingNoun2 (wordData){
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    console.log(myString1);
    console.log(oldWord1);
    if (wordInfo.wordAPI.hasTypes.length > 0) {
        console.log("hastypes");
        var word1 = myString1.replace(oldWord1, (wordInfo.wordAPI.hasTypes[Math.floor(Math.random() * wordInfo.wordAPI.hasTypes.length)]));//chaging for types 1
        console.log(word1);
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.wordAPI.hasParts.length > 0){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.hasParts[wordInfo.word+" "+Math.floor(Math.random() * wordInfo.wordAPI.hasParts.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.wordAPI.synonyms.has > 0){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.synonyms[Math.floor(Math.random() * wordInfo.wordAPI.synonyms.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.wordAPI.hasCategories.length > 0){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.hasCategories[wordInfo.word+" "+Math.floor(Math.random() * wordInfo.wordAPI.hasCategories.length)]);//chaging for synonyms 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.datamuseJJB.length > 0) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.word+" "+wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.datamuseTRG.length > 0) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.word+" "+wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
    }
} 

function convergingAdjective (wordData){
    var bing = allTerms[position].bing[1];
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    if (wordInfo.wordAPI.similarTos.length > 1) {
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.similarTos[Math.floor(Math.random() * wordInfo.wordAPI.similarTos.length)]);//chaging for similarTos 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.similarTos[Math.floor(Math.random() * wordInfo.wordAPI.similarTos.length)]);//chaging for similarTos 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.similarTos.length == 1){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.similarTos[Math.floor(Math.random() * wordInfo.wordAPI.similarTos.length)]);//chaging for similarTos 1
        allTerms[position].suggestions.push(word1)
    } else if(bing.length >0){
        var word1 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word2)
    
    }
}
function convergingAdjective2 (wordData){
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    if (wordInfo.wordAPI.similarTos.length > 0) {
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.similarTos[Math.floor(Math.random() * wordInfo.wordAPI.similarTos.length)]);//chaging for similarTos 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.wordAPI.similarTos.length == 1){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.similarTos[Math.floor(Math.random() * wordInfo.wordAPI.similarTos.length)]);//chaging for similarTos 1
        allTerms[position].suggestions.push(word1)
    }
}
function convergingVerb (wordData){
    var bing = allTerms[position].bing[1];
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    if (wordInfo.wordAPI.hasTypes.length > 1) {
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.hasTypes[Math.floor(Math.random() * wordInfo.wordAPI.hasTypes.length)]);//chaging for hasTypes 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.hasTypes[Math.floor(Math.random() * wordInfo.wordAPI.hasTypes.length)]);//chaging for hasTypes 2
        allTerms[position].suggestions.push(word2)
    } else if(bing.length >0){
        var word1 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word2)
    
    }
};
//DIVERGING FUNCTIONS
function divergingNoun(wordData){
    //when called this function delivers a converging  
    var bing = allTerms[position].bing[1];           
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    //first check to see if wordAPI contains type data
    
    if (wordInfo.wordAPI.antonyms.length > 0 && wordInfo.wordAPI.typeOfs.length> 0) {
        var word1 = myString1.split(oldWord1).join( wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for types 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.typeOfs.length > 1 && wordInfo.wordAPI.typeOfs.length) {
        var word1 = myString1.split(oldWord1).join( wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for types 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.typeOfs.length > 0 && wordInfo.wordAPI.partOf.length >0 ){
        var word1 = myString1.split(oldWord1).join( wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOf.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.partOf[Math.floor(Math.random() * wordInfo.wordAPI.partOf.length)]);//chaging for types 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.antonyms.length > 0 && wordInfo.datamuseJJB.length>0 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for JJB 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.datamuseTRG.length > 0 && wordInfo.datamuseJJB.length > 0 ) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseTRG.length > 1 ) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseTRG.length > 0 && wordInfo.datamuseJJB.length > 0 ) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseJJB.length > 1) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseTRG.length > 1) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if(bing.length >0){
        var word1 = bing[Math.floor(Math.random() * bing.length)].replace(oldWord1, '')
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)].replace(oldWord2, '')
        allTerms[position].suggestions.push(word2)
    }
};
function divergingNoun2(wordData){
    //when called this function delivers a converging             
    console.log("diverging")
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    console.log("diverging word"+oldWord1)
    var bing = allTerms[position].bing[1];  
    //first check to see if wordAPI contains type data
    if (wordInfo.wordAPI.typeOfs.length > 0) {
        console.log("type off")
        var word1 = myString1.split(oldWord1).join( wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for types 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.datamuseJJB.length > 0){
        var word1 = myString1.split(oldWord1).join( wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 1
        allTerms[position].suggestions.push(word1)
        console.log("no types present")
    }  else if (wordInfo.datamuseTRG.length > 0){
        var word1 = myString1.split(oldWord1).join( wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 1
        allTerms[position].suggestions.push(word1)
    } else {
        console.log("couldn't find diverging")
    }
};

function divergingAdjective (wordData){
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    var bing = allTerms[position].bing[1];  
    if (wordInfo.wordAPI.antonyms.length > 1) {
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.antonyms.length > 0 && wordInfo.datamuseJJB.length>0 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for JJB 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.datamuseTRG.length > 0 && wordInfo.datamuseJJB.length > 0 ) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseTRG.length > 1 ) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseTRG.length > 0 && wordInfo.datamuseJJB.length > 0 ) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseJJB.length > 1) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if (wordInfo.datamuseTRG.length > 1) { 
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for types 2
        allTerms[position].suggestions.push(word2)
        //this should combine the word with another
        "Bing suggestions required"
    } else if(bing.length >0){
        var word1 = bing[Math.floor(Math.random() * bing.length)].replace(oldWord1, '')
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)].replace(oldWord2, '')
        allTerms[position].suggestions.push(word2)
    }
}

function divergingAdjective2 (wordData){
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var bing = allTerms[position].bing[1];  
    if (wordInfo.wordAPI.antonyms.length > 0) {
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.datamuseJJB.length>0 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.datamuseJJB[Math.floor(Math.random() * wordInfo.datamuseJJB.length)].word);//chaging for JJB 2
        allTerms[position].suggestions.push(word1)
    } 
}

function divergingVerb (wordData){
    //when called this function delivers a converging             
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    var bing = allTerms[position].bing[1];  
    //first check to see if wordAPI contains type data
    if (wordInfo.wordAPI.antonyms.length > 1) {
        //randomyly select one or two of the types
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.wordAPI.antonyms.length > 0 && wordInfo.wordAPItypeOfs.length>0 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
    } else if(wordInfo.wordAPI.antonyms.length == 0 && wordInfo.wordAPI.typeOfs.length>1 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join(wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
    }
}
function divergingVerb2 (wordData){
    //when called this function delivers a converging             
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var bing = allTerms[position].bing[1];  
    //first check to see if wordAPI contains type data
    if (wordInfo.wordAPI.antonyms.length > 0) {
        //randomyly select one or two of the types
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.antonyms[Math.floor(Math.random() * wordInfo.wordAPI.antonyms.length)]);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1);
    } else if (wordInfo.wordAPI.typeOfs.length>0 ){
        var word1 = myString1.split(oldWord1).join(wordInfo.wordAPI.typeOfs[Math.floor(Math.random() * wordInfo.wordAPI.typeOfs.length)]);//chaging for antonyms 2
        allTerms[position].suggestions.push(word1)
    } 
    //reverting to bing
    else if(bing.length >0){
        var word1 = bing[Math.floor(Math.random() * bing.length)].replace(oldWord1, '')
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)].replace(oldWord2, '')
        allTerms[position].suggestions.push(word2)
    }
}

//COMBINING FUNCTIONS
function combiningNoun (wordData){
    var bing = allTerms[position].bing[1];  
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    JJAL = wordInfo.dataMuseJJA.length;
    JJBL = wordInfo.datamuseJJB.length;
    if (JJAL > 0 && JJBL>0) {
        var rand1 = Math.floor(Math.random() * JJAL);
        var word1 = myString1.split(oldWord1).join(wordInfo.dataMuseJJA[rand1].word +" "+ wordInfo.word);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var rand1 = Math.floor(Math.random() * JJBL);
        var word2 = myString1.split(oldWord2).join(wordInfo.datamuseJJB[rand1].word +" "+ wordInfo.word);//chaging for antonyms 1
        allTerms[position].suggestions.push(word2)

    } else if (JJBL > 0  &&  wordInfo.datamuseTRG.length >0) {
        var word1 = myString1.split(oldWord1).join( wordInfo.word+" "+ wordInfo.datamuseJJB[Math.floor(Math.random() * JJBL)].word);//chaging for antonyms 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join( wordInfo.word+" "+ wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.datamuseTRG.length >1){
        var word1 = myString1.split(oldWord1).join( wordInfo.word+" "+ wordInfo.datamuseTRG[Math.floor(Math.random() *  wordInfo.datamuseTRG.length)].word);//chaging for antonyms 2
        allTerms[position].suggestions.push(word1)
        var word2 = myString2.split(oldWord2).join( wordInfo.word+" "+ wordInfo.datamuseTRG[Math.floor(Math.random() * wordInfo.datamuseTRG.length)].word);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
    } else if(bing.length >0){
        var word1 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word1)
        var word2 = bing[Math.floor(Math.random() * bing.length)];//chaging for types 2
        allTerms[position].suggestions.push(word2)
    
    }  
}

function combiningNoun2 (wordData){
    var bing = allTerms[position].bing[1];  
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    JJAL = wordInfo.dataMuseJJA.length;
    JJBL = wordInfo.datamuseJJB.length;
    if (JJAL > 0) {
        var rand1 = Math.floor(Math.random() * JJAL);
        var word1 = myString1.split(oldWord1).join(wordInfo.dataMuseJJA[rand1].word +" "+ wordInfo.word);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)

    } else if (JJAL < 0){
    console.log("no JJA")
    }
    if (JJBL > 0) {
        var word2 = myString2.split(oldWord2).join( wordInfo.word+" "+ wordInfo.datamuseJJB[Math.floor(Math.random() * JJBL)].word);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
        } else if (JJBL < 0){
        console.log("no JJA")}
}


function combiningVerb (wordData){
    //when called this function delivers a converging 
    const wordInfo = wordData;
    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    var oldWord2 = wordInfo.word;
    JJAL = wordInfo.dataMuseJJA.length;
    JJBL = wordInfo.datamuseJJB.length;
    if (wordInfo.dataMuseJJA.length > 0) {
        var rand1 = Math.floor(Math.random() * JJAL);
        var word1 = myString1.split(oldWord1).join(wordInfo.dataMuseJJA[rand1].word +" "+ wordInfo.word);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.dataMuseJJA.length < 0){
        console.log("no JJA")
    }
    if (wordInfo.datamuseJJB.length > 0) {
        var word2 = myString2.split(oldWord2).join( wordInfo.word+" "+ wordInfo.datamuseJJB[Math.floor(Math.random() * JJBL)].word);//chaging for antonyms 2
        allTerms[position].suggestions.push(word2)
    } else if (wordInfo.datamuseJJB.length < 0){
        console.log("no JJA")}
    }

function combiningAdjective (wordData){
    //when called this function delivers a converging 
    const wordInfo = wordData;

    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    JJAL = wordInfo.dataMuseJJA.length;
    JJBL = wordInfo.datamuseJJB.length;
    if (wordInfo.dataMuseJJA.length > 1) {
        var rand1 = Math.floor(Math.random() * JJAL);
        var word1 = myString1.split(oldWord1).join(wordInfo.word +" "+ wordInfo.dataMuseJJA[rand1].word);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
        var rand2 = Math.floor(Math.random() * JJAL);
        var word2 = myString2.split(oldWord1).join( wordInfo.word+" "+ wordInfo.dataMuseJJA[rand2].word);//chaging for antonyms 1
        allTerms[position].suggestions.push(word2)

    } else if (wordInfo.dataMuseJJA.length < 0){
        console.log("no JJA")
    }
    if (wordInfo.datamuseJJB.length > 0) {
        allTerms[position].suggestions.push(wordInfo.datamuseJJB[0].word +" "+ wordInfo.word)
        console.log(allTerms);
    } else if (wordInfo.datamuseJJB.length < 0){
        console.log("no JJA")}
}
function combiningAdjective2 (wordData){
    //when called this function delivers a converging 
    const wordInfo = wordData;

    var myString1 = allTerms[position].term;
    var oldWord1 = wordInfo.word;
    var myString2 = allTerms[position].term;
    JJAL = wordInfo.dataMuseJJA.length;
    JJBL = wordInfo.datamuseJJB.length;
    if (wordInfo.dataMuseJJA.length > 1) {
        var rand1 = Math.floor(Math.random() * JJAL);
        var word1 = myString1.split(oldWord1).join(wordInfo.word +" "+ wordInfo.dataMuseJJA[rand1].word);//chaging for antonyms 1
        allTerms[position].suggestions.push(word1)
    } else if (wordInfo.dataMuseJJA.length < 0){
        console.log("no JJA")
    }
    if (wordInfo.datamuseJJB.length > 0) {
        allTerms[position].suggestions.push(wordInfo.datamuseJJB[0].word +" "+ wordInfo.word)
        console.log(allTerms);
    } else if (wordInfo.datamuseJJB.length < 0){
        console.log("no JJA")}
}

//render the info to the DOM
function displaySuggestions() {
    const suggestions = allTerms[position].suggestions;
    document.getElementById("word").classList.remove("skeleton_text", );
    document.getElementById("word").textContent = suggestions[0];
    document.getElementById("c1").classList.remove("skeleton_text" , "shine");
    document.getElementById("c1").textContent = suggestions[1];
    document.getElementById("c2").classList.remove("skeleton_text" , "shine");
    document.getElementById("c2").textContent = suggestions[2];
    document.getElementById("d1").classList.remove("skeleton_text", "shine");
    document.getElementById("d1").textContent = suggestions[3];
    document.getElementById("d2").classList.remove("skeleton_text", "shine");
    document.getElementById("d2").textContent = suggestions[4];
    document.getElementById("co1").classList.remove("skeleton_text", "shine");
    document.getElementById("co1").textContent = suggestions[5];
    document.getElementById("co2").classList.remove("skeleton_text", "shine");
    document.getElementById("co2").textContent = suggestions[6];


}

function renderImages() {  
    let c1 = ["c1Img",2];
    let c2 = ["c2Img",1];
    let d1 = ["d1Img",3];
    let d2 = ["d2Img",4];
    let co1 = ["co1Img",5];
    let co2 = ["co2Img",6];

    //render the main images into the frame
   console.log(allTerms)
   const pS = document.getElementById("pinterestSlider").checked
   const gS = document.getElementById("googleSlider").checked
   const mS = document.getElementById("modelSlider").checked
   //remove all of the placeholder images
   let parent = document.getElementById("wordImg")
   let child = document.getElementById("sPh")
   if (parent.contains(child)){
    for (let i =0; i<8; i++ ){
        //remove placeholders
        console.log(allTerms)
        document.getElementById("sPh").remove();
       } 
   } else {
        for (let i =0; i<25; i++ ){
            //remove pinterest images
            console.log(allTerms)
            document.getElementById("wordImg"+i+"p").remove();
       } 
       for (let i =0; i<10; i++ ){
        //remove google images
        console.log(allTerms)
        document.getElementById("wordImg"+i+"g").remove();
   } 
   }
   let displayP = "grid";
   let displayG = "grid";
   let display3 = "grid";
   //check to see which to render to the main search
   if (pS == false ){   
        displayP = "none"
   } 
   if (mS == false){ 
        display3 = "none";    
   } if (gS == false ){
        displayG = "none";
    
   }
   renderTogether(displayP, displayG, display3);
    
   for (let i =0; i<5; i++ ){document.getElementById("minatureImages")}
    for (let i =0; i<5; i++ ){document.getElementById("c2Ph").remove();};
    for (let i =0; i<10; i++ ){renderPreview(c2, i);};
    for (let i =0; i<5; i++ ){document.getElementById("c1Ph").remove();};
    for (let i =0; i<10; i++) {renderPreview(c1, i);};
    for (let i =0; i<5; i++ ){document.getElementById("d1Ph").remove();};
    for (let i =0; i<10; i++ ){renderPreview(d1, i);};
    for (let i =0; i<5; i++ ){document.getElementById("d2Ph").remove();};
    for (let i =0; i<10; i++) {renderPreview(d2, i);};
    for (let i =0; i<5; i++ ){document.getElementById("co1Ph").remove();};
    for (let i =0; i<10; i++ ){renderPreview(co1, i);};
    for (let i =0; i<5; i++ ){document.getElementById("co2Ph").remove();};
    for (let i =0; i<10; i++) {renderPreview(co2, i);};
};

function renderPinterest(i, displayP, imageIndex){
    //renders an image from pinterest
        let index = imageIndex[Math.floor(Math.random()*imageIndex.length)];
        console.log(imageIndex)
        console.log(index);

        var c = document.createElement("div")
        //let heightIncre = Math.ceil((images[0].image.Ne[i].height/(images[0].image.Ne[i].width/250))/10);
        //let heightIncre = 20;
        c.setAttribute("id", "wordImg"+i+"p");
        c.setAttribute("class", "card zoom-without-container sibling-hover");
        c.setAttribute('onmouseover','imgHoverP(this.id);'); 
        c.setAttribute('onmouseout','imgUnHoverP(this.id);'); 
        c.setAttribute('onclick','zoomP(this.id);'); 
        const images = allTerms[position].imagesPinterest[0];
        var x = document.createElement("IMG");
        //google Img version
        //let image = images[0].image.Ne[i].image; to create the image element
        //pinterest
        let image = images[index].image;
        var x = document.createElement("IMG");
        const height = images[index].height;
        const width = images[index].width;
        let heightIncre = Math.ceil((height/(width/250))/10);
        x.setAttribute("style", "border-radius:15px; width:240px"); 
        x.setAttribute("id", "wordImg"+i+"iP"); 
        x.setAttribute("src", image); 
        var b = document.createElement("button");
        b.setAttribute("class", "card-button sibling-highlight");
        b.textContent = 'save';
        b.setAttribute('onclick','imgClickP(this.id);');  
        var b1 = document.createElement("button");
        b1.setAttribute("class", "card-button sibling-highlight pin-count-button");
        b1.textContent = images[0].image[i].pinCount;
        b.setAttribute("id", "wordImg"+i+"bP");
        console.log(heightIncre)
        c.setAttribute("style", "grid-row-end: span " + heightIncre+"; display:"+displayP);
        document.getElementById("wordImg").appendChild(c);
        document.getElementById("wordImg"+i+"p").appendChild(x);
        document.getElementById("wordImg"+i+"p").appendChild(b);
        document.getElementById("wordImg"+i+"p").appendChild(b1);   
        
        for( var i = 0; i < imageIndex.length; i++){ 
            if ( imageIndex[i] === index) {       
                imageIndex.splice(i, 1); 
            }    
            console.log(imageIndex);    
        }   
        
        return imageIndex
}

function renderGoogle(i, displayG, imageIndex){
        let index = imageIndex[Math.floor(Math.random()*imageIndex.length)];
        //renders an image from google
        const images = allTerms[position].imagesGoogle[0];
        console.log(images)
        console.log("renderingGoog")
        console.log(allTerms)
        var x = document.createElement("IMG");
        var c = document.createElement("div")
        c.setAttribute("class", "card zoom-without-container sibling-hover");
        c.setAttribute('onmouseover','imgHoverG(this.id);'); 
        c.setAttribute('onmouseout','imgUnHoverG(this.id);'); 
        c.setAttribute("id", "wordImg"+i+"g");
        c.setAttribute('onclick','zoomG(this.id);'); 
        let heightIncre = Math.ceil((images[index].height/(images[index].width/250))/10);
        let image = images[index].image;
        x.setAttribute("style", "border-radius:15px; width:240px"); 
        x.setAttribute("id", "wordImg"+i+"iG"); 
        x.setAttribute("src", image); 
        var b = document.createElement("button");
        b.setAttribute("class", "card-button sibling-highlight");
        b.textContent = 'save';
        b.setAttribute('onclick','imgClickG(this.id);');  
        b.setAttribute("id", "wordImg"+i+"bG");
        console.log(heightIncre)
        c.setAttribute("style", "grid-row-end: span " + heightIncre+"; display:"+displayG);
        document.getElementById("wordImg").appendChild(c);
        document.getElementById("wordImg"+i+"g").appendChild(x);
        document.getElementById("wordImg"+i+"g").appendChild(b);
        for( var i = 0; i < imageIndex.length; i++){ 
            if ( imageIndex[i] === index) {       
                imageIndex.splice(i, 1); 
            }    
            console.log(imageIndex);    
        }   
        
        return imageIndex
}

function render3d(i, display3, imageIndex){
    let index = imageIndex[Math.floor(Math.random()*imageIndex.length)];
    //renders an image from google
    
    var c = document.createElement("div")
    //let heightIncre = Math.ceil((images[0].image.Ne[i].height/(images[0].image.Ne[i].width/250))/10);
    //let heightIncre = 20;
    c.setAttribute("id", "wordImg"+i+"s");
    c.setAttribute("class", "card zoom-without-container sibling-hover");
    c.setAttribute('onmouseover','imgHoverG(this.id);'); 
    c.setAttribute('onmouseout','imgUnHoverG(this.id);'); 
    c.setAttribute('onclick','zoomP(this.id);'); 
    const models = allTerms[position].models3d[0].results[index].embedUrl;
    let image = models+"?ui_infos=0&amp;ui_watermark=0&amp;ui_help=0&amp;ui_settings=0&amp;ui_inspector=0&amp;ui_annotations=0&amp;ui_stop=0&amp;ui_vr=0&amp;preload=1&amp;autostart=1&amp;ui_hint=2&amp;autospin=0.2"
    var x = document.createElement("iframe");
    let heightIncre = Math.ceil(22);
    x.setAttribute("style", "border-radius:15px; width:240px; height: 200px;"); 
    x.setAttribute("id", "wordImg"+i+"sm"); 
    x.setAttribute("src", image); 
    var b = document.createElement("button");
    b.setAttribute("class", "card-button sibling-highlight");
    b.textContent = 'save';
    b.setAttribute('onclick','imgClickS(this.id);');  
    var b1 = document.createElement("button");
    b1.setAttribute("class", "card-button sibling-highlight pin-count-button");
    b1.textContent = allTerms[position].models3d[0].results[i].likeCount;
    b.setAttribute("id", "wordImg"+i+"bS");
    console.log(heightIncre)
    c.setAttribute("style", "grid-row-end: span " + heightIncre+"; display:"+display3);
    document.getElementById("wordImg").appendChild(c);
    document.getElementById("wordImg"+i+"s").appendChild(x);
    document.getElementById("wordImg"+i+"s").appendChild(b);
    document.getElementById("wordImg"+i+"s").appendChild(b1);   
    for( var i = 0; i < imageIndex.length; i++){ 
        if ( imageIndex[i] === index) {       
            imageIndex.splice(i, 1); 
        }    
        console.log(imageIndex);    
    }   
    
    return imageIndex  
}
//add option to add notes into the board

function renderTogether (displayP, displayG, display3){
    console.log(displayP)
    console.log(displayG)
    var models = allTerms[position].models3d[0].results.length
    var indexPinterest = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    var indexGoogle = [0,1,2,3,4,5,6,7,8,9];
    var indexSketch = [0,1,2,3,4];


    for (let i = 0; i<10; i++ ){
        let k = 2*i;
        let k2 = (2*i)+1
        if(i==2){
            let i = 0;
            if (models == 0){
                "no 3d models"
            } else{
            render3d(i, display3, indexSketch);
            }
        } else if (i==2){
            let i = 1
            if (models == 0){
                "no 3d models"
            } else{
            render3d(i, display3, indexSketch);
            }
        } else if (i==5){
            let i = 2
            if (models == 0){
                "no 3d models"
            } else{
            render3d(i, display3, indexSketch);
            }
        } else if (i == 7){
            let i = 3
            if (models == 0){
                "no 3d models"
            } else{
            render3d(i, display3, indexSketch);
            }
        }
        else if (i == 9){
            let i = 4
            if (models == 0){
                "no 3d models"
            } else{
            render3d(i, display3, indexSketch);
            }
        }
        renderGoogle(i,  displayG, indexGoogle)
        renderPinterest(k, displayP, indexPinterest);
        console.log(indexPinterest)
        renderPinterest(k2, displayP, indexPinterest);
        console.log(i,k,k2, displayP, displayG, indexGoogle)
    }
    for (let i = 20; i<25; i++ ){
        renderPinterest(i, displayP, indexPinterest)
    }
    //append one google and then 2 Pinterest and then the last Pinterest
}

function renderPreview(preview,i){
    let id = preview[0];
    let ref = preview[1];
    const images = allTerms[position].imagesGoogle[ref];
    var x = document.createElement("IMG");
    x.setAttribute("id", "minatureImages");
    let image = images[i].image;
    let heightIncre = Math.ceil((images[i].height/(images[i].width/170))/10);
    console.log(heightIncre);
    var r = document.querySelector(':root');
    x.setAttribute("src", image);
    x.setAttribute("class", "card_mini zoom-without-container");
    x.setAttribute("style", "grid-row-end: span " + heightIncre)
    document.getElementById(id).appendChild(x);
    console.log(image)
}

function imgClickG(element){
    document.getElementById(element).innerHTML = "saved";
    var x = element.slice(0, -2)
    let imgUrl = document.getElementById(x+"iG").src
    let heightIncre = Math.ceil((document.getElementById(x+"iG").height)/9.5);
    console.log(heightIncre);
    saved.push(imgUrl);
    console.log(saved);
    let i = saved.length;
    var c = document.createElement("div")
    c.setAttribute("id", "savedImg"+i);
    c.setAttribute("class", "card zoom-without-container sibling-hover");
    c.setAttribute("style", "grid-row-end: span " + heightIncre);
    c.setAttribute('onmouseover','imgHoverS(this.id);'); 
    c.setAttribute('onmouseout','imgUnHoverS(this.id);'); 
    document.getElementById("savedImages").appendChild(c);
    var x = document.createElement("IMG");
    x.setAttribute("style", "border-radius:15px;"); 
    x.setAttribute("id", "savedImg"+i+"i"); 
    x.setAttribute("src", imgUrl);
    var b = document.createElement("button");
    b.setAttribute("class", "card-button sibling-highlight card-button-saved");
    b.textContent = 'delete';
    b.setAttribute("id", "savedImg"+i+"b");
    b.setAttribute('onclick','removeSaved(this.id);'); 
    document.getElementById("savedImg"+i).appendChild(x);
    document.getElementById("savedImg"+i).appendChild(b);
    closezoom();
};

function imgClickP(element){
    document.getElementById(element).innerHTML = "saved";
    var x = element.slice(0, -2)
    let imgUrl = document.getElementById(x+"iP").src
    let heightIncre = Math.ceil((document.getElementById(x+"iP").height)/9.5);
    console.log(heightIncre);
    saved.push(imgUrl);
    console.log(saved);
    let i = saved.length;
    var c = document.createElement("div")
    c.setAttribute("id", "savedImg"+i);
    c.setAttribute("class", "card zoom-without-container sibling-hover");
    c.setAttribute("style", "grid-row-end: span " + heightIncre);
    c.setAttribute('onmouseover','imgHoverS(this.id);'); 
    c.setAttribute('onmouseout','imgUnHoverS(this.id);'); 
    document.getElementById("savedImages").appendChild(c);
    var x = document.createElement("IMG");
    x.setAttribute("style", "border-radius:15px;"); 
    x.setAttribute("id", "savedImg"+i+"i"); 
    x.setAttribute("src", imgUrl);
    var b = document.createElement("button");
    b.setAttribute("class", "card-button sibling-highlight card-button-saved");
    b.textContent = 'delete';
    b.setAttribute("id", "savedImg"+i+"b");
    b.setAttribute('onclick','removeSaved(this.id);'); 
    document.getElementById("savedImg"+i).appendChild(x);
    document.getElementById("savedImg"+i).appendChild(b);
    closezoom();
};

function imgUnHoverG(x){
    console.log("un")
    let word = x.slice(0, -1)
    console.log(word)
    let buttonpress = document.getElementById(word+"bG")
    //let buttonpress1 = document.getElementById(x+"b")
    buttonpress.style.opacity = 0;
    //buttonpress1.style.opacity = 0;
};
function imgHoverG(x){
    console.log("in")
    let word = x.slice(0, -1)
    console.log(word)
    let buttonpress = document.getElementById(word+"bG")
    //let buttonpress1 = document.getElementById(x+"b")
    buttonpress.style.opacity = 1;
    //buttonpress1.style.opacity = 1;
};
function imgUnHoverP(x){
    console.log("un")
    let word = x.slice(0, -1)
    console.log(word)
    let buttonpress = document.getElementById(word+"bP")
    //let buttonpress1 = document.getElementById(x+"b")
    buttonpress.style.opacity = 0;
    //buttonpress1.style.opacity = 0;

};
function imgHoverP(x){
    console.log("in")
    let word = x.slice(0, -1)
    console.log(word)
    let buttonpress = document.getElementById(word+"bP")
    //let buttonpress1 = document.getElementById(x+"b")
    buttonpress.style.opacity = 1;
    //buttonpress1.style.opacity = 1;
};
function imgUnHoverS(x){
    console.log("un")
    let word = x
    console.log(word)
    let buttonpress = document.getElementById(word+"b")
    //let buttonpress1 = document.getElementById(x+"b")
    buttonpress.style.opacity = 0;
    //buttonpress1.style.opacity = 0;
};
function imgHoverS(x){
    console.log("in")
    let word = x
    console.log(word)
    let buttonpress = document.getElementById(word+"b")
    //let buttonpress1 = document.getElementById(x+"b")
    buttonpress.style.opacity = 1;
    //buttonpress1.style.opacity = 1;
};

let imgNeverzoom = 0;
function removeSaved(el){
    var element = el;
    const id = element.slice(0, -1)
    console.log(id)
    let savedImg = document.getElementById(id)
    savedImg.remove();
}

function zoomP(id){
    if (imgNeverzoom>0){
        document.getElementById("zoomedImage").remove()
    }
    let imageID = id.slice(0,-1)+"iP";
    let i = id.slice(7, -1)
    console.log(i)
    //get the titleID
    let title = allTerms[position].imagesPinterest[0][i].title;
    console.log(title);
    if (title == ""){
        console.log("no title")
        document.getElementById("zoomTitle").innerHTML ="untitled";

    } else{
        document.getElementById("zoomTitle").innerHTML = title;
    }
    
    let image = document.getElementById(imageID).src;
    var x = document.createElement("IMG");
    x.setAttribute("id", "zoomedImage");
    x.setAttribute("class", "imgZoom");  
    x.setAttribute("src", image); 
    document.getElementById("zoomImage").appendChild(x);
    document.getElementById("zoomSection").style.display = "block";
    document.getElementById("c1").style.zIndex = "1";
    document.getElementById("c2").style.zIndex = "1";
    document.getElementById("c2").style.zIndex = "1";
    document.getElementById("zoomClose").style.zIndex = "999999999999999";
    document.getElementById("zoomView").style.zIndex = "999999999999999";
    imgNeverzoom++;
}

function zoomG(id){
    if (imgNeverzoom>0){
        document.getElementById("zoomedImage").remove()
    }
    let imageID = id.slice(0,-1)+"iG";
    let i = id.slice(7, -1)
    console.log(i)
    //get the titleID
    let title = allTerms[position].imagesGoogle[0][i].title
    console.log(title)
    document.getElementById("zoomTitle").innerHTML = title;
    let image = document.getElementById(imageID).src;
    var x = document.createElement("IMG");
    x.setAttribute("id", "zoomedImage");
    x.setAttribute("class", "imgZoom");  
    x.setAttribute("src", image); 
    document.getElementById("zoomImage").appendChild(x);
    document.getElementById("zoomSection").style.display = "block";
    document.getElementById("c1").style.zIndex = "1";
    document.getElementById("c2").style.zIndex = "1";
    document.getElementById("zoomClose").style.zIndex = "999999999999999";
    document.getElementById("zoomView").style.zIndex = "999999999999999";
    imgNeverzoom++;
}

function closezoom(){
    document.getElementById("zoomSection").style.display = "none";
    document.getElementById("c1").style.zIndex = "99999999999999";
    document.getElementById("c2").style.zIndex =  "99999999999999";
}

function filterImages (id){
    const pS = document.getElementById("pinterestSlider").checked
    const gS = document.getElementById("googleSlider").checked
    const mS = document.getElementById("modelSlider").checked
    console.log(id);
    //add a general rule in here to not do anything unless there are images already there
    if (id == "googleSlider"){
        //decide whether to remove or add images
        console.log("add or remove google images")
        if (gS == true){
            // add any google images
            console.log("Gon")
            for (let i = 0; i<10; i++ ){
                document.getElementById("wordImg"+i+"g").style.display = "grid";
            }
        } else {
            //remove any pinterest images
            console.log("Gfalse")
            for (let i = 0; i<10; i++ ){
                document.getElementById("wordImg"+i+"g").style.display = "none";
            }

            // remove with this tag ="wordImg"+i+"g"
        }
    } else if (id =="pinterestSlider"){
        console.log("add or remove Pinterest images")
        if (pS == true){
            // add any google images
            console.log("Pon")
            for (let i = 0; i<25; i++ ){
                document.getElementById("wordImg"+i+"p").style.display = "grid";
            }
        } else {
            //remove any pinterest images
            console.log("Pfalse")
            for (let i = 0; i<25; i++ ){
                document.getElementById("wordImg"+i+"p").style.display = "none";
            }
        }
    } else if(id =="modelSlider"){
        if (mS == true){
            // add any google images
            console.log("Pon")
            for (let i = 0; i<5; i++ ){
                document.getElementById("wordImg"+i+"s").style.display = "grid";
            }
        } else {
            //remove any pinterest images
            console.log("mfalse")
            for (let i = 0; i<5; i++ ){
                document.getElementById("wordImg"+i+"s").style.display = "none";
            }
        }


    }

}

//loads the client images from the shit
function loadClient() {
    gapi.client.setApiKey("AIzaSyBmXNooJF2_4DkQppYJo_CVqu-zX6CUabA");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
}

gapi.load("client");

async function gatherImages() {
    //an array containing all the suggestions for the current think
    const suggestions = allTerms[position].suggestions;
    allTerms[position].imagesPinterest = [];
    
    var imageCollection = {term : suggestions[0]}
    allTerms[position].imagesPinterest.push(imageCollection)
    console.log(allTerms[position].imagesPinterest[0])
    allTerms[position].imagesPinterest[0] = await loadData(suggestions[0]);
    getHeight();
    allTerms[position].models3d = [];
    allTerms[position].models3d[0] = await execute3D(suggestions[0]);
    allTerms[position].imagesGoogle = [];
    (async () => {for (let i = 0; i<suggestions.length; i++){ //suggestions.length
        //loops throgh each of the sugggestions and gathers a the image url's
        const images = await execute(suggestions[i]);
        allTerms[position].imagesGoogle.push(images);
        console.log(allTerms);
        
    }})(); console.log(allTerms);}

function divLoaded(x){
    console.log()
    console.log(x.width)
    let i = x.id.slice(7, -2)
    allTerms[position].imagesPinterest[0][i].height = x.height;
    allTerms[position].imagesPinterest[0][i].width = x.width;
}

function getHeight(){
    //temporary render of the image to the dom
    for (let i =0; i<25; i++ ){
        const images = allTerms[position].imagesPinterest[0];
        var x = document.createElement("IMG");
        let image = images[i].image

        x.setAttribute("style", "border-radius:15px; display:none; width:250px"); 
        x.setAttribute("id", "wordImg"+i+"ih"); 
        x.setAttribute("src", image);
        x.setAttribute("onload", "divLoaded(this)");
        document.body.appendChild(x);
        console.log("hey")
        console.log(document.getElementById("wordImg"+0+"ih").height)
    }
}

async function execute(searchTerm) {
    return gapi.client.search.cse.list({
        "cx": "04b2d7f9c79b0491f",
      "q": searchTerm,
      "searchType": "image"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                const images = [];
                for (let i = 0; i<response.result.items.length; i++){
                    const imgLink = response.result.items[i].link;
                    const imgheight = response.result.items[i].image.height;
                    const imgwidth = response.result.items[i].image.width;
                    const imgtitle = response.result.items[i].title;
                    const imageData = {image: imgLink, height: imgheight, width: imgwidth, title: imgtitle}
                    images.push(imageData)
                    console.log(images)
                    
                }

                return images
              },
              function(err) { console.error("Execute error", err); });
    
}

async function loadData(searchTerm){
    const data = await executeP(searchTerm);
    console.log("hello");
    console.log(data);
    const images = [];
    let resultLength = data.result.results.length;
    for (let i = 0; i < resultLength; i++) {
            if (data.result.results[i].image_url == null){
            console.log(null)
        } else{
            const imgLink = data.result.results[i].image_url;
            const rePin = data.result.results[i].repin_count;
            const imgTitle = data.result.results[i].title;
            const imageData = {image: imgLink, pinCount: rePin, title: imgTitle}
            images.push(imageData)

        }
    }

    console.log(allTerms)
    return images
}

async function executeP(searchTerm) {
    
    //returns all of the possible resutls for this word
    let url = 'https://pinterest-pin-search.p.rapidapi.com/?r=search%2Fpinterest&keyword='+searchTerm+'%20cmf&offset=0';
    const response = await fetch(url, Pinterestoptions);
    if (!response.ok){console.log("error")}
    const imageData = await response.json()
    
    return imageData;      
}



window.onload = function(){
    loadClient()
    gsap.to("#convergeIcon", {duration: 0.7, scale:1.1,  repeat:-1, yoyo:true})
    gsap.to("#divergeIcon", {duration: 0.7, scale:1.1,  repeat:-1, yoyo:true})
    gsap.to("#combineIcon", {duration: 0.7, scale:1.1,  repeat:-1, yoyo:true})
    
}
// these functions allow the user to move to the next step
function c1Select(){
    const element = document.getElementById("c1");
    const id = element.id
    const newTerm = element.innerText;
    //jounreySuggest(newterm);
    console.log(newTerm)
    console.log(id)
    //render the new list item onto the dom
    journeySuggestions(newTerm, id);

    if (element.classList.contains("shine") == true){
        console.log("no elements yet")
    } else {
        position++
    }
    getBing(newTerm);
}
function c2Select(){
    const element =document.getElementById("c2");
    const newTerm = element.innerText;
    const id = element.id
    console.log(newTerm)
    journeySuggestions(newTerm, id);
    if (element.classList.contains("shine") == true){
        console.log("no elements yet")
    } else {
    
        position++
    }
    getBing(newTerm);
}
function d1Select(){
    const element = document.getElementById("d1");
    const newTerm = element.innerText;
    const id = element.id
    console.log(newTerm)
    journeySuggestions(newTerm, id);
    if (element.classList.contains("shine") == true){
        console.log("no elements yet")
    } else {
        position++
    }
    getBing(newTerm);
}
function d2Select(){
    const element =document.getElementById("d2");
    const newTerm = element.innerText;
    const id = element.id
    console.log(newTerm)
    journeySuggestions(newTerm, id);
    if (element.classList.contains("shine") == true){
        console.log("no elements yet")
    } else {
        position++
    }
    getBing(newTerm);
}
function co1Select(){
    const element =document.getElementById("co1");
    const newTerm = element.innerText;
    const id = element.id
    console.log(newTerm)
    journeySuggestions(newTerm, id);
    if (element.classList.contains("shine") == true){
        console.log("no elements yet")
    } else {
        position++
    }
    getBing(newTerm);
}
function co2Select(){
    const element =document.getElementById("co2");
    const newTerm = element.innerText;
    const id = element.id
    console.log(newTerm)
    journeySuggestions(newTerm, id);
    if (element.classList.contains("shine") == true){
        console.log("no elements yet")
    } else {
        position++
    }
    getBing(newTerm);
}


function journeySuggestions(newTerm, id){
    //element is fed into this with the id 1. take in the id tag 2. make the 6 buttons
    //journeyContent = id to append the child too
    let ids = ["c1","c2","d1","d2","co1","co2"]
    let length = 0
    for (let i = 0; i < ids.length; i++){
        let id = document.getElementById(ids[i]).innerHTML;
        if (id.length > length){
             length = id.length
        }
    }
    let buttonWidth = (length*8)+70;
    let contentWidth = (buttonWidth+50);

    console.log("length ="+length);

    for (let i = 0; i < ids.length; i++){
        if (id == ids[i]){
            ids.splice(i, 1)
        }
    }
    console.log(ids);
    console.log(newTerm)
    let i =  suggestions;

    var x = document.createElement("div")
    x.setAttribute("id", i+"suggestBox"); 
    x.setAttribute("class", "Content");
    x.setAttribute("style", "width:"+contentWidth+"px")
    x.setAttribute("onmouseleave", "shrinkbutton(this.id)");
    document.getElementById("journeyContent").insertAdjacentElement('afterbegin', x)
    //div to hold the buttons in place
    var c = document.createElement("div")
    c.setAttribute("id", i+"buttonHolder"); 
    c.setAttribute("class", "button-holder");
    
    document.getElementById(i+"suggestBox").appendChild(c);
    //main button add
    var b = document.createElement("button")
    b.setAttribute("class", "button-journey");
    b.textContent = newTerm;
    b.setAttribute("id",i+"suggestb")
    b.setAttribute("style", "z-index:9999999; width:"+buttonWidth+"px")
    b.setAttribute("onmouseenter", "expandbutton(this.id)")
    b.setAttribute("onclick", "journeyButton(this);")
    document.getElementById(i+"buttonHolder").appendChild(b);   
    //setting the main buttonnpm

    if(id == "c1" || id == "c2"){
        console.log("adding converge icon to main")
        var ic =  document.createElement("IMG");
        ic.setAttribute("src", "images/icons/convergewhite.svg")
        ic.setAttribute("class", "iconConverge")
        ic.setAttribute("id", i+"buttonIcon")
        document.getElementById(i+"suggestb").appendChild(ic);
    } else if(id == "d1" || id == "d2"){
        console.log("adding diverge icon to main")
        var ic =  document.createElement("IMG");
        ic.setAttribute("src", "images/icons/divergewhite.svg")
        ic.setAttribute("class", "iconDiverge")
        ic.setAttribute("id", i+"buttonIcon")
        document.getElementById(i+"suggestb").appendChild(ic);
    } else if(id== "co1" || id == "co2"){
        console.log("adding combine icon to main")
        var ic =  document.createElement("IMG");
        ic.setAttribute("src", "images/icons/combinewhite.svg")
        ic.setAttribute("class", "iconCombine")
        ic.setAttribute("id", i+"buttonIcon")
        document.getElementById(i+"suggestb").appendChild(ic);
    }

    if (i > 0){
        var img = document.createElement("IMG")
        img.setAttribute("id", i+"suggestarr")
        img.setAttribute("onclick", "shrinkbutton(this.id)")
        img.setAttribute("class", "arrow-journey");
        img.setAttribute("src", "images/icons/right arroq.svg")
        document.getElementById(i+"suggestBox").appendChild(img);
    }

    //this section here will make the relevant documents for each of the parts
    for (let j = 0; j < ids.length; j++){

        if(ids[j] == "c1" || ids[j] == "c2"){
            console.log("j"+j)
            var b = document.createElement("button")
            b.setAttribute("class", "button-journey");
            b.textContent = document.getElementById(ids[j]).innerText;
            b.setAttribute("id",i+"suggestb"+j)
            b.setAttribute("onclick", "journeyButton(this);")
            document.getElementById(i+"buttonHolder").appendChild(b);
            if(j==0){
                b.setAttribute("style","top:6px;z-index:9999998; width:"+buttonWidth+"px")
            } else if (j==1){
                b.setAttribute("style","top:12px; z-index:9999997; width:"+buttonWidth+"px")
            }
            
            console.log("converge icon create")
            var icon =  document.createElement("IMG");
            icon.setAttribute("src", "images/icons/convergewhite.svg")
            icon.setAttribute("class", "iconConverge")
            icon.setAttribute("id", i+"buttonIcon"+j)
            document.getElementById(i+"suggestb"+j).appendChild(icon);
        }
        if(ids[j] == "d1" || ids[j] == "d2"){
            console.log("j"+j)
            var icon =  document.createElement("IMG");
            var b = document.createElement("button")
            b.setAttribute("class", "button-journey");
            b.textContent = document.getElementById(ids[j]).innerText;
            b.setAttribute("id",i+"suggestb"+j)
            b.setAttribute("style","z-index:9999993; width:"+buttonWidth+"px");
            b.setAttribute("onclick", "journeyButton(this);")
            if(j==0){
                b.setAttribute("style", "top:6px;z-index:9999998; width:"+buttonWidth+"px")
            } else if (j==1){
                b.setAttribute("style", "top:12px; z-index:9999997; width:"+buttonWidth+"px")
            }
            
            document.getElementById(i+"buttonHolder").appendChild(b);

            icon.setAttribute("src", "images/icons/divergewhite.svg")
            icon.setAttribute("class", "iconDiverge")
            icon.setAttribute("id", i+"buttonIcon"+j)
            document.getElementById(i+"suggestb"+j).appendChild(icon);
            console.log("diverge icon create")
        }
        if(ids[j] == "co1" || ids[j] == "co2"){
            console.log("combinebutton")
            console.log("j"+j)
            var b = document.createElement("button")
            b.setAttribute("class", "button-journey");
            b.textContent = document.getElementById(ids[j]).innerText;
            b.setAttribute("id",i+"suggestb"+j)
            b.setAttribute("onclick", "journeyButton(this);")
            b.setAttribute("style", "z-index:9999994; width:"+buttonWidth+"px")
            document.getElementById(i+"buttonHolder").appendChild(b);

            var icon =  document.createElement("IMG");
            icon.setAttribute("src", "images/icons/combinewhite.svg")
            icon.setAttribute("class", "iconCombine")
            icon.setAttribute("id", i+"buttonIcon"+j)
            document.getElementById(i+"suggestb"+j).appendChild(icon);
            console.log("combine icon create")
        }
    }
    removewhite()
    suggestions++
    
}

function journeySearch(searchTerm){
    //list of the id's containing the sick
    let i =  suggestions;
    var x = document.createElement("div")
    let length = searchTerm.length;
    let buttonWidth = (length*8)+70;
    let contentWidth = (buttonWidth+50);

    console.log("length ="+length);
    console.log(searchTerm)
    x.setAttribute("id", i+"suggestBox"); 
    x.setAttribute("class", "Content");
    x.setAttribute("style", "width:"+contentWidth+"px");
    document.getElementById("journeyContent").insertAdjacentElement('afterbegin', x)
    //div to hold the buttons in place
    var c = document.createElement("div")
    c.setAttribute("id", i+"buttonHolder"); 
    c.setAttribute("class", "button-holder");
    document.getElementById(i+"suggestBox").appendChild(c);
    //main button add
    var b = document.createElement("button")
    b.setAttribute("class", "button-journey");
    b.textContent = searchTerm;
    b.setAttribute("id",i+"suggestb")
    b.setAttribute("style", "width:"+buttonWidth+"px");
    b.setAttribute("onclick", "journeyButton(this);")
    document.getElementById(i+"buttonHolder").appendChild(b);
    var icon =  document.createElement("IMG");
    icon.setAttribute("src", "images/icons/searchIconwhite.svg")
    icon.setAttribute("class", "iconSearch")
    icon.setAttribute("id", i+"buttonIcon")
    document.getElementById(i+"suggestb").appendChild(icon);

    if (i > 0){
        var img = document.createElement("IMG")
        img.setAttribute("class", "arrow-journey");
        img.setAttribute("src", "images/icons/right arroq.svg")
        document.getElementById(i+"suggestBox").appendChild(img);


    }
    //button that is appened when you search for a feature
    removewhite()
    suggestions++

}

function removewhite(){
    console.log(suggestions)
    let i = (suggestions+1) -1;
    console.log("remove"+i)
    let mainB = document.getElementById((i-1)+"suggestb")
    let icon = document.getElementById((i-1)+"buttonIcon")
    if (i>0){
        mainB.style.backgroundColor = "#fafafa";
        mainB.style.color = "#83adb3";

        if (icon.classList.contains("iconSearch") == true){
            icon.src = "images/icons/searchgreen.svg"
            console.log("icon below")
            console.log(icon)
        }  
        if(icon.classList.contains("iconConverge")){
            console.log("this contained a converge")
            icon.src = "images/icons/convergegreen.svg"
        }  
        if(icon.classList.contains("iconDiverge")){
            console.log("this contained a converge")
            icon.src = "images/icons/divergegreen.svg"
        }  
        if(icon.classList.contains("iconCombine")){
            console.log("this contained a converge")
            icon.src = "images/icons/combinegreen.svg"
        } 
        if (icon.classList.contains("iconConverge") || icon.classList.contains("iconDiverge") || icon.classList.contains("iconCombine")){
            console.log("i contain a more complex kind of logo and need to be iterated")
            for(let j = 0; j<5; j++){
                let subButton = document.getElementById((i-1)+"suggestb"+j)
                subButton.style.backgroundColor = "#fafafa";
                subButton.style.color = "#83adb3"; 
                let subicon = document.getElementById((i-1)+"buttonIcon"+j)
                if(subicon.classList.contains("iconConverge")){
                    console.log("this contained a converge")
                    subicon.src = "images/icons/convergegreen.svg"
                }  
                if(subicon.classList.contains("iconDiverge")){
                    console.log("this contained a converge")
                    subicon.src = "images/icons/divergegreen.svg"
                }  
                if(subicon.classList.contains("iconCombine")){
                    console.log("this contained a converge")
                    subicon.src = "images/icons/combinegreen.svg"
                } 
            }
        } 
    }



//     if (i>0){
//     if(icon.classList.contains("iconConverge")){
//         console.log("this contained a converge")
//         icon.src = "images/icons/convergegreen.svg"
//     }
// }
}

function journeyButton(x){
    let newTerm = x.innerText;
    position++
    getBing(newTerm)
}











//fucntions to update progress the refinment.



/*function getBing (bingQuery) {
    const bingOptions = {
        method: 'GET',

    }
    //this will enventually return the bing to be done later
    let url = "https://cors-anywhere.herokuapp.com/https://api.bing.com/osjson.aspx?query=" + bingQuery;
    fetch(url, bingOptions)
        .then(response => response.json())
        .then(data => console.log(data));
    var bingSuggestion = "the suggestion from bing";
    return bingSuggestion;
    
}



rendering the images the too the dom


var x = document.createElement("IMG");
                    let image = response.result.items[i].link;
                    x.setAttribute("src", image);
                    x.setAttribute("width", "304");            
                    document.body.appendChild(x);
                    console.log(response.result.items[i].link)
                 
                      
                       i++;
*/

//shit to do tmrw-
/*
1. Integrate the Pinterest into the search suggestions.
3. Improve the UI.
4. Develop the selections so they are appropriate for all different kinds of terms including multi terms. MOST IMPORTANT
5. gpt-3 integration.
6. Saving the images enabled and able to have multiple thing added at a time basically a map of where the user has been displayed. through a burger menu pop out.
7. Possibly ideate a layout style with a 4 direction vector.
8. Think about migration to 3d.*/

//when a work is clicked that word needs to be assigned as the new word has to go into the search sectio

//gasp shit

async function execute3D() {
    var st = allTerms[position].term;
    var string = st.replace(/ /g, '%20');
    console.log(string)
    //returns all of the possible resutls for this word
    let url = "https://api.sketchfab.com/v3/search?type=models&q="+string+"&archives_flavours=false";
    const response = await fetch(url, dataMuseoptions);
    if (!response.ok){console.log("error")}
    const  data3D = await response.json()
    console.log(data3D);
    console.log(data3D.results)
    return data3D;        
}

async function get3D(searchTerm){
    const data = await execute3D();
    console.log("hello");
    console.log(data);
    const images = [];
    let resultLength = data.results.length;
    for (let i = 0; i < resultLength; i++) {
            if (data.results[i].embedUrl == null){
            console.log(null)
        } else{
            const embed3d = data.results[i].embedUrl;
            const name3d = data.results[i].named;
            const likes3d = data.results[i].likeCount;
            const imageData = {embed: embed3d, likes: likes3d, name: name3d}
            images.push(imageData)

        }
    }
    console.log(allTerms)
    return images
}

//<iframe id="view360Iframe" width="100%" scrolling="0" src="https://sketchfab.com/models/29c76ea294264212b0598f358fbce111/embed?ui_infos=0&amp;ui_watermark=0&amp;ui_help=0&amp;ui_settings=0&amp;ui_inspector=0&amp;ui_annotations=0&amp;ui_stop=0&amp;ui_vr=0&amp;preload=1&amp;autostart=1&amp;ui_hint=2&amp;autospin=0.2"></iframe>