var Case = new Swiper('.work__sliderInner',{
  slidesPerView: 2.3,
  centeredSlides: true,
  loop: true,
  pagination: {
    el: '.work__sliderInner--pagi',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 1,
    },
  }
})
function validateRadio(radioClass){
  var group = document.querySelectorAll(radioClass);
  var check = false;
  for (var i=0; i<group.length; i++) {
    if (group[i].checked) {
      check = true;
    }
  }
  return check;
}
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
function isNumber(number) {
    var regex = /^[0-9]+$/;
    return regex.test(number);
}
function validateInputValue(value) {
    var regexNumber = /^[0-9]+$/;
    if (!regexNumber.test(value)) {
        return false;
    }
    if (value.length < 10) {
        return false;
    }
    if (value.includes('-')) {
        return false;
    }

    // 5 số giống nhau
    var isSameDigits = false;
    var digitCounts = {};

    for (var i = 0; i < value.length; i++) {
        var digit = value[i];
        digitCounts[digit] = (digitCounts[digit] || 0) + 1;

        if (digitCounts[digit] === 5) {
            isSameDigits = true;
            break;
        }
    }
    if(isSameDigits) {
        return false;
    }

    return true;
}

jQuery(function($){
  $('#feature .list article').each(function(k,el){
    if(k < 3) {
      $(el).show();
    } else {
      $(el).hide();
    }
  })
  var requiredQuick = $('#quick').find('.required').length;
  var remainQuick = $('#quick').find('.required').length;
  $('#quick').find('.total').text(requiredQuick);
  $('#quick').find('.count').text(remainQuick);
  $(document).on('change','#quick input[name=company],#quick input[name=name],#quick input[name=phone],#quick select[name=pref]',function(e){
    var _c = 0;
    $('#quick :input').each(function(k,v){
      if($(v).closest('dl').find('.required').length > 0 && $(v).val()) {
        if($(v).attr('name') == 'phone') {
          if(isNumber($(v).val())) {
            _c+=1;
          }
        } else {
          _c+=1;
        }
      }
    })
    remainQuick = requiredQuick - _c;
    if(remainQuick == 0) {
      $('#quick').find('button').addClass('enable');
    } else {
      $('#quick').find('button').removeClass('enable');
    }
    $('#quick').find('.count').text(remainQuick);

    $('#quick').find('button.enable').on('click',function(){
      var user_name                   = $('#quick input[name=name]').val();
      var user_phone                  = $('#quick input[name=phone]').val();
      var user_company                = $('#quick input[name=company]').val();
      var user_area               = $('#quick select[name=pref]').val();
      var proceed1 = true;
      $('#quick .error').remove();
      if($('#quick').find('input[name="name"]').val() == "") {
          var output = '<div class="error">お名前を入力してください</div>';
          $('#quick').find('input[name="name"]').parent().append(output);
          proceed1 = false;
      }
      if($('#quick').find('input[name="phone"]').val() == "") {
          var output = '<div class="error">電話番号を入力してください</div>';
          $('#quick').find('input[name="phone"]').parent().append(output);
          proceed1 = false;
      }
      if($('#quick').find('select[name="pref"]').val() == "") {
          var output = '<div class="error">エリアを選択してください</div>';
          $('#quick').find('select[name="pref"]').closest('dd').append(output);
          proceed1 = false;
      }
      if($('#quick').find('input[name="company"]').val() == "") {
          var output = '<div class="error">会社名を教えて下さい</div>';
          $('#quick').find('input[name="company"]').closest('dd').append(output);
          proceed1 = false;
      }
      if (proceed1) {
          //data to be sent to server
          post_data = {
            'userName': user_name,
            'userCompany': user_company,
            'userArea': user_area,
            'userTel': user_phone,
          };
          //Ajax post data to server
          $.post('mail/contact_quick.php', post_data, function(response){

              //load json data from server and output message
              if (response.type == 'error') {
                  output = '<div class="error">' + response.text + '</div>';
              }
              else {
                $(location).attr('href', 'thanks.html');
              }
              // $("#result").hide().html(output).slideDown();
          }, 'json');

      }
      return false;
    })
  })


  var requiredContact = $('#contactMain').find('.required').length;
  var remainContact = $('#contactMain').find('.required').length;
  $('#contactMain').find('.total').text(requiredContact);
  $('#contactMain').find('.count').text(remainContact);
  $(document).on('change','#contactMain textarea[name=mess],#contactMain input[name=name],#contactMain input[name=phone],#contactMain select[name=pref],#contactMain input[name=email]',function(e){
    var _co = 0;
    $('#contactMain :input').each(function(k,v){
      if($(v).closest('dl').find('.required').length > 0 && $(v).val()) {
        if($(v).attr('name') == 'phone') {
          if(isNumber($(v).val())) {
            _co+=1;
          }
        } else if($(v).attr('name') == 'email'){
          if(isEmail($(v).val())) {
            _co+=1;
          }
        } else {
          _co+=1;
        }
      }
    })
    remainContact = requiredContact - _co;
    if(remainContact == 0) {
      $('#contactMain').find('button').addClass('enable');
    } else {
      $('#contactMain').find('button').removeClass('enable');
    }
    $('#contactMain').find('.count').text(remainContact);
    $('#contactMain').find('button.enable').on('click',function(){
      var user_company                = $('#contactMain input[name=company]').val();
      var user_name                   = $('#contactMain input[name=name]').val();
      var user_phone                  = $('#contactMain input[name=phone]').val();
      var user_email                  = $('#contactMain input[name=email]').val();
      var user_area               = $('#contactMain select[name=pref]').val();
      var user_type               = $('#contactMain input[name=type]:checked').val();
      var user_mess               = $('#contactMain textarea[name=mess]').val();
      var proceed = true;
      $('#contactMain .error').remove();
      if($('#contactMain').find('input[name="name"]').val() == "") {
          var output = '<div class="error">お名前を入力してください</div>';
          $('#contactMain').find('input[name="name"]').parent().append(output);
          proceed = false;
      }
      if($('#contactMain').find('input[name="phone"]').val() == "") {
          var output = '<div class="error">電話番号を入力してください</div>';
          $('#contactMain').find('input[name="phone"]').parent().append(output);
          proceed = false;
      }
      if($('#contactMain').find('select[name="pref"]').val() == "") {
          var output = '<div class="error">エリアを選択してください</div>';
          $('#contactMain').find('select[name="pref"]').closest('dd').append(output);
          proceed = false;
      }
      if($('#contactMain').find('input[name="email"]').val() == "" || !isEmail($('#contactMain').find('input[name="email"]').val())) {
          var output = '<div class="error">メールアドレスを入力してください</div>';
          $('#contactMain').find('input[name="email"]').parent().append(output);
          proceed = false;
      }
      if (proceed) {
          //data to be sent to server
          post_data = {
            'userCompany': user_company,
            'userName': user_name,
            'userTel': user_phone,
            'userEmail': user_email,
            'userArea': user_area,
            'userType': user_type,
            'userMess': user_mess,
          };
          //Ajax post data to server
          $.post('mail/contact_mail.php', post_data, function(response){

              //load json data from server and output message
              if (response.type == 'error') {
                  output = '<div class="error">' + response.text + '</div>';
              }
              else {
                $(location).attr('href', 'thanks.html');
              }
              // $("#result").hide().html(output).slideDown();
          }, 'json');

      }
      return false;
    })
  })
})