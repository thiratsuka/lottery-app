var thumbs = [];
Array.prototype.forEach.call(document.querySelectorAll('.galleryMain img'),function(el){
  thumbs.push(el.src);
})
var galleryMain = new Swiper(".galleryMain", {
  loop: true,
  slidesPerView: 1,
  pagination: {
    el: '.galleryMain--thumb',
    clickable: true,
    renderBullet: function (index, className) {
     return '<span class="' + className + '"><img src="' + (thumbs[index]) + '"></span>';
    },
  },
  navigation: {
    nextEl: '.galleryMain--next',
    prevEl: '.galleryMain--prev',
  },
});
jQuery(function($){
  $(document).on('keydown','#investment',function(e){
    if(isNaN(e.key) && e.key !== 'Backspace'){
      e.preventDefault();
    }
  })
  $(document).on('input','#investment',function(){
    var invVal =  $('input[id=investment]').val();
    if(invVal > 3400) {
      $(this).val(3400);
      invVal = 3400;
    }
    var result = invVal*10000*parseFloat($('#rate').val())/100*parseInt($('#result').attr('data-month'))/12 +'円';
    $('#result').html(result);
    ;
  })

  $(document).on('click','.fundDetail__desc--nav a',function(e){
    e.preventDefault();
    var tab = $(this).data('tabs');
    $(this).addClass('active');
    $(this).parent().siblings().find('a').removeClass('active');
    $('.fundDetail__desc--con').each(function(k,el){
      if($(el).data().tabs == tab) {
        $(el).show();
      } else {
        $(el).hide();
      }
    })
  })

  var scrollLeftPrev = 0;
        $('#scrollNav').scroll(function () {
            // console.log($('#scrollquestion').width());
            // console.log($('#scrollquestion').scrollLeft());
            var $elem=$('#scrollNav');
            var newScrollLeft = $elem.scrollLeft(),
                width=$elem.width(),
                scrollWidth=$elem.get(0).scrollWidth;
            var offset = 0;
            if (scrollWidth - newScrollLeft-width < offset) {
              // alert('right end');
              $(this).parent().addClass('end');
              $(this).parent().removeClass('start');
            } else {
              $(this).parent().removeClass('end');
              $(this).parent().removeClass('start');
            }
            if (newScrollLeft === 0) {
              $(this).parent().addClass('start');
              $(this).parent().removeClass('end');
            }
            // console.log($('#scrollNav').width());
            scrollLeftPrev = newScrollLeft;
        });
})