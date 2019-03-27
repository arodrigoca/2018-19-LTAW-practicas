
function search_action(event){
  //console.log("User pressed a key inside the search bar");
  //console.log("normal key");
  var search_bar = document.getElementById('search_bar');
  var search_bar_value = search_bar.value;
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
       dropdown.innerHTML = dropdown.innerHTML + '<li style="color:black"><a class="searchlink" href="arduinos.html">' + dropdown_dict[x] + '</a>' + '</li>';
     }
   }
  };

  document.getElementById('dropdown').style.display = "block";
  var text_to_search = search_bar_value + event.key;
  xhttp.open("GET", "search_item="+text_to_search, true);
  xhttp.send();

}

function backspace_detect(event){
  //console.log("backspace detect");
  var search_bar = document.getElementById('search_bar');
  //console.log(search_bar.value);
  var dropdown = document.getElementById('dropdown');
  if(search_bar.value !== ""){
    if(event.key == "Backspace"){
      var fake_event = new Object();
      fake_event.key = "";
      search_action(fake_event);
    }
  }else{
    dropdown.innerHTML = "";
    document.getElementById('dropdown').style.display = "none";
  }
}
