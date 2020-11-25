document.addEventListener("DOMContentLoaded", () => {
    const DOGSURL = "http://localhost:3000/dogs"

    const main = document.querySelector("main")
    let dogForm

    getDogs()
    doggoForm()

    function doggoForm(){
        buildForm()
        dogForm.addEventListener("submit", (e) => addingDog(e))
    }
    
    function addingDog(e){
         e.preventDefault()
       
        let formData = {
            likes: 0,
            name: e.target.name.value,
            breed: e.target.breed.value,
            image: e.target.image.value,
            comments: []
        }

        configObj = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(formData)
        }

        fetch(DOGSURL, configObj)
        .then(resp => resp.json())
        .then(dogObj => buildDog(dogObj))

    }

    
    function buildForm(){
        const form = document.querySelector("form")
        dogForm = document.createElement("form")
        const submit = document.createElement("button")
        submit.textContent = "Add Dog"
        submit.type = "submit"

        const formItems = ["name", "breed", "image"]
            formItems.forEach(item => {
                let input = document.createElement("input")
                input.placeholder = item
                input.name = item

                dogForm.append(input)
            })

        dogForm.append(submit)
        form.prepend(dogForm)

    }

    function getDogs(){ 
        main.innerHTML = ""

        fetch(DOGSURL)
        .then(resp => resp.json())
        .then(dogs => dogs.forEach(dog => buildDog(dog)))
    
    }
    
    function buildDog(dog){
        const dogDiv = document.createElement('div')

        dogDiv.id = dog.id
        dogDiv.innerHTML = `
            <h2>${dog.name}</h2>
            <p>${dog.breed}</p>
            <img src="${dog.image}"</img>
            <p>Likes: ${dog.likes}</p>
            <button id="like">Like</button>
            <button id="super">10 Likes!</button>
            <p>Comments:</p>
            <ul>
               ${dog.comments.map(comment => `<li>${comment}</li>`).join('')}
            </ul>`

        const formComment = document.createElement('form')
        formComment.innerHTML =
            ` <label>Add Comment:</label>
                <input placeholder='text here' type='text' name='comment'></input>
                <input type='submit'></input>`
        
        formComment.addEventListener("submit", (e) => addComment(e, dog))

        dogDiv.appendChild(formComment)
        main.prepend(dogDiv)

        dogDiv.addEventListener("click", (e) => likeButton(e, dog))
        
    }

    function likeButton(e, dog){
        if (e.target.id == "like"){
           let formData = {likes: dog.likes += 1}
           handleButton(e, dog, formData)
            }
        else if (e.target.id == "super"){
            let formData = {likes: dog.likes += 10}
            handleButton(e, dog, formData)
        }
    }


    function handleButton(e, dog, formData){
        const pLikes = e.target.parentNode.children[3]

        configObj = {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify(formData)
                    }

        fetch(DOGSURL + `/${dog.id}`, configObj)
        .then(resp => resp.json())
        .then(data => pLikes.innerText = `Likes: ${data.likes}`)
        }
    
    
    function addComment(e, dog){
        e.preventDefault()

        let arr = dog.comments
        arr.push(e.target.comment.value)

        let formData = {comments: arr}
        
        configObj = {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify(formData)
        }

        fetch(DOGSURL + `/${dog.id}`, configObj)
        .then(resp => resp.json())
        .then(data => {
            const ul = e.target.previousSibling
            ul.innerHTML += `<li>${data.comments.splice(-1)}</li>`
            e.target.reset()
        })
        
        
    }
    





    
})