const formLogin = document.getElementById("form-login")
const API_HOST = 'http://127.0.0.1:5000'

window.onload = function() {
    formLogin.addEventListener('submit', (e) =>{
        e.preventDefault();
        const xhr = new XMLHttpRequest()
        const url = API_HOST + "/user"

        const username = document.getElementById("username").value
        const password = document.getElementById("password").value


        const data = JSON.stringify({
            username: username,
            password: password,
        })

        xhr.open("POST", url, true)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
        xhr.onreadystatechange = function(){
            if(this.status == 200){
                const response = JSON.parse(this.response)  
                arryUname = response['results'][0]
                sessionStorage.setItem('username', arryUname)
                window.location.href = "http://127.0.0.1:8080/"
                console.log(arryUname)
            }
            else{
                console.log(this.response)
            }
        }

        
        xhr.send(data)
    })
}