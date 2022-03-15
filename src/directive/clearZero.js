import Vue from 'vue'

Vue.directive('clearZero',{
  inserted: function (el) {
    let inputVal = el.querySelector('input').value
    if(!~~inputVal) {
      el.querySelector('input').value = ''
    }
  }
})