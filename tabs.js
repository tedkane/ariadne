var savedTab= document.getElementById("savedTab");
var suggestTab = document.getElementById("suggestTab");


function suggestShow() {
    console.log("suggest");
    savedTab.style.display = "none";
    suggestTab.style.display = "grid";
}

function savedShow() {
    console.log("saved");
    suggestTab.style.display = "none";
    savedTab.style.display = "grid";
    
}

