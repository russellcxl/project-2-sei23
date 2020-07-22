//==================== filter button ====================//

let $filterBy = document.getElementById("filter-by");
let $filterText = document.getElementById("filter-text");
let $filterBtn = document.getElementById("filter-button");
let $table = document.querySelector("tbody");
let $headers = document.getElementById("table-header-names");


let headers = Array.from($headers.children)
    .map(x => x.textContent)
    .filter(x => x.match(/\w+/i)); //[name, address, ...]

//hide input bars
$filterBtn.addEventListener("click", function() {
    if ($filterBy.style.display === "none") $filterBy.style.display = "";
    else $filterBy.style.display = "none";
    if ($filterText.style.display === "none") $filterText.style.display = "";
    else $filterText.style.display = "none";
});

//populate drop down bar (filter by:)
headers.forEach(header => {
    let $newOption = document.createElement("option");
    $newOption.textContent = header;
    $newOption.value = header;
    $filterBy.appendChild($newOption);
});

//filter function
$filterText.addEventListener("input", function() {

    let filterArr = Array.from(document.getElementsByClassName(`${$filterBy.value.toLowerCase()}`));
    
    for (let i = 0; i < filterArr.length; i++) {

        if (filterArr[i].textContent.toLowerCase().indexOf($filterText.value) > -1) {
            $table.children[i].style.display = "";
        }
        else {
            $table.children[i].style.display = "none";
        }
    }
});

console.log(document.getElementsByClassName("date"));


//==================== sort button ====================//

let $sortBtn = document.getElementById("sort-button");
let $sortBy = document.getElementById("sort-by");
let $sortText = document.getElementById("sort-text");
let $tableRows = document.querySelectorAll("tbody>tr");

//hide input bars
$sortBtn.addEventListener("click", function() {
    if ($sortBy.style.display === "none") $sortBy.style.display = "";
    else $sortBy.style.display = "none";
    if ($sortText.style.display === "none") $sortText.style.display = "";
    else $sortText.style.display = "none";
});

//populate sort-by drop down
headers.forEach(header => {
    let $newOption = document.createElement("option");
    $newOption.textContent = header;
    $newOption.value = header;
    $sortBy.appendChild($newOption);
});

//sort listener
$sortBy.addEventListener("change", function() {
    
    //gets values for a property set by $sortBy
    let arrToSort = Array
        .from(document.getElementsByClassName(`${$sortBy.value.toLowerCase()}`))
        .map(x => x.innerText);

    console.log(arrToSort);

    if ($sortBy.value.toLowerCase() === "product") {
        if ($sortText.value === "ascending") {
            //let productsToSort = arrToSort.map(x => x.match(/\w+(\s\w+)?/gi).length); //[blue chair, red chair, ...]
        }
        else {

        } 
    }   

    else {
        if ($sortText.value === "ascending") {
            sortArray(arrToSort);
        }
        else {
            
        } 
    }
    
});

//$table.insertBefore($table.childNodes[3], $table.childNodes[0]);
//(2n-1) to select node in $table.childNodes

//sort function
//keeps running an infinite loop
// function sortArray(arr) {
//     let shouldSwitch = false;
//     let switching = true;

//     while (switching) {
//         switching = false;

//         for (let i = 0; i < arr.length - 1; i++) {
//             shouldSwitch = false;
//             if (arr[i] > arr[i + 1]) {
//                 $table.insertBefore($table.childNodes[2 * (i + 1) + 1], $table.childNodes[2 * i + 1]);
//                 shouldSwitch = true;
//                 console.log("switched");
//                 break;
//             }
//         }
//         if (shouldSwitch) {
//             switching = true;
//         }
//     }
// }

function sortArray(arr) {
    let mapped = arr
        .map((e, i) => {
            return { oldIndex: i, value: e[0] };
        })
        .sort((a, b) => {
            if (a.value > b.value) {
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            return 0;
        });

    for (let i = 0 ; i < mapped.length ; i++) {
        let oldIndex = mapped[i].oldIndex;
        let newIndex = i;
        $table.appendChild($tableRows[oldIndex]);    
    }
}

// $table.insertBefore($tableRows[2], $tableRows[0])


//==================== google map ====================//


