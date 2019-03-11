//sample data 
//["152", "22259A", "PCB0001480", "1/4/2019", "AAdams", "Emerald Square", "DJ Acquisitions, LLC.", "TN", "$180"]

var insurence_count = 0;
var bond_count = 0;

var bond_array = []
var bond_percent = 0;
var bond_total = 0;
var bond_output = []

var insured_array = []
var insured_percent = 0;
var insured_total = 0;
var insured_output = []

var uninsured_array = []
var uninsured_percent = 0;
var uninsured_total = 0;
var uninsured_output = []

var insurence_total = 0

function makePage() {

}

function check() {
    if (insurence_count > 0 && bond_count > 0) {
        download()
    }
}

function prep() {
    bond_output.push(["Bonds", "", ""]);
    bond_output.push(["", "", ""])
    bond_output.push(["", "Total: " + formatter.format(bond_total), "Total: " + bond_percent + "%"])
    bond_output.push(["", "", ""])
    bond_output.push(["Managment Company:", "Amount:", "% Of Total:"]);
    for (var row in bond_array) {
        var temp = []
        temp.push(bond_array[row][5])
        temp.push(formatter.format(bond_array[row][3]))
        temp.push(bond_array[row][8])
        bond_output.push(temp)
    }

    insured_output.push(["Insurance - Blanket", "", ""])
    insured_output.push(["", "", ""])
    insured_output.push(["", "Total: " + formatter.format(insured_total), "Total: " + insured_percent + "%"])
    insured_output.push(["", "", ""])
    insured_output.push(["Managment Company:", "Amount:", "% Of Total:"]);
    for (var row in insured_array) {
        var temp = []
        temp.push(insured_array[row][5])
        temp.push(formatter.format(insured_array[row][8]))
        temp.push(insured_array[row][9])
        insured_output.push(temp)
    }

    uninsured_output.push(["Insurance - Non-Blanket", "", ""])
    uninsured_output.push(["", "", ""])
    uninsured_output.push(["", "Total: " + formatter.format(uninsured_total), "Total: " + uninsured_percent + "%"])
    uninsured_output.push(["", "", ""])
    uninsured_output.push(["Managment Company:", "Amount:", "% Of Total:"]);
    for (var row in uninsured_array) {
        var temp = []
        temp.push(uninsured_array[row][5])
        temp.push(formatter.format(uninsured_array[row][8]))
        temp.push(uninsured_array[row][9])
        uninsured_output.push(temp)
    }
}


function download() {
    prep()

    /* make the worksheet */
    var ws = XLSX.utils.aoa_to_sheet(bond_output);
    XLSX.utils.sheet_add_aoa(ws, uninsured_output, {
        origin: "F1"
    })

    XLSX.utils.sheet_add_aoa(ws, insured_output, {
        origin: "K1"
    })

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");

    /* generate an XLSX file */
    XLSX.writeFile(wb, "sheetjs.xlsx");
}


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

function injectGrid() {
    for (var row in insured_array) {
        $("#blanket").append(`<div class='col3 flex border1-1 @bcolor1'><p>${insured_array[row][5]}</p></div>`)
        $("#blanket").append(`<div class='flex border1-2 @bcolor2'><p>${formatter.format(insured_array[row][8])}</p></div>`)
        $("#blanket").append(`<div class='flex border1-3 @bcolor3'><p>${insured_array[row][9]}</p></div>`)
    }
    for (var row in uninsured_array) {
        $("#non-blanket").append(`<div class='col3 flex border1-1 @bcolor1'><p>${uninsured_array[row][5]}</p></div>`)
        $("#non-blanket").append(`<div class='flex border1-2 @bcolor2'><p>${formatter.format(uninsured_array[row][8])}</p></div>`)
        $("#non-blanket").append(`<div class='flex border1-3 @bcolor3'><p>${uninsured_array[row][9]}</p></div>`)
    }

}

function organize() {
    for (var row in insured_array) {
        var percentage = (insured_array[row][8] / insurence_total) * 100
        percentage = (Math.round(percentage * 100) / 100) //2 decimal places

        var amount = insured_array[row][8]

        insured_total += (isNaN(amount)) ? 0 : amount
        insured_percent += (isNaN(percentage)) ? 0 : percentage

        insured_array[row].push(percentage + "%")
    }
    for (var row in uninsured_array) {
        var percentage = (uninsured_array[row][8] / insurence_total) * 100
        percentage = (Math.round(percentage * 100) / 100) //2 decimal places

        var amount = uninsured_array[row][8]

        uninsured_total += (isNaN(amount)) ? 0 : amount
        uninsured_percent += (isNaN(percentage)) ? 0 : percentage

        uninsured_array[row].push(percentage + "%")
    }

    insured_array.sort((function(index) {
        return function(a, b) {
            return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1));
        };
    })(8)); // 8 is the index

    uninsured_array.sort((function(index) {
        return function(a, b) {
            return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1));
        };
    })(8)); // 8 is the index

    uninsured_percent = (Math.round(uninsured_percent * 100) / 100) //2 decimal places
    insured_percent = (Math.round(insured_percent * 100) / 100) //2 decimal places

    /********Show totals***********/

    $("#non-blanket").append(`<div class='col2 flex'><h1 class="fcolor2"><span class="fcolor1 font-montserrat2">Total Amount:</span><br>${formatter.format(uninsured_total)}</h1></div>`)
    $("#non-blanket").append(`<div></div>`)
    $("#non-blanket").append(`<div class='col2 flex'> <h1 class="fcolor2"><span class="fcolor1 font-montserrat2">Total Percentage:</span><br>${uninsured_percent}%</h1></div>`)

    $("#blanket").append(`<div class='col2 flex'><h1 class="fcolor2"><span class="fcolor1 font-montserrat2">Total Amount:</span><br> ${formatter.format(insured_total)}</h1></div>`)
    $("#blanket").append(`<div></div>`)
    $("#blanket").append(`<div class='col2 flex'> <h1 class="fcolor2"><span class="fcolor1 font-montserrat2">Total Percentage:</span><br>${insured_percent}%</h1></div>`)

    /********End***********/

    injectGrid()
}

function resultCallback(data) {
    data = data.data

    if (data[0].length == 9) { //if the file matches a insurence file 
        var result = confirm("Is this a insurance file?")
        if (result) {
            insurence_count++
            for (var array_index in data) {
                var insured_type = data[array_index][2]
                if (data[array_index][5] == undefined) {
                    data[array_index][5] = ""
                } //if the company name is undefined 

                /********  find the price for each row**********/

                //parse $ amount 
                var insured_amount = (data[array_index][8] != undefined) ? data[array_index][8] : "00" // check for unefined 
                //remove $ and ()
                if (insured_amount.startsWith("(")) {
                    insured_amount = insured_amount.slice(2, -1) //get rid of the $
                } else {
                    insured_amount = insured_amount.slice(1) //get rid of the $
                }
                insured_amount = insured_amount.split(",").join("") //get rid of ,
                insured_amount = parseFloat(insured_amount) // convert string to number 

                if (!isNaN(insured_amount)) { // if its a valid number 
                    if (insured_amount == undefined) {
                        console.log('found')
                    }
                    data[array_index][8] = insured_amount
                    insurence_total += insured_amount
                }

                /********end**********/


                if (insured_type == undefined || insured_type == "") {
                    uninsured_array.push(data[array_index])
                    continue
                }

                if (insured_type.toLowerCase().startsWith("pcb")) {
                    insured_array.push(data[array_index])
                } else {
                    uninsured_array.push(data[array_index])
                }

            }
            console.log((insured_array.length + uninsured_array.length == data.length)) //are all rows sorted 
            organize()
        }

        check() //check for download ready
    }

    if (data[0].length == 8) { //its a bond file 
        var result = confirm("Is this a bonds file?");
        if (result) {
            bond_count++
            //find total
            for (var row in data) {
                if (data[row][3] == undefined || data[row][3] == "" || data[row][0] == "Bond Holder") { //pass on bad values 
                    continue
                }
                var amount = parseFloat(data[row][3].slice(1))
                bond_total += amount
                data[row][3] = amount
                bond_array.push(data[row])
            }

            //get %
            for (var row in bond_array) {
                var percent = bond_array[row][3] / bond_total * 100;
                percent = Math.round(percent * 100) / 100
                bond_array[row].push(percent + "%") // = Math.round(((() * 100) / 100) rounded 2 places 
                bond_percent += percent
            }
            bond_percent = Math.round(bond_percent * 100) / 100

            //sort
            bond_array.sort((function(index) {
                return function(a, b) {
                    return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1));
                };
            })(3)); // 3 is the index

            //print 

            $("#bonds").append(`<div class='col2 flex'><h1 class="fcolor2"><span class="fcolor1 font-montserrat2">Total Amount:</span><br>${formatter.format(bond_total)}</h1></div>`)
            $("#bonds").append(`<div></div>`)
            $("#bonds").append(`<div class='col2 flex'> <h1 class="fcolor2"><span class="fcolor1 font-montserrat2">Total Percentage:</span><br>${bond_percent}%</h1></div>`)

            for (var row in bond_array) {
                $("#bonds").append(`<div class="col3 flex border1-1 @bcolor1">${bond_array[row][5]}</div>`)
                $("#bonds").append(`<div class="flex border1-2 @bcolor2">${formatter.format(bond_array[row][3])}</div>`)
                $("#bonds").append(`<div class="flex border1-3 @bcolor3">${bond_array[row][8]}</div>`)
            }

        }
        check() //check for download ready 
    }

}

function parse() {
    $('input[type=file]').parse({
        config: {
            complete: function(data) {
                resultCallback(data)
            }
        },
        before: function(file, inputElem) {
            // executed before parsing each file begins;
            // what you return here controls the flow
        },
        error: function(err, file, inputElem, reason) {
            console.log(err)
        },
        complete: function(result, file) {
            console.log('done')
        }
    });
}


$("#bond_button").click(function() {
    $("#bond_files").click()
})
$("#insurence_button").click(function() {
    $("#insurence_files").click()
})

$("#bond_files").change(function() {
    parse()
})
$("#insurence_files").change(function() {
    parse()
})