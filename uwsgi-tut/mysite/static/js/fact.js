function show(){
var i, no, fact;
fact=1;
if (isNaN(no)) {
alert("Enter a Valid Number and not a string");
document.getElementById("num").value='';
document.getElementById("answer").value='';
return false;
}
if (no<=-1) {
alert("Enter a number greater than or equal to 0");
document.getElementById("num").value='';
document.getElementById("answer").value='';
return false;
}
for(i=1; i<=no; i++) {
fact= fact*i;
}  
document.getElementById("answer").value= fact;
}
