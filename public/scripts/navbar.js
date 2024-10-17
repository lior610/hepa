async function adminArea() {
    const res = await fetch("/api_login/username")
    const isAdmin = await res.json()
    const ul = document.getElementById("list-refs")

    if (isAdmin["Admin"]) {
        if (window.location.pathname == "/admin.html") {
            ul.innerHTML = ul.innerHTML + '<li class="nav-item"><a class="nav-link active text-white" aria-current="page" href="/admin.html">Admin Area</a></li>'
        } else {
            ul.innerHTML = ul.innerHTML + '<li class="nav-item"><a class="nav-link text-white" href="/admin.html">Admin Area</a></li>'
        }
    }
}

async function isLoggedIn() {
    const res = await fetch("/api_login/fullname")
    const fullname = await res.json()

    const li = document.getElementById("personal-area")
    const rightText = document.getElementById("userConnected")
    if (fullname.fullname){
        if (window.location.pathname == "/personal_area.html") {
            li.innerHTML = '<a class="nav-link active text-white" aria-current="page" href="/personal_area.html">Personal Area</a>'
        } else {
            li.innerHTML = '<a class="nav-link text-white" href="/personal_area.html">Personal Area</a>'
        }
        rightText.innerHTML = `<span class="navbar-text text-white active me-4">Hello ${fullname.fullname}</span><br><a class="me-4 nav-link d-inline text-white text-decoration-underline" href="/api_login/logout">Logout</a>`
    } else {
        if (window.location.pathname == "/login.html" || window.location.pathname == "/register.html"){
            li.innerHTML = '<a class="nav-link active text-white" aria-current="page" href="/login.html">Login</a>'
        } else {
            li.innerHTML = '<a class="nav-link text-white" href="/login.html">Login</a>'
        }
    }
}

adminArea()
isLoggedIn()