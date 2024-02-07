import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
//import { createClient } from "@supabase/supabase-js"

let debounce =false
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
    urlIn: document.getElementById("url"),
    pnameIn: document.getElementById("pname"),
    t0In : document.getElementById("t0"),
    t1In : document.getElementById("t1"),
    t2In : document.getElementById("t2"),
    postBu : document.getElementById("Post"),
    preview: document.getElementById("preview"),
    lleft: document.querySelectorAll(".lleft")[0],
}
function loadProfile(){
    if (!user) {return false}
    DOM.lisu.innerHTML = `
        <h4 style="font-size:2.1em">${user.user_metadata.displayName}</h4>
        <h4>Email: ${user.email}</h4>
        <p>User id: ${user.id}</p>
        <button id="logout">Logout</button>
        <p id="error" style="visibility: collapse; font-size: 0.88em;border-radius: 4px;padding: 0px 2px;"></p>
    `
    DOM.errorDisplay= document.getElementById("error"),
    DOM.lisu.querySelectorAll("#logout")[0].onclick = function(){
        user = false
        window.localStorage.setItem("email","")
        window.localStorage.setItem("password","")
        DOM.lisu.innerHTML = `<h2>You have successfully been logged out. You may refresh the page. </h2>`
    }
}

function ERROR(msg){
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
    if (debounce) {debounce = false}
    debounce = true
    let email = DOM.emIn.value
    let password = DOM.psIn.value
    let name = DOM.dnIn.value
    if (email.length <6 || password.length < 6 || name.length < 6){
        ERROR("Password, name, and email must be at least 6 characters")
        return false
    }
    let stuff = await supabase.auth.signUp({
        email: email,
        password: password,
        options:{
            data:{
                displayName:  name,
                likes: [],
                dislikes: [],
            }
        }
    })
    if (stuff.error){
        ERROR(stuff.error.message)
    }
    user = stuff.data.user
    console.log(user)
    loadProfile()
    window.localStorage.setItem("email",email)
    window.localStorage.setItem("password",password)
    debounce = true
})
async function login(e, p ){
    if (debounce) {return false} 
    debounce = true
    let email = e || DOM.emIn.value
    let password = p || DOM.psIn.value
    if (email.length <6 || password.length < 6){
        ERROR("Password and email must be at least 6 characters")
        return false
    }
    let stuff = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (stuff.error){
        ERROR(stuff.error.message)
    }
    user = stuff.data.user
    console.log(user)
    loadProfile()
    window.localStorage.setItem("email",email)
    window.localStorage.setItem("password",password)
    debounce = false
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


//upload images manager
DOM.postBu.addEventListener("click",async function(){
    if (!user){
        return ERROR("You must be logged in to make posts!")
    }
    let url = DOM.urlIn.value
    let pname = DOM.pnameIn.value
    if (url.length < 8 || url.indexOf(".")<1){
        return ERROR("Please enter a valid image url!")
    }
    if (pname.length < 4){
        return ERROR("Please enter a name of at least 4 characters")        
    }
    let tags = [DOM.t0In.value,DOM.t1In.value,DOM.t2In.value]
    if (tags[0].length <= 0){
        return ERROR("Please enter at least 1 tag")                
    }
    let {data,error} = await supabase.from("Posts").insert({
        creator: {
            name: user.user_metadata.displayName,
            id: user.id
        },
        postInfo: {
            title: pname,
            tags: tags,
        },
        url: url,
    }).select().maybeSingle()
    console.log(data,error)
})

DOM.urlIn.oninput = function(){
    DOM.preview.style.backgroundImage = `url('${DOM.urlIn.value}')`
}

//loadImges
let images = await supabase.from("Posts").select()
images.data.forEach(img=>{
    console.log("IMAGE: " + img)
    DOM.lleft.insertAdjacentHTML("beforeend",`
        <div class="cool">
        <img src=${img.url}>
        <div class="div2" style="background-image:url('${img.url}')"></div>
        <h3 >${img.postInfo.title}</h3>
        <p><i>By ${img.creator.name}</i></p>
        </div>
    `)
})
