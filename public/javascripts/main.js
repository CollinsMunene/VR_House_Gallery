const socket = io('http://localhost:3000')

// function buttonclicked(){
    // socket.on('connect', function(){
      // socket.on('users_count', function(){
      //   console.log("Connectionful");
      // });
    // });
// }

AFRAME.registerComponent('change-color-on-hover', {
//   schema: {
//     color: {default: 'red'}
//   },

  init: function () {
    // var data = this.data;
    var el = this.el;  // <a-box>
    // var defaultColor = el.getAttribute('material').color;

    // el.addEventListener('mouseenter', function () {
    //     updateColor();
    //   el.setAttribute('color', data.color);
    // });
    el.addEventListener('mouseenter', this.onActionChange.bind(this));
    // el.addEventListener('changz', this.onActionChang.bind(this));
    el.addEventListener('mouseleave', function () {
    //   el.setAttribute('color', defaultColor);
    });

  },
  onActionChange: function () {
    var box = document.querySelector('a-box');

    // box.setAttribute('color',"blue");
     console.log(box)
    // box.emit('changz');
    // box.setAttribute('material',"blue");
    //   var dig = document.createElement('a-box');
    //   dig.setAttribute('position',"-1 -1 0",'color',"red");
    //   document.querySelector('a-scene').appendChild(dig);
       console.log("mouse entered")
    //     // undo old one
    //     this.handleActionEnd(this.previousAction);

    //     var menuEl = document.getElementById(this.data.menuID);
    //     // get currently selected action
    //     var optionValue = menuEl.components['select-bar'].selectedOptionValue;
    //     console.log("debug-controls: new optionValue: " + optionValue);
    // //    console.log(optionValue);
    //     // do new one
    //     this.handleActionStart(optionValue);
    },
    onActionChang: function(){
        // console.log("something here")
        // el.addEventListener('changz', function (event) {
        // console.log('Entity collided with',event);
        // });
        // var box = document.querySelector('a-box');
        // box.setAttribute('color',"blue");
    }
});

socket.emit('message', "Hello my name is Client.");

socket.on('message', function(message){
  console.log(message);
});