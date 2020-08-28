/** @OnlyCurrentDoc */
var spreadsheet = SpreadsheetApp.getActive();
var sheet = spreadsheet.getSheets()[0];
var username = 'leonzu2104';

function mfpImport() {
    
  var today = new Date();  
  var weekday = parseInt(Utilities.formatDate(new Date(), "GMT", "u"))
  var monday = today.getTime() - (weekday - 1) * (24*3600*1000);
  var sunday = today.getTime() + (7 - weekday) * (24*3600*1000);
  var mondayString = Utilities.formatDate(new Date(monday), "GMT", "dd-MMM-yyyy");
  var sundayString = Utilities.formatDate(new Date(sunday), "GMT", "dd-MMM-yyyy");
  var firstDay = spreadsheet.getRange('E24').getValue();
  
  spreadsheet.getRange('I14').setValue(firstDay);
  
  var range = sheet.getRange(26, 2, 120);
  
  // Get array of values in the search Range
  var values = range.getValues();
  
  var rowInterest, dateInterest;

  for (var i = 0; i < values.length; i+= 2){
  for (var col in values[i]) {
    var date = new Date(values[i][col]);
    var dateTime = date.getTime();
    
    if (dateTime > monday && dateTime < sunday){
      rowInterest = parseInt(i) + 26 + 1;
      dateInterest = date;
    }
  }
  }
    
  for (var j = 0; j < 7; j++){
    var dateScrap = dateInterest.getTime() + j * (24*3600*1000);
    dateScrap = Utilities.formatDate(new Date(dateScrap), "GMT", "yyyy-MM-dd");
    var url = 'https://www.myfitnesspal.com/food/diary/' + username + '?date=' + dateScrap;
    var html = UrlFetchApp.fetch(url).getContentText();
    var searchstring = `<tr class="total">

        <td class="first">Totals</td>


            <td>`;
    var index = html.search(searchstring);
    if (index >= 0) {
      var pos = index + searchstring.length
      var intake = html.substring(pos, pos + 10);
      intake = intake.replace(/\D/g,'');
      if (intake != "0")
        sheet.getRange(parseInt(rowInterest), (j + 5)).setValue(intake);
    }
  }
  
}


