// --- Core stuff ---

const paginationNumbers = document.getElementById("pagination-numbers");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-submit");
const searchGlass = document.getElementById("svg-search-glass");

const paginatedList = document.getElementById("paginated-list");
const paginationLimit = 8;
var pageCount = 1;
var currentPage = 1;

var listItems;
var start_data = {};

// --- JSON and layout ---

// Create portfolio list item
const createPortfolioItem = (link, title, subtitle) => {
    var li = document.createElement("li");

    sub = ""
    if(subtitle){
        sub = `
        <h3>${subtitle}</h3>`
    }

    li.innerHTML = `
        <a class="v-card" href="portfolio/${link}">
            <div class="v-card__img">
                <img src="portfolio/${link}/thumb.jpg" alt="${title}">
            </div>
            <h2>${title}</h2>${sub}
        </a>
    `;
    paginatedList.appendChild(li);
}

// Parse JSON
const processJSON = async() => {
    await fetch("./portfolio/main_portfolio.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {

            for (let [key, value] of Object.entries(data[type])) {
                start_data[key] = {
                    "title": data[type][key]["title"],
                    "tags": data[type][key]["tags"],
                    "subtitle": data[type][key]["subtitle"]
                }
            }

        })
        .catch((error) => 
            console.error("Unable to fetch data:", error));
}

// --- Page buttons ---

// Disable button function
const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

// Enable button function
const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

// Handle page button state (disabled/enabled at bounds)
const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
        disableButton(prevButton);
    } else {
        enableButton(prevButton);
    }

    if (pageCount === currentPage) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
};

// HTML code to append to the numeric NAV
const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);

    paginationNumbers.appendChild(pageNumber);
};

// Append page numbers to array
const getPaginationNumbers = () => {
    paginationNumbers.innerHTML = "";
    
    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
    }
};

// Give the active page number the .active class
const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
            button.classList.add("active");
        }
    });
};

// Set page logic
const setCurrentPage = (pageNum) => {
    currentPage = pageNum;

    handleActivePageNumber();
    handlePageButtonsStatus();
    
    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems.forEach((item, index) => {
        item.classList.add("hidden");
        if (index >= prevRange && index < currRange) {
        item.classList.remove("hidden");
        }
    });
};

const refreshPageNumbers = () => {
    // Number button events
    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));

        if (pageIndex) {
            button.addEventListener("click", () => {
                setCurrentPage(pageIndex);
            });
        }
    });
}



// --- Search ---

const search = () => {
    paginatedList.innerHTML = ""
    
    let searchTerm = searchInput.value.trim().toLowerCase();
    let new_data = {};

    if (searchTerm && searchTerm.trim().length > 0){

        searchGlass.classList.add("searching");

        for (let [key, value] of Object.entries(start_data)) {
            let queries = start_data[key]["tags"].concat([start_data[key]["title"].toLowerCase()]);
            try{
                queries = queries.concat([start_data[key]["subtitle"].toLowerCase()]);
            } catch {}
            let subQueries = queries.filter(str => str.includes(searchTerm));

            if(subQueries.length > 0){
                searchGlass.classList.add("found");
                new_data[key] = {
                    "title": start_data[key]["title"],
                    "tags": start_data[key]["tags"],
                    "subtitle": start_data[key]["subtitle"]
                }
            }
        }

    } else {
        searchGlass.classList.remove("found");
        searchGlass.classList.remove("searching");
        new_data = start_data;
    }

    for (let [key, value] of Object.entries(new_data)) {
        createPortfolioItem(key, new_data[key]["title"], new_data[key]["subtitle"]);
    }

    listItems = paginatedList.querySelectorAll("li");
    pageCount = Math.ceil(listItems.length / paginationLimit);

    getPaginationNumbers();
    setCurrentPage(1);
    refreshPageNumbers();

};



// --- Onload ---

window.addEventListener("DOMContentLoaded", async () => {
    // Load JSON
    await processJSON();

    for (let [key, value] of Object.entries(start_data)) {
        createPortfolioItem(key, start_data[key]["title"], start_data[key]["subtitle"]);
    }

    const paginatedList = document.getElementById("paginated-list");
    listItems = paginatedList.querySelectorAll("li");
    pageCount = Math.ceil(listItems.length / paginationLimit);

    getPaginationNumbers();
    setCurrentPage(1);

    // Previous button event
    prevButton.addEventListener("click", () => {
        setCurrentPage(currentPage - 1);
    });

    // Next button event
    nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1);
    });

    refreshPageNumbers();

    searchButton.addEventListener("click", () => {
        search();
    });
    searchInput.addEventListener("keypress", (e) => {
        switch(e.key){
            case "Enter":
                search();
                break;
            default:
                break;
        }
    });
});