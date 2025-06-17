/* 
TODO
[x] spacebar focuses school search box
    [x] tabroom.com/register/index.mhtml is the school input page; /register/school/edit.mhtml needs it as well
    [x] and register/entry/edit.mhtml. need to get all the pages with that school search bar. is it just /register/ ??
    [ ] make only single spacebar instead of double
[x] copy email to clipboard instead of mailto addr
    [ ] should i add a ?err= or a ?msg= for this?
[ ] don't focus school name field when scrubbing through (steals focus from spacebar nav to next school)
  - when does this happen
[x] make judge chart readble at narrower widths (macos side shunt)
[x] id of span .dragme.statusbox in status overview is event_id. make title link to schemat
[x] .entrycodes.identities width 100% — Make Speaker Codes Visible Again
[x] judge chart title is Judge Chart
[x] decrease school code width on judge chart
[ ] turn on/off more Features (not visual fixes maybe) in the menu. google.com How to Persist Data Across Extension Firefox
  [x] stupid
[x] clicking Tabbing tab defaults to status
[x] codes to watch in pairings


official feature list:
spacebar focuses school search box
copy mailto:email to clipboard
link to event/round schemats in Tab Status screen
competitor codes shouldn't be squished
judge chart:
    tab title is Judge Chart
    more readable in narrow windows
    school code takes up an appropriate amount of space
defaults on top tabs (can still mouseover and select tho ofc)    
    entries tab defaults to schools
    tabbing tab defaults to status




*/
console.log("\"Tabroom improved\" extension init")

browser.runtime.onMessage.addListener((request) => {
    console.log(request.please)
    return Promise.resolve({response:"hello"})
})

// alertify.message() are the little ones from ?err= and ?msg=. alert() is the big modal box

const sansTabroomcom = /(https?)?(\:\/\/)?(www.)?tabroom.com/
const stringlocation = window.location.toString()
const clickEvent = new Event("click")

// "SPACEBAR FOCUSES SEARCH BOX"

let spacebarlocations = ["/register/index.mhtml", "/register/school/edit.mhtml", "/register/school/entries.mhtml", "/register/school/judges.mhtml",
    "/register/school/invoice.mhtml", "/register/school/followers.mhtml", "/register/school/notes.mhtml"
] // all locations where hitting space should focus the school search box
// currently this is two hits of the spacebar which is okay. i'd prefer it be a single one but what the hell.
// its doing that because i'm just focusing the bar and then hitting spacebar does it through firefox anyways. the dispatchevent doesn't even work.
if(spacebarlocations.includes(stringlocation.replace(sansTabroomcom, "").split("?")[0])) {
    console.log("spacebar page")
    window.addEventListener("keydown", key => {
        if(key.code === "Space") {
            let typeatr = document.activeElement.getAttribute("type")
            if (document.activeElement.tagName.toLowerCase() == "input" && (typeatr == "text" | typeatr == "search")) {
                console.log('active elemtn is text prompt; not changing focus')
                return;
            } else {
                let click = new Event("keydown", {})
                let cb = document.querySelector(`span.select2-selection`)
                cb.focus()
                cb.dispatchEvent(click)
                key.preventDefault()
            }
        }
    })
}

// JUDGE CHART

if(stringlocation.includes("/panel/judge/chart.mhtml")) {

    // "JUDGE CHART READABLE IN NARROW WINDOWS"
    window.addEventListener("resize", () => { // a responsive web design ya
        if(window.innerWidth < 800) {
            newwidth = "100%"

            // "DECREASE SCHOOL CODE WIDTH"
            Array.from(document.querySelectorAll("th.tablesorter-header")).forEach(e => {
                if(e.innerText.includes("School")) {
                    e.style.width = "8%" // this is the width I found to be good. possible issue tho
                }
            })
        } else {
            newwidth = "33.3%" // default
        }
        Array.from(document.querySelectorAll(".flexrow.wrap > span")).forEach(e => e.style.width = newwidth)
    })

    // "JUDGE CHART TITLE IS JUDGE CHART"
    document.title = "Judge Chart"
}

// "COMPETITOR CODES SHOULDN'T BE SQUISHED"

if(stringlocation.includes("/panel/schemat/show.mhtml")) { // event / round schemat. for widening speaker codes
    Array.from(document.querySelectorAll(".entrycodes.identities")).forEach(e => e.style.width = "100%")
}

// "LINK TO EVENT SCHEMAT IN STATUS SCREEN"

if(stringlocation.includes("/tabbing/status/dashboard.mhtml")) {
    Array.from(document.querySelectorAll("span.centeralign.nospace > h5.centeralign")).forEach(e => {
        // looks ugly with text decoration underline. how else can i communicate that it's a link?
        // e.innerText = e.innerText + "⤴"
        // e.innerText = e.innerText + "☍"
        // e.innerText = e.innerText + "↗"
        // these are all ugly

        // wrap a around existing h5
        e.outerHTML = `<a href="https://tabroom.com/panel/schemat/show.mhtml?event_id=${e.getAttribute('id').replace("_eventName", "")}">${e.outerHTML}</a>`
    })
}

// "COPY EMAIL TO CLIPBOARD"

Array.from(document.querySelectorAll("a")).forEach(e => {
    if(e.href.includes("mailto:")) {
        e.addEventListener("click", event => { // bro uses mousedown everywhere. is Click bad or is it typical tabroom behavior
            navigator.clipboard.writeText(e.href.replace("mailto:", ""))
            console.log(e.href.replace("mailto:", ""))
            let orig = e.innerText
            e.innerText = "Copied!"
            setTimeout(() => e.innerText = orig, 1000)
            event.preventDefault()
        })
    }
})

// "CLICKING ENTRIES TAB DEFAULTS TO SCHOOLS"

let entries = document.querySelectorAll("li.top")[1] // Entries
let link = entries.querySelector("ul.sub>li>a") // Schools is is first one anyway
entries.addEventListener("mousedown", () => {
    // link.dispatchEvent(clickEvent) // am i forgetting how to do this or does everything on here not respond to synthetic events
    window.location.href = link.getAttribute("href")
})

// "CLICKING TABBING TAB DEFAULTS TO STATUS"

let tab = document.querySelectorAll("li.top")[4] // Tabbing
let tablink = tab.querySelectorAll("ul.sub>li>a")[1] // status is is first one anyway
tab.addEventListener("mousedown", () => {
    // link.dispatchEvent(clickEvent) // am i forgetting how to do this or does everything on here not respond to synthetic events
    window.location.href = tablink.getAttribute("href")
})

// codes to watch in pairings

const codematch = /(\d{3,4})/g // what are code specs? max 5???
if(stringlocation.includes("/tourn/postings/round.mhtml")) {
    function searchContent(content) {
        let table = document.querySelector('tbody')
        Array.from(table.children).forEach(e => {
            let match = content.match(codematch)
            if (match.includes(e.children[2].innerText) || match.includes(e.children[3].innerText)) {
                table.insertBefore(e, table.firstChild)
            }
        })
    }
    let saved = localStorage.getItem("watchcodes")
    if(saved.length > 0) { searchContent(saved) }
    document.querySelector("div.nospace.flexrow > span.half").innerHTML += `<div><span>Search space-separated codes </span><input type="text" id="tabext-search"></div>`
    let search = document.getElementById("tabext-search")
    if(saved.length > 0) { search.value = saved }
    // search.style.width = "100px !important" // these straight up are Not working
    // search.style.display = "inline"
    // me when swift guard let
    search.addEventListener("input", () => {
        let content = search.value
        searchContent(content)
    })
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("watchcodes", search.value)
    })
    // would be nice if this worked
    document.addEventListener("input", e => {
        if (e.code === "Tab") {
            search.focus()
        }
    })
}