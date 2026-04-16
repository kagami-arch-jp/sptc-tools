let id=0
export function startDance() {
  stopDance()
  let _title=''
  let title1='generating..', title2='please wait..'
  id=setInterval(()=>{
    document.title=(_title=_title===title1? title2: title1)
  }, 1e3)
}
export function stopDance() {
  clearInterval(id)
  document.title=''
}
