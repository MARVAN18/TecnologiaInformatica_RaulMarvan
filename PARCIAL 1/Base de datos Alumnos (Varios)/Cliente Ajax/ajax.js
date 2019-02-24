function loadDoc() {
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    //xhttp.open("GET","info.txt",true);
    xhttp.open("GET","http://localhost:3000/alumnos/",true);
    xhttp.send();
}