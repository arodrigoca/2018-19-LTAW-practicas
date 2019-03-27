function search_action(event){
  console.log("User pressed a key inside the search bar");
  var search_bar_value = document.getElementById('search_bar').value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log(this.responseText);
    }
  };
  xhttp.open("GET", "search_item="+search_bar_value+String.fromCharCode(event.keyCode), true);
  xhttp.send();

}
