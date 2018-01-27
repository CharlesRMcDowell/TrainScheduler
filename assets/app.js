var config = {
  apiKey: "AIzaSyCc2jjQFPgGQcAn3-AlXhY25_N9CbPvd7o",
  authDomain: "train-scheduler-fe0d5.firebaseapp.com",
  databaseURL: "https://train-scheduler-fe0d5.firebaseio.com",
  projectId: "train-scheduler-fe0d5",
  storageBucket: "train-scheduler-fe0d5.appspot.com",
  messagingSenderId: "1038713114174"
};
firebase.initializeApp(config);

var database = firebase.database();
database.ref().on("child_added", function(snapshotChild) {
  var rows = "";
  rows += "<tr><td>" + snapshotChild.val().trainName + "</td><td>" + snapshotChild.val().line + "</td><td>" + snapshotChild.val().destination + "</td><td>" + snapshotChild.val().frequency + "</td><td>" + snapshotChild.val().arrival + "</td><td>" + snapshotChild.val().minutesTillTrain + "</td></tr>";
  $(rows).appendTo("#trainTable tbody");
})
var trainName = "";
var line = "";
var destination = "";
var arrival = "";
var frequency = 0;


$('#addTrainBtn').on('click', function(event) {
  event.preventDefault();

  trainName = $('#trainNameInput').val().trim();
  line = $('#lineInput').val().trim();
  destination = $('#destinationInput').val().trim();
  arrival = $('#trainTimeInput').val().trim();
  frequency = $('#frequencyInput').val().trim();
  firstTimeConverted = moment(arrival, "hh:mm").subtract(1, "years");
  currentTime = moment();
  diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  tRemainder = diffTime % frequency;
  minutesTillTrain = frequency - tRemainder;
  nextTrain = moment().add(minutesTillTrain, "minutes");
  nextTrainFormatted = moment(nextTrain).format("hh:mm");

  var newTrain = {
    trainName: trainName,
    line: line,
    destination: destination,
    arrival: nextTrainFormatted,
    frequency: frequency,
    minutesTillTrain: minutesTillTrain
  }

  database.ref().push(newTrain);
  database.ref().on("child_added", function(snapshotChild) {
    if (snapshotChild.val().trainName === true) {
      var rows = "";
      rows += "<tr><td>" + snapshotChild.val().trainName + "</td><td>" + snapshotChild.val().line + "</td><td>" + snapshotChild.val().destination + "</td><td>" + snapshotChild.val().frequency + "</td><td>" + snapshotChild.val().arrival + "</td><td>" + snapshotChild.val().minutesTillTrain + "</td></tr>";
      $(rows).appendTo("#trainTable tbody");
    } else {
      return false;
    }
  })

  $('#trainNameInput').val('');
  $('#lineInput').val('');
  $('#destinationInput').val('');
  $('#trainTimeInput').val('');
  $('#frequencyInput').val('');
})