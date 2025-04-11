let body =document.querySelector('body')
fetch('http://127.0.0.1:8000/api/products/')
.then(response=> response.json())
.then(data=> data.forEach((n)=>{
    console.log(data)
    let description =document.createElement('h1')
    description.textContent = n.updated_at
    body.appendChild(description)
    let img =  document.createElement('img')
    img.src=n.image
    body.appendChild(img)
}))
