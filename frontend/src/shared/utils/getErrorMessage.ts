export const getErrorMessage = (error:any):string =>{
    if('status' in error){
        return `Error: ${error.status}`
    }else if('message' in error){
        return error.message
    }else{
      return 'An unknown error occurred';
    }
}
