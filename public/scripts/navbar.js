async function adminArea() {
    const res = await fetch("/api_login/isAdmin")
    const isAdmin = await res.json()
    const ul = document.getElementById("list-refs")

    if (isAdmin["Admin"]) {
        ul.innerHTML = ul.innerHTML + '<li class="nav-item"><a class="nav-link text-white" href="#">Admin Area</a></li>'
    }
}

async function isLoggedIn() {
    const res = await fetch("/api_login/fullname")
    const fullname = await res.json()

    const li = document.getElementById("personal-area")
    const rightText = document.getElementById("userConnected")
    if (fullname.fullname){
        li.innerHTML = '<a class="nav-link text-white" href="#">My Profile</a>'
        rightText.innerHTML = `<span class="navbar-text text-white active me-4">Hello ${fullname.fullname}</span><br><a class="me-4 nav-link d-inline text-white text-decoration-underline" href="/api_login/logout">Logout</a>`
    } else {
        li.innerHTML = '<a class="nav-link text-white" href="/login.html">Login</a>'
    }
}

adminArea()
isLoggedIn()