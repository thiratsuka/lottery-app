function closest(el, selector) {
  // type el -> Object
  // type select -> String
  var matchesFn;
  // find vendor prefix
  ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function(fn) {
    if (typeof document.body[fn] == 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  })
  var parent;
  // traverse parents
  while (el) {
    parent = el.parentElement;
    if (parent && parent[matchesFn](selector)) {
      return parent;
    }
    el = parent;
  }
  return null;
}

const fileSelector = document.getElementById('file');
fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;
  closest(fileSelector,'label').querySelector('span').classList.add('sel');
  closest(fileSelector,'label').querySelector('em').textContent = fileList[0].name;
  document.querySelector('#result').classList.add('open');
});
const resetFile = document.getElementById('resetFile');
resetFile.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  fileSelector.value = '';
  closest(fileSelector,'label').querySelector('em').textContent = 'ファイルをアップロード';
  closest(fileSelector,'label').querySelector('span').classList.remove('sel');
  document.querySelector('#result').classList.remove('open');
});
jQuery(function(){

})
