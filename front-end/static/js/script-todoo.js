const API_HOST = "http://127.0.0.1:5000"

function dragStart(event){
    event.dataTransfer.setData("todo", event.target.id)
}

function drop(event){
    event.preventDefault();
    const data = event.dataTransfer.getData("todo")
    event.target.appendChild(document.getElementById(data))
    const dataId = event.srcElement.lastChild.id

    checkStatus(dataId)
}

function allowDrop(event){
    event.preventDefault();
}


// get all task
const todoItem = document.getElementById("todo-item")
const doneItem = document.getElementById("done")
const projectDropdown = document.getElementById("dropdownProject");


window.onload = function(e){
    const username = sessionStorage.getItem('username')
    if(!username){
        window.location.href = "http://127.0.0.1:8080/login"
    }
    const xhr = new XMLHttpRequest();
    const url = API_HOST +"/UndoneUserTask/"+ username
   

    xhr.open("GET", url, true)
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 & this.status == 200){
            const tasks = JSON.parse(this.response)

      
            tasks['data'].forEach((task) => {
                const article = document.createElement('article')
                const badgeDelete = document.createElement('button')
                const badgeEdit = document.createElement('button')
                const badgeDone = document.createElement('button')
                const h4 = document.createElement('h4')
                const p = document.createElement('p')
                const p_proj = document.createElement('p')
                const divContainer = document.createElement('div')
                const divRow = document.createElement('div')
                const col_task = document.createElement('col-sm')
                const col_project = document.createElement('col-sm')

                
                col_task.setAttribute('class', 'col-sm-8')
                col_task.setAttribute('style', 'padding: 0px 0px')
                h4.appendChild(document.createTextNode(task.task_name))
                h4.setAttribute('id', task.task_id)
                col_task.appendChild(h4)

                divContainer.setAttribute ('class', 'container')
                divRow.setAttribute('class','row')

                col_project.setAttribute('class', 'col-sm-4')
                col_project.setAttribute('style', 'text-align: right;padding: 0px 0px')

                p_proj.setAttribute('class', 'border border-3 rounded-pill')
                p_proj.setAttribute('style','padding: 0px 7px 0px 0px')
                p_proj.appendChild(document.createTextNode(task.project_name))

                col_project.append(p_proj)

              
                divRow.appendChild(col_task)
                divRow.appendChild(col_project)

                divContainer.appendChild(divRow)

  
                p.appendChild(document.createTextNode(task.task_desc))
                
                article.setAttribute('class', 'border p-3 drag')
                article.setAttribute('ondragstart', "drag(event)")
                article.setAttribute("draggable", "true")
                article.setAttribute("id", task.task_id)

                badgeDelete.setAttribute('class', 'badge bg-danger')
                badgeDelete.setAttribute("href", "#")
                badgeDelete.setAttribute("data-id", task.task_id)
                badgeDelete.setAttribute("data-bs-toggle", "modal")
                badgeDelete.setAttribute("data-bs-target", "#modalDelete")
                
                badgeDelete.appendChild(document.createTextNode("Delete"))

                badgeEdit.setAttribute('class', 'badge bg-info')
                badgeEdit.setAttribute("href", "#")
                badgeEdit.setAttribute("data-title", task.task_name)
                badgeEdit.setAttribute('data-description', task.task_desc)
                badgeEdit.setAttribute("data-id", task.task_id)
                badgeEdit.setAttribute("data-bs-toggle", "modal")
                badgeEdit.setAttribute("data-bs-target", "#modalEdit")
            
                badgeEdit.appendChild(document.createTextNode("Edit"))

                badgeDone.setAttribute('id', 'doneButton')
                badgeDone.setAttribute('class', 'badge bg-success')
                badgeDone.setAttribute("href", '#')
                badgeDone.setAttribute("data-title", task.task_name)
                badgeDone.setAttribute('data-description', task.task_desc)
                badgeDone.setAttribute("data-id", task.task_id)
                badgeDone.setAttribute("onclick", "doneTask("+task.task_id+")")
            
                badgeDone.appendChild(document.createTextNode("Done"))

                article.appendChild(divContainer)
                article.appendChild(p)
                article.appendChild(badgeDelete)
                article.appendChild(badgeEdit)
                article.appendChild(badgeDone)

                if(task.undone == 'N'){
                    article.setAttribute('style', 'text-decoration:line-through')
                    doneItem.appendChild(article)
                } else{
                    todoItem.appendChild(article)
                }
            })
        }
    }
    xhr.send()

}

function updateStatus(task_id, task_name, task_desc, username){
  const xhr = new XMLHttpRequest()
  let url = API_HOST + "/UserTask/" + task_id;
  const data = JSON.stringify({
    task_name: task_name,
    task_desc: task_desc,
    username: username,
    undone: 'N',
  })

  xhr.open('PUT', url, true)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
  xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
          location.reload()
      }
  }
  xhr.send(data)
}

function doneTask(task_id){
  const xhr = new XMLHttpRequest
  const url = API_HOST + '/UserTask/' + task_id

  xhr.open('GET', url, true)
  xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.response)
            response['data'].forEach(data => {
                updateStatus(data.task_id, data.task_name, data.task_desc, data.username)
            });
        }
    }
    return xhr.send()


}


const modalAdd = document.getElementById("modalAdd")
modalAdd.addEventListener("show.bs.modal", function (event) {

  const xhr = new XMLHttpRequest();
  const url = API_HOST +"/projects"
 
  xhr.open("GET", url, true)
  xhr.onreadystatechange = function(){
      if(this.readyState == 4 & this.status == 200){
          const projects = JSON.parse(this.response)


          projects['data'].forEach(project => {
            const option = document.createElement('option');
            option.setAttribute('value', project.project_id)
            option.appendChild(document.createTextNode(project.project_name))
            projectDropdown.appendChild(option)
          });

      }
  }
  xhr.send()
  
})


//add modal
const addForm = document.getElementById("form-add");
addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let xhr = new XMLHttpRequest();
  let url = API_HOST + "/AddUserTask";

  //seleksi nilai dari input title dan description
  let project = document.getElementById("dropdownProject").value
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let username = sessionStorage.getItem('username')

  //konfigurasi toast
  const toastLiveExample = document.getElementById("liveToastAdd");
  const toastMsgAdd = document.getElementById("toast-body-add");
  const toast = new bootstrap.Toast(toastLiveExample);
  //validasi input
  if (title == "") {
    toastMsgAdd.innerHTML = "Isian title tidak boleh kosong";
    toast.show();
  }
  if (description == "") {
    toastMsgAdd.innerHTML = "Isian deskripsi tidak boleh kosong";
    toast.show();
  }  if (project == "") {
    toastMsgAdd.innerHTML = "Project tidak boleh kosong";
    toast.show();
  }
  let new_data = JSON.stringify({
    task_name: title,
    task_desc: description,
    project_id: project,
    username: username
  });

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //close the modal after adding data
      const myModalAdd = bootstrap.Modal.getInstance("#modalAdd");
      myModalAdd.hide();

      //reset form
      addForm.reset();
      //refresh page
      location.reload();
    } else {
      //konfigurasi toast berhasil
      const toastLive = document.getElementById("liveToastAdd");
      const toastMsg = document.getElementById("toast-body-add");
      const toast = new bootstrap.Toast(toastLive);
      toastMsg.innerHTML = "Data berhasil";
      toast.show();
    }
  };
  
  xhr.send(new_data);
});






//edit modal
const myModalEdit = document.getElementById("modalEdit");

// ketika modal edit muncul jalankan fungsi berikut
myModalEdit.addEventListener("show.bs.modal", function (event) {
  //mendapatkan id dari item
  let dataId = event.relatedTarget.attributes["data-id"];

  //get data with specific id
  let xhr = new XMLHttpRequest();
  let url = API_HOST + "/UserTask/" + dataId.value;

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let datas = JSON.parse(this.response);
      datas['data'].forEach(data => {
        let oldTitle = document.getElementById("judulEdit");
        let oldDescription = document.getElementById("descEdit");
        oldTitle.value = data.task_name;
        oldDescription.value = data.task_desc;
        oldUndone = data.undone;
        //close the modal after adding data
      });
      
      
    }
  };

  xhr.send();
  // let btnEdit = document.getElementById('btn-edit')
  let editForm = document.getElementById("form-edit");
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    let url = API_HOST + "/UserTask/" + dataId.value;

    let newTitle = document.getElementById("judulEdit").value;
    let newDescription = document.getElementById("descEdit").value;
    let username = sessionStorage.getItem('username')
    //konfigurasi toast
    //konfigurasi toast
    const toastLiveExample = document.getElementById("liveToastEdit");
    const toastMsgEdit = document.getElementById("toast-body-edit");
    const toast = new bootstrap.Toast(toastLiveExample);
    //validasi input
    if (newTitle == "") {
      toastMsgEdit.innerHTML = "isian title tidak boleh kosong";
      toast.show();
    }
    if (newDescription == "") {
      toastMsgEdit.innerHTML = "isian description tidak boleh kosong";
      toast.show();
    }

    let data = JSON.stringify({
      task_name: newTitle,
      task_desc: newDescription,
      username: username,
      undone: oldUndone,
    });
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        //close the modal after edit data
        const myModalEdit = bootstrap.Modal.getInstance("#modalEdit");
        myModalEdit.hide();
        //reset form and reload page
        editForm.reset();
        location.reload();
      }
    };
    xhr.send(data);
  });
});


const myModalDelete = document.getElementById("modalDelete");
//berikan event ketika modal delete muncul
myModalDelete.addEventListener("show.bs.modal", function (event) {
  //mendeteksi elemen yang diklik user
  let dataId = event.relatedTarget.attributes["data-id"];
  const deleteForm = document.getElementById("formDelete");
  //ketika tombol delte diklik jalankan fungsi hapus
  deleteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    let url = API_HOST + "/UserTask/" + dataId.value;

    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.response);

        const modalDelete = bootstrap.Modal.getInstance(document.getElementById("modalDelete"))
        modalDelete.hide();
        location.reload();
               
        const alertLoc = document.getElementById("alert-loc");
        const alertEl = document.createElement("div");
        alertEl.setAttribute("class", "alert alert-success");
        alertEl.setAttribute("role", "alert");
        alertEl.innerHTML = response.message;

        alertLoc.append(alertEl);

        document.getElementById(dataId.value).classList.add("d-none");
        
      }
    };
    xhr.send();
  });
});



//add project modal
const addProjectForm = document.getElementById("form-project");

addProjectForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let xhr = new XMLHttpRequest();
  let url = API_HOST + "/AddProject";

  //seleksi nilai dari input title dan description
  let title = document.getElementById("titleProject").value;
  let description = document.getElementById("descriptionProject").value;

  //konfigurasi toast
  const toastLiveExample = document.getElementById("liveToastAdd");
  const toastMsgAdd = document.getElementById("toast-body-add");
  const toast = new bootstrap.Toast(toastLiveExample);
  //validasi input
  if (title == "") {
    toastMsgAdd.innerHTML = "Isian title tidak boleh kosong";
    toast.show();
  }
  if (description == "") {
    toastMsgAdd.innerHTML = "Isian deskripsi tidak boleh kosong";
    toast.show();
  } 
  let new_data = JSON.stringify({
    project_name: title,
    project_desc: description,
  });

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //close the modal after adding data
      const myModalAdd = bootstrap.Modal.getInstance("#modalAddProject");
      myModalAdd.hide();

      //reset form
      addForm.reset();
      //refresh page
      location.reload();

    } else {
      //konfigurasi toast berhasil
      const toastLive = document.getElementById("liveToastAdd");
      const toastMsg = document.getElementById("toast-body-add");
      const toast = new bootstrap.Toast(toastLive);
      toastMsg.innerHTML = "Data berhasil";
      toast.show();
    }
  };
  
  xhr.send(new_data);
});



function showRealTimeClock(){
    const footerTime = document.getElementById("footer-time")
    const time = new Date()
    footerTime.innerHTML = time.toLocaleTimeString([],{
        hour12: false
    });
}

setInterval(showRealTimeClock, 1000)