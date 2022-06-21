$(document).ready(function () {
    if (document.getElementById('tbody').innerHTML != "") {
        createTable();
    } else {
        document.getElementById('tbody').innerHTML = "";
        createTable();
    }
    $('#tables').DataTable();

})

// getrequest............
$.get("data.json", function (data, status) {
    let store = localStorage.setItem('storage', JSON.stringify(data));
});


let bookList = "";
function createCard() {

    let storeData = JSON.parse(localStorage.getItem('storage'));

    for (let i = 0; i < storeData.length; i++) {

        let img = document.querySelectorAll("img");

        $('.card-holder').append(

            '<div class="card w-100"><img class="img1" src="https://static01.nyt.com/images/2022/06/15/books/14BOOKCALHOUN1/14BOOKCALHOUN1-videoLarge.png"alt="not found"><div class="card-body"><h5 class="card-title">Book1</h5><p id="author"class="common">Author:JkRowling</p><p id="genere"class="common">Genere:fiction</p><p id="review"class="common">Review:4</p><p id="avqty"class="common">AvailableQty:10</p><p id="unitprice"class="common">UnitPrice:20</p></div></div>');
    }

}
createCard();

function assignValue() {
    let cardBody = document.querySelectorAll(".card-body");
    let storeData = JSON.parse(localStorage.getItem('storage'));

    let key = Object.keys(storeData[0]);

}
assignValue();

//////dropdown list................
$(document).ready(() => {
    $.ajax({
        url: "data.json",
        type: 'GET',
        success: function (data) {

            bookList = data;


            data.forEach(element => {

                $("#newBooks").append('<option value="' + element.BookName + '">' + element.BookName + '</option>')
            

            })
        },


        error: function (error) {

        },
    })
})

// for addition of books............

$(document).ready(() => {
    $.ajax({
        url: "data.json",
        type: 'GET',
        success: function (data) {

            bookList = data;

// important
            data.forEach(element => {
                // additionbook is the id of the options coming.
                $("#additionBook").append(' <option value=" ' + element.BookName + ' ">' + element.BookName + '</option>')
               

            })
        },
        error: function (error) {

        },
    })
})

$('#dob').change(() => {

    if (bookList.length > 0) {
        $("#books").empty();
        
        bookList.forEach(element => {

            $("#books").append('<option value="' + element.BookName + '">' + element.BookName + '</option>');
        })
    }
})

$("#books").change(() => {
    $('#bookPrice').val(calculatePrice($("#books").val()));
})

// for return books
$("#newBooks").change(() => {
    $('#newBooksPrice').val(calculatePrice($("#newBooks").val()));
})
// for addNew  books
$("#additionBook").change(() => {
    $('#additionPriceBook').val(calculatePrice($("#additionBook").val()));
})


//calculate book price

// if u choose book2 it will give its corresponding unitprice.
function calculatePrice(str) {
    for (let i = 0; i < bookList.length; i++) {
        if (bookList[i].BookName == str) {
            return bookList[i].UnitPrice;
        }
    }
}

// // Adding data.to localstorage.........................
$("#addData").click(function () {

    let collection = document.getElementsByName("common");
    console.log(collection[0].value);
    // you got all the values
    
    const obj = {};
    let key = ['Id', 'name', 'phoneno', 'dob', 'books', 'Totalprice', 'address'];
    for (let j = 0; j < key.length; j++) {
        if (collection[j].value != "") {
            obj[key[j]] = collection[j].value;

        } else {
            return;
        }

    }
    
    let objLocal = JSON.parse(localStorage.getItem('localData')); 
    if (objLocal == null) {
        localStorage.setItem("localData", JSON.stringify([]));
    }

    objLocal = JSON.parse(localStorage.getItem('localData'));
    
    objLocal.push(obj);
    localStorage.setItem("localData", JSON.stringify(objLocal));

})


function createTable() {

    let local = JSON.parse(localStorage.getItem('localData'));

    let tbody = document.getElementById("tbody");
   
    // let tr = document.createElement("tr");
    
    let colName = Object.keys(local[0]);

    for (let i = 0; i < local.length; i++) {
        let tr = document.createElement("tr");

        tr.setAttribute("id", `customerId${i}`)

        for (let j = 0; j < colName.length; j++) {
            let td = document.createElement("td");
            td.innerText = local[i][colName[j]];
            // everything in add modal comes into the table row.
            // colName[j] so that value gets picked up among corresponding keys.

            tr.appendChild(td);
        }

        let ntd = document.createElement("td");
        // extra table data.
        let rtnBtn = document.createElement('button');
        rtnBtn.setAttribute("data-bs-toggle", "modal");
        rtnBtn.setAttribute("data-bs-target", "#staticBackdrop");
        rtnBtn.setAttribute("class", "btn btn-secondary returnClass");
        rtnBtn.innerText = "Return";
        let addBtn = document.createElement('button')
        addBtn.innerText = "Add Book";
        addBtn.setAttribute("data-bs-toggle", "modal");
        addBtn.setAttribute("data-bs-target", "#exampleModaladdbook")

        addBtn.setAttribute("class", "btn btn-dark addbtn");

        ntd.appendChild(rtnBtn);
        ntd.appendChild(addBtn)
        tr.appendChild(ntd);
        tbody.appendChild(tr);
        $('#tables').DataTable();
    }
    returnBook();
    AdditionBook();

}


function returnBook() {
    $(".returnClass").click(function () {
        let a = $(this).parent().parent().children()[0].innerText;
        // a is "idd"

        // what should happen when u click on submit button.
        $("#userReturnBook").click(function () {


            let customerData = JSON.parse(localStorage.getItem('localData'));
            for (let i = 0; i < customerData.length; i++) {
                if (customerData[i].Id == a) 
                // phela obj ka id==idd
                {
                    let currPrice = customerData[i].Totalprice;
                    let returnPrice = $("#newBooksPrice").val();
        
                    let reqPrice = currPrice - returnPrice;
               
                    customerData[i].Totalprice = reqPrice;
                    break;
                }

            }
            localStorage.setItem("localData", JSON.stringify(customerData));

            $("#tables").empty();
            createTable();

        })
    })

}


function AdditionBook() {
    $(".addbtn").click(function () {
        let a = $(this).parent().parent().children()[0].innerText;


        $("#additionNewBook").click(function () {


            let customerData = JSON.parse(localStorage.getItem('localData'));
            for (let i = 0; i < customerData.length; i++) {
                if (customerData[i].Id == a) {
                    let currPrice = customerData[i].Totalprice;
                    let returnPrice = $("#additionPriceBook").val();
                
                    let reqPrice = Number(currPrice) + Number(returnPrice);
              
                    customerData[i].Totalprice = reqPrice;
                    break;
                }

            }
            localStorage.setItem("localData", JSON.stringify(customerData));
            if ($("#table") == '') {
                createTable();
            } else {
                $("#table") = '';
                createTable();
            }

            $("#alertalert").show();


        })
    })

}

