// Shared by all case pages: close the burger menu after tapping a nav link
document.querySelectorAll('.nav-links a').forEach(function(a){
  a.addEventListener('click', function(){
    document.body.classList.remove('menu-open');
    var b=document.querySelector('.nav-burger'); if(b) b.setAttribute('aria-expanded','false');
  });
});
