let jc = document.querySelector("#judgechart_title")

async function saveOptions(q) {
    q.preventDefault();
    let settings = {}
    Array.from(document.querySelectorAll(`input[type="checkbox"]`)).forEach(e => {
        localStorage.setItem(e.getAttribute('id'), e.checked)
        storage.local.set(e.getAttribute('id'), e.checked)
        settings[e.getAttribute('id')] = e.checked
    })
    console.log(settings)
    // localstorage. {} everything is bool; object keys are checkbox elem ids
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function elementExists(id) {
    return (document.querySelector("#"+id)) ? true : false
}

function restoreOptions() {
    console.log(localStorage)
    for(i in localStorage) {
        if(elementExists(i)) { // is a settings key
            // console.log(localStorage[i])
            console.log(document.querySelector("#"+key))
            console.log("localstorage says "+localStorage.getItem(key))
            document.querySelector("#"+key).checked = (localStorage.getItem(key) === "true") ? true : false;
        }
    }
    // retrieve from localstorage
}

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.length === 0) {
        console.log("all reset")
        Array.from(document.querySelectorAll(`input[type="checkbox"]`)).forEach(e => {
            localStorage.setItem(e.getAttribute('id'), true) // default on
        })
    }
    restoreOptions()
});
document.querySelector("form").addEventListener("submit", saveOptions);
