jQuery(function($){
  $('#feature .list article').each(function(k,el){
    if($(window).width() > 768) {
      if(k >= 3) {
        $(el).css('height',$(el).height()*0.3+'px');
      }
    } else {
      if(k == 3) {
        $(el).css('height',$(el).height()*0.3+'px');
      }
      if(k > 3) {
        $(el).css('height','0px');
      }
    }
  })
  $(document).on('click','#feature .more a',function(e){
    e.preventDefault();
    $(this).parent().hide();
    $('#feature .list article').css('height','auto');
  })
})