// THEME ----------

// Get user theme settings saved by the site (if they exist)
var theme = localStorage.getItem("theme");
var has_set_theme = localStorage.getItem("has_set_theme");

// Set the user's color scheme
function getColorScheme(){
    if(theme !== null){ // If user has visited prior
        document.documentElement.setAttribute("data-theme", theme);
        return;
    }

    // Check user system preference, then set accordingly
    theme = "light";
    if(prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches){
        theme = "dark";
    }
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

getColorScheme() // Run before page draws

function setNightLightMedia(media) {
    if (media.matches) {
        document.documentElement.style.setProperty("--night-light-url", `url(/img/night_light/mobile_nl_${theme}.png)`);
    } else {
        document.documentElement.style.setProperty("--night-light-url", `url(/img/night_light/nl_${theme}.png)`);
    }
}
  

// On page load, check the checkbox if the user prefers dark mode and then add a listener for the checkbox
window.onload = function applyCheck(){
    var match_media = window.matchMedia("only screen and (max-width: 1050px)");

    if(!has_set_theme){
        var fv_label = document.querySelector("#night-light + label");
        fv_label.classList.add("first_visit");
    }

    setNightLightMedia(match_media);

    var other = "dark";
    switch(theme){
        case "dark":
            document.getElementById("night-light").checked = true
            other = "light";
            break;
        default:
            break;
    }

    // Toggle dark mode via the night light
    var checkbox = document.getElementById("night-light");
    
    var v_checkbox = document.getElementById("night-light-label");

    v_checkbox.addEventListener("mousedown", night_light_down);
    v_checkbox.addEventListener("touchstart", night_light_down);
    v_checkbox.addEventListener("mouseup", night_light_up);
    v_checkbox.addEventListener("touchend", night_light_down);

    function night_light_down() {
        v_checkbox.classList.add("pulldown");
    };

    function night_light_up() {
        v_checkbox.classList.remove("pulldown");
        if(checkbox.checked){
            theme = "light";
        }
        else{
            theme = "dark";
        }
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        localStorage.setItem("has_set_theme", true);

        setNightLightMedia(match_media);
        
        if(has_set_theme){
            return;
        }

        fv_label.classList.add("theme_is_set")

    };

    match_media.addEventListener("change", function() {
        setNightLightMedia(match_media);
    });
}



// SVG ----------

function applyHeight(element){
    element.setAttribute("width", "100%");
    element.setAttribute("height", `${Math.floor(element.getBoundingClientRect().height)}px`);
}



// Hamburger Menu ----------

window.addEventListener("DOMContentLoaded", async () => {

    var hamburger = document.getElementById("hamburger"),
        frame_left = document.querySelector(".frame_left"),
        header_portfolio = document.querySelector(".header_nav_grid > li:nth-child(4)"),
        header_fold = document.querySelector(".header_portfolio_fold"),
        nl_mobile = document.getElementById("night-light-label"),
        blackout = document.getElementById("mobile-blackout");

    controlNav(hamburger.checked);

    hamburger.addEventListener("change", function() {
        controlNav(hamburger.checked);
    });

    blackout.addEventListener("click", function() {
        hamburger.checked = false;
        controlNav(hamburger.checked);
    });

    function controlNav(state){
        if(state){
            nl_mobile.classList.add("hamburger_pullout");
            frame_left.classList.add("hamburger_pullout");
            blackout.classList.add("hamburger_pullout");
            header_portfolio.classList.add("hamburger_pullout");
            header_fold.classList.add("hamburger_pullout");
        } else {
            nl_mobile.classList.remove("hamburger_pullout");
            frame_left.classList.remove("hamburger_pullout");
            blackout.classList.remove("hamburger_pullout");
            header_portfolio.classList.remove("hamburger_pullout");
            header_fold.classList.remove("hamburger_pullout");
        }
    }

});