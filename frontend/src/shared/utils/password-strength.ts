const hasNumber = (number: string) : boolean => new RegExp(/[0-9]/).test(number) ;


const hasMixed = (number: string) => 
    new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number)



export const strengthColor = (password: string): number  =>{
 let strengths = 0;

 if(password.length > 5) strengths += 1;
if (password.length > 7) strengths += 1;
if (hasNumber(password)) strengths += 1;
if (hasMixed(password)) strengths += 1;

return strengths
}