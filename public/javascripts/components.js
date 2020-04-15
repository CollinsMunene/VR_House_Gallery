// var fs = require('fs');

AFRAME.registerComponent('open-file-onclick', {
    // schema: {
    //   color: {default: 'red'}
    // },
  
    init: function () {
      // var data = this.data;
      // var el = this.el;  // <a-box>
      // var defaultColor = el.getAttribute('material').color;
  
      this.el.addEventListener('click', function () {
        // el.setAttribute('color', data.color);
        // window.open("https://www.w3schools.com");
        // fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
        //   if (err) throw err;
        //   alert('saved')
        // });
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            myFunction(this);
          }
        };
        xhttp.open("GET", "cd_catalog.xml", true);
        xhttp.send();
  
        function myFunction(xml) {
          var i;
          var xmlDoc = xml.responseXML;
          var table="<tr><th>Artist</th><th>Title</th></tr>";
          var x = xmlDoc.getElementsByTagName("CD");
          var plane = document.querySelector('a-text');
          for (i = 0; i <x.length; i++) { 
            table += "<tr><td>" +
            x[i].getElementsByTagName("ARTIST")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue +
            "</td></tr>";
          }
  
          
          plane.setAttribute('value', table);
          document.querySelector("a-text").innerHTML = table;
        }
      });
      
  
      // el.addEventListener('mouseleave', function () {
      //   el.setAttribute('color', defaultColor);
      // });
    }
  });
  