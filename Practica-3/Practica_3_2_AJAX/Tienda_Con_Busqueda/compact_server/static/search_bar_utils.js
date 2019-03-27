function search_action(event){
  console.log("User pressed a key inside the search bar");
  var search_bar_value = document.getElementById('search_bar').value;
  var dropdown = document.getElementById('dropdown');
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     //console.log(JSON.parse(this.responseText));
     var x;
     var dropdown_list = [];
     var dropdown_dict = JSON.parse(this.responseText);
     dropdown.innerHTML = "";
     for(x in dropdown_dict){
       dropdown.innerHTML = dropdown.innerHTML + '<li>' + dropdown_dict[x] + '</li>'
     }
   }
  };
  xhttp.open("GET", "search_item="+search_bar_value+String.fromCharCode(event.keyCode), true);
  xhttp.send();

}
