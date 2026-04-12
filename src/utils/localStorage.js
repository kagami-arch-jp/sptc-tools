export function helper(key) {
  return {
    setValue: newValue=>{
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    getValue: defaultValue=>{
      try{
        return JSON.parse(localStorage.getItem(key))
      }catch(e) {
        return defaultValue
      }
    }
  }
}
