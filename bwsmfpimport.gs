/** @OnlyCurrentDoc */
var spreadsheet = SpreadsheetApp.getActive();
var sheet = spreadsheet.getSheets()[0];
var username = 'YOUR_MYFITNESSPAL_USERNAME';

function mfpImport() {
    
  var today = new Date().setHours(0,0,0,0);
  var weekday = parseInt(Utilities.formatDate(new Date(), "GMT", "u"));
  var monday = today- (weekday - 1) * (24*3600*1000);
  var sunday = today+ (7 - weekday) * (24*3600*1000);
  var mondayString = Utilities.formatDate(new Date(monday), "GMT", "dd-MMM-yyyy");
  var sundayString = Utilities.formatDate(new Date(sunday), "GMT", "dd-MMM-yyyy");
  var firstDay = spreadsheet.getRange('E24').getValue();
    
  var range = sheet.getRange(26, 2, 120);
  
  // Get array of values in the search Range
  var values = range.getValues();
  
  var rowInterest, dateInterest;

  for (var i = 0; i < values.length; i+= 2){
  for (var col in values[i]) {
    var dateTime1 = new Date(values[i][col]).setHours(0,0,0,0)
    if (typeof values[i+2] !== 'undefined'){
      var dateTime2 = new Date(values[i+2][col]).setHours(0,0,0,0)
      if (today >= dateTime1 && today <= dateTime2){
        rowInterest = parseInt(i) + 26 + 1;
        dateInterest = dateTime1;
      }
    }
  }
  }
  
  
    
  for (var j = 0; j < 7; j++){
    var dateScrap = dateInterest + j * (24*3600*1000);
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
