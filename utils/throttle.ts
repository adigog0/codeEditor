export function throttle(cb:any, delay:number) {

    let wait = false;
    let storedArgs:any[] | null = null;
  
    function checkStoredArgs () {
      if (storedArgs == null) {
        wait = false;
      } else {
        cb(...storedArgs);
        storedArgs = null;
        setTimeout(checkStoredArgs, delay);
      }
    }
  
    return ((...args: any[]) => {
      if (wait) {
        storedArgs  = args;
        return;
      }
  
      cb(...args);
      wait = true;
      setTimeout(checkStoredArgs, delay);
    })
  }



