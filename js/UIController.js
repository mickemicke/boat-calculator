var UIController = (function () {

  var DOMstrings = {
    inputName: '.name-input',
    inputMinutes: '.minutes-input',
    inputRate: '.rate-input',
    addButton: '.btn-add',
    resetButton: '.btn-reset',
    submitButton: '.btn-submit',
    tableBody: '.tbody',
    tableHead: '.thead',
    tableInputs: '.table-inputs',
    resultDiv: '.result',
    startFee: '.start-fee-input',
    removeRow: '.remove-row-btn'
  };

  // To identify newly created rows to be able to target them for removal, get incremented by 1 for every new row added
  var id = 0;

  var enableButton = function (element, boolean) {
    // If you want them enabled you pass true, but that means HTML needs the vale false (for disabled=false) so it flips before applying it
    document.querySelector(element).disabled = !boolean;
  };

  var showUI = function (element, boolean) {
    var selector = document.querySelector(element);

    if (boolean && selector.classList.contains('hide')) {

      selector.classList.remove('hide');
      selector.classList.add('show');

    } else if (boolean === false) {
      selector.classList.remove('show');
      selector.classList.add('hide');

    };
  };

  var removeInputs = function () {
    var element = document.querySelector(DOMstrings.tableBody);
    while (element.hasChildNodes()) {
      element.removeChild(element.firstChild);
    }
  };

  // Foreach to loop over nodeLists that gets returned from calling querySelectorAll (since they are not arrays)
  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    };
  };

  var clearFields = function () {
    document.querySelector(DOMstrings.inputRate).value = "";
    document.querySelector(DOMstrings.startFee).value = "";
  };

  var removeResults = function () {
    document.querySelector(DOMstrings.resultDiv).innerHTML = "";
  };

  return {
    getDOMstrings: function () {
      return DOMstrings;
    },

    addInputField: function () {
      id++;
      var newInput = `<tr id="row-${id}" ><td> <input type="text" placeholder="Namn" class="name-input" /></td> <td> <input type="text" placeholder="Antal minuter" class="minutes-input" /> </td> <td><i class="fas fa-times-circle remove-row-btn"></i></td> </tr>`
      document.querySelector(DOMstrings.tableBody).insertAdjacentHTML('beforeend', newInput);

      // Update UI with enabled buttons and inputs showing
      showUI(DOMstrings.tableHead, true);
      enableButton(DOMstrings.submitButton, true);
      enableButton(DOMstrings.resetButton, true);
      enableButton(DOMstrings.inputRate, true);
      enableButton(DOMstrings.startFee, true);
    },

    resetUI: function (boolean) {
      if (boolean === true) {
        showUI(DOMstrings.tableHead, false);
      }

      // Update UI with cleared fields and disabled buttons
      enableButton(DOMstrings.submitButton, false);
      enableButton(DOMstrings.resetButton, false);
      enableButton(DOMstrings.inputRate, false);
      enableButton(DOMstrings.startFee, false);
      removeInputs();
      clearFields();
      removeResults();

    },

    getInputValues: function () {
      var names, minutes, startingFee, error;
      var keys = [];
      var values = [];
      var result = [];
      error = false;

      names = document.querySelectorAll(DOMstrings.inputName);
      minutes = document.querySelectorAll(DOMstrings.inputMinutes);
      rate = document.querySelectorAll(DOMstrings.inputRate);
      startingFee = document.querySelectorAll(DOMstrings.startFee);

      // Check if field is empty - coerce the entered value to a number and check if it's NaN else continue.
      var nodeListCallBack = (item, index) => {
        if (item.value !== "" && !isNaN(+item.value)) {
          values.push(+item.value);
          item.classList.remove('error');
        } else {
          item.classList.add('error');
          error = true;
        }     
      }

      // Validate all input fields and add the error class if they fail validation / remove class if they pass validation
      nodeListForEach(names, (item, index) => {
        if (item.value !== "") {
          keys.push(item.value);
          item.classList.remove('error');
        } else {
          item.classList.add('error');
          error = true;
        }
      });

      nodeListForEach(minutes, nodeListCallBack);
      nodeListForEach(rate, nodeListCallBack);
      nodeListForEach(startingFee, nodeListCallBack);

      // Create array of objects 
      for (let i = 0; i < keys.length; i++) {
        result.push({
          name: keys[i],
          minutes: values[i]
        });
      };

      if (error === false) {
        return result;
      } else {
        return [];
      }
    },

    getRateInput: function () {
      var selector = document.querySelector(DOMstrings.inputRate);
      
      if (selector.value !== "") {
        selector.classList.remove('error');
        return selector.value
      } else {
        selector.classList.add('error');
      }
    },

    getStartFeeInput: function () {
      var selector = document.querySelector(DOMstrings.startFee);
      return selector.value;
    },

    deleteRow: function (selectorID) {
      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    displayResults: function (results) {
      var tableHead, tableBody, tableEnd, totalCost, totalSum;

      totalCost = results.map(item => item.amount).reduce((prev, cur) => prev + cur, 0);
      totalMinutes = results.map(item => item.minutes).reduce((prev, cur) => prev + cur, 0);
      totalStartFee = results.map(item => item.fee).reduce((prev, cur) => prev + cur, 0);
      totalSum = totalCost + totalStartFee;

      tableHead = '<table class="table-result"><thead><tr><th>Namn</th><th>Minuter</th><th>Totalt minutpris</th><th>Startavgift</th><th>Total kostnad</th></tr></thead><tbody>';


      tableBody = results.map((item) => `
      <tr>
        <td class="first-td-child" >${item.name}</td>
        <td>${item.minutes}</td>
        <td>${item.amount}</td>
        <td>${item.fee}</td>
        <td>${item.amount + item.fee} kr</td>
      </tr>`)

      tableEnd = `
            <tr class="blank-row"></tr>
            <tr>
              <td class="first-td-child" >Totalt:</td>
              <td>${totalMinutes}</td>
              <td>${totalCost}</td>
              <td>${totalStartFee}</td>
              <td>${totalSum} kr</td>
            </tr
          </tbody
        </table>`;

      document.querySelector('.result').innerHTML = tableHead + tableBody.join(" ") + tableEnd;
    }
  };

})();