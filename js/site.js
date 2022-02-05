//get loan info from page
function calculate(){
    let loanPrincipal = document.getElementById("loanAmount").value;
    let numMonths = document.getElementById("numPay").value;
    let rate = document.getElementById("rate").value;

    //convert to integer 
    loanPrincipal = parseInt(loanPrincipal);
    numMonths = parseInt(numMonths);
    rate = parseInt(rate);

    if(Number.isInteger(loanPrincipal) && Number.isInteger(numMonths) && Number.isInteger(rate)){
        //calculate loan
        let loanArray = calcLoan(loanPrincipal, numMonths, rate);
        //display function
        displayValues(loanArray);
    } else {
        alert('Please check the values and calculate again.');
    }
}

//logic function
function calcLoan(principal, period, rate){
    let returnArray = [];

    // establish formulas
    let tMonthlyPayment = principal * (rate/1200) / (1 - Math.pow((1 + rate/1200),-period));
    let remainingBalance = principal;
    let interestPayment = remainingBalance * (rate/1200);
    let cumulativeInterest  = 0;
    let tCost = 0;
    let principalPayment = tMonthlyPayment - interestPayment;

    // loop through months to build array
    for(let i = 1; i <= period; i++){
        //push month #  
        returnArray.push(i);
        //push total monthly payment
        returnArray.push(Number(tMonthlyPayment).toFixed(2));
        //push principal Payment
        returnArray.push(Number(principalPayment).toFixed(2));
        //push interest payment
        returnArray.push(Number(interestPayment).toFixed(2));
        //push cumulative interest paid (total interest)
        cumulativeInterest += interestPayment;
        returnArray.push(Number(cumulativeInterest).toFixed(2));
        //push remaining balance
        remainingBalance -= principalPayment;
        returnArray.push(Number(remainingBalance).toFixed(2));

        // recalculate
        interestPayment = remainingBalance * (rate/1200);
        principalPayment = tMonthlyPayment - interestPayment;
    }

    tCost = principal + cumulativeInterest;
    //round decimals to 2 places
    tCost = Number(tCost).toFixed(2);
    tMonthlyPayment = Number(tMonthlyPayment).toFixed(2);
    principal = Number(principal).toFixed(2);
    cumulativeInterest = Number(cumulativeInterest).toFixed(2);
    
    //format strings as currency
    let dollarUSLocale = Intl.NumberFormat('en-US',{
        style: "currency",
        currency: "USD",
    });

    //print totals to page
    document.getElementById("monthlyPayment").innerHTML = dollarUSLocale.format(tMonthlyPayment);
    document.getElementById("tPrincipal").innerHTML = dollarUSLocale.format(principal);
    document.getElementById("tInterest").innerHTML = dollarUSLocale.format(cumulativeInterest);
    document.getElementById("tCost").innerHTML = dollarUSLocale.format(tCost);

    return returnArray;
}

//output to page
//display function
function displayValues(loanArray){
    let tableBody = document.getElementById("results");
    let templateRow = document.getElementById("loanTemplate");

    // 1st: clear table, may want to run > 1x
    tableBody.innerHTML = "";

    // 2nd: loop over the length of the array
    for(let i = 0; i<loanArray.length; i+=6){
        // importNode() imports as a document fragment to use elsewhere
        // in a document only grabs the content of the element with the
        // id templateRow. 2nd parameter of 'true' means that all children
        //  of the selected element are copied into the fragment
        let tableRow = document.importNode(templateRow.content, true);

        // grab only <td>s
        let rowCols = tableRow.querySelectorAll("td");
        rowCols[0].textContent = loanArray[i];
        rowCols[1].textContent = loanArray[i+1];
        rowCols[2].textContent = loanArray[i+2];
        rowCols[3].textContent = loanArray[i+3];
        rowCols[4].textContent = loanArray[i+4];
        rowCols[5].textContent = loanArray[i+5];

        tableBody.appendChild(tableRow);
    }
}