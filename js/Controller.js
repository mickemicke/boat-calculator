/* MAIN CONTROLLER */

var controller = (function(dataCtrl, UICtrl) {

  var setupEventlisteners = function() {

    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.addButton).addEventListener('click', UICtrl.addInputField);

    document.querySelector(DOM.resetButton).addEventListener('click', ctrlResetAlert);

    document.querySelector(DOM.submitButton).addEventListener('click', calculateAmount);

    document.querySelector(DOM.tableInputs).addEventListener('click', ctrlDeleteRow);

  };

  var calculateAmount = function() {
    var data, values, rate;

    // ctrlAddItem returns false if the fields did not pass validation and true if they did
    if(ctrlAddItem()) {
      data = dataCtrl.getData();
      rate = UICtrl.getRateInput();
      startFee = UICtrl.getStartFeeInput();
      values = [];

      // Calculates and sends the new information to be displayed with some pseudo-backend validation of values
      if(rate > 0 && data.length > 0) {
        values = data.map((item) => ({ name: item.name, minutes: item.minutes, amount: Math.round(rate * item.minutes), fee: Math.round(startFee / data.length) }));
        UICtrl.displayResults(values);
      }
    }
  };

  // Adds an item to the dataArray through the function contructor 
  var ctrlAddItem = function() {
    var inputArray = UICtrl.getInputValues();

    if(inputArray.length > 0) {
      dataCtrl.resetData();

      inputArray.forEach((item, i) => dataCtrl.addItem(item.name, item.minutes));
      return true;
    }
    return false;
  };

  var ctrlDeleteRow = function(event) {
    var itemID = event.target.parentNode.parentNode.id;
    var deleteBtn = event.target.classList.contains('remove-row-btn');
    if(deleteBtn) {
      UICtrl.deleteRow(itemID);
    }   
  };

  var ctrlResetDataAndUI = function() {
    UIController.resetUI(true);
    dataCtrl.resetData();
  };

  var ctrlResetAlert = function() {
    const verifyDelete = confirm('Vill du verkligen börja om?');

    if(verifyDelete) {
      ctrlResetDataAndUI();
    };

  };

  return {
    init: function() {
      setupEventlisteners();

      // Force a reset of all data and fields so no cached values are stuck inside disabled fields on refresh
      ctrlResetDataAndUI();
      console.log('init');
    }
  };

})(dataController, UIController);

controller.init();