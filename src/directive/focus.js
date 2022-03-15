import Vue from 'vue'

Vue.directive('focus',{
  inserted: function (el) {
    el.querySelector('input').focus();

    let inputVal = el.querySelector('input').value
    if(!~~inputVal) {
      el.querySelector('input').value = ''
    }
  }
})