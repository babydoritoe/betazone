import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
//import { createClient } from '@supabase/supabase.js'


let apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZm5rbmxrem5hZmplZWJnd212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyMjg4OTcsImV4cCI6MjAyMjgwNDg5N30.3rnqE0ZJCxYW2blT3XDlWjxg2JqdSasu6pX3Os9EPgw"
const supabase = createClient("https://zqfnknlkznafjeebgwmv.supabase.co", apiKey);
let user

let DOM ={
    suBu: document.getElementById("su"),
    liBu: document.getElementById("li"),
    emIn: document.getElementById("email"),
    psIn: document.getElementById("pass"),
    dnIn: document.getElementById("name"),
    errorDisplay: document.getElementById("error"),
    lisu: document.getElementById("lisuuu"),
}
function loadProfile(){
    if (!user) {return false}
    DOM.lisu.innerHTML = `
        <h4 style="font-size:2.1em">${user.user_metadata.displayName}</h4>
        <h4>Email: ${user.email}</h4>
        <p>User id: ${user.id}</p>
        <button id="logout">Logout</button>
    `
    DOM.lisu.querySelectorAll("#logout")[0].onclick = function(){
        user = false
        window.localStorage.setItem("email","")
        window.localStorage.setItem("password","")
        DOM.lisu.innerHTML = `<h2>You have successfully been logged out. You may refresh the page. </h2>`
    }
}

function error(msg){
    DOM.errorDisplay.innerHTML = msg
    DOM.errorDisplay.style.visibility = "visible"
    DOM.errorDisplay.style.transition = "none";
    DOM.errorDisplay.style.backgroundColor = `rgba(255,255,255,1)`
    DOM.errorDisplay.style.color = "rgb(220,0,0)"
    setTimeout(function(){
        DOM.errorDisplay.style.transition = `all 0.4s`
        DOM.errorDisplay.style.backgroundColor = `rgba(255,255,255,0.5)`
        DOM.errorDisplay.style.color = "rgb(20,0,0)"
    },15)
}
DOM.suBu.addEventListener("click",async function(){
    let email = DOM.emIn.value
    let password = DOM.psIn.value
    let name = DOM.dnIn.value
    if (email.length <6 || password.length < 6 || name.length < 6){
        error("Password, name, and email must be at least 6 characters")
        return false
    }
    let stuff = await supabase.auth.signUp({
        email: email,
        password: password,
        options:{
            data:{
                displayName:  name
            }
        }
    })
    if (stuff.error){
        error(stuff.error.message)
    }
    user = stuff.data.user
    console.log(user)
    loadProfile()
    window.localStorage.setItem("email",email)
    window.localStorage.setItem("password",password)
})
async function login(e, p ){
    let email = e || DOM.emIn.value
    let password = p || DOM.psIn.value
    if (email.length <6 || password.length < 6){
        error("Password and email must be at least 6 characters")
        return false
    }
    let stuff = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (stuff.error){
        error(stuff.error.message)
    }
    user = stuff.data.user
    console.log(user)
    loadProfile()
    window.localStorage.setItem("email",email)
    window.localStorage.setItem("password",password)
}
DOM.liBu.addEventListener("click",async function(){
    login()
})

let e = window.localStorage.getItem("email")
let p = window.localStorage.getItem("password")
console.log(e,p)
if (e && e.length > 6){
    login(e, p)
}