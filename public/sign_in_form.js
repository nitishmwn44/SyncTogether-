const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

signupBtn.onclick = (()=>{
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
});
signupLink.onclick = (()=>{
  signupBtn.click();
  return false;
});

document.querySelectorAll('.sign-out > a')[0].onclick = (()=>{
  signupBtn.click();
});
document.querySelectorAll('.sign-out > a')[1].onclick = (()=>{
  loginBtn.click();
});




const signInForm = document.getElementById('signInForm');
signInForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const formData = new FormData(signInForm);
  const jsonData = {};
  formData.forEach((value,key)=>{
    jsonData[key]=value;
  });

  fetch('auth/login',{
    method: 'post',
    body: JSON.stringify(jsonData),
    headers :{
      'Content-Type': 'application/json'
    }
  }).then((res)=>{
    if(res.status==200){
      window.location.replace('/')
    }
  }).catch((err)=>{
    console.log(err);
  });

});

const signUpForm = document.getElementById('signUpForm');
signUpForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const formData = new FormData(signUpForm);
  const jsonData = {};
  formData.forEach((value,key)=>{
    jsonData[key]=value;
  });

  fetch('auth/register',{
    method: 'post',
    body: JSON.stringify(jsonData),
    headers :{
      'Content-Type': 'application/json'
    }
  }).then((res)=>{
    if(res.status==200){
      window.location.replace('/')
    }
  }).catch((err)=>{
    console.log(err);
  });
});

