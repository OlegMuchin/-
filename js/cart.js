const cart = ()=>{
    const buttonCart = document.getElementById("cart-button")
    const modalCart = document.querySelector(".modal-cart")
    const close = modalCart.querySelector(".close")
    const body = modalCart.querySelector(".modal-body")
    const buttonSend = modalCart.querySelector(".button-primary")
    const modalPricetag = modalCart.querySelector(".modal-pricetag")

    const resertCart = () => {
        body.innerHTML = " "
        localStorage.removeItem("cart")
        modalCart.classList.remove("is-open")
        modalPricetag.innerHTML = "0 ₽"
    }

    const incrementCount = (id) => {
        const cartArray = JSON.parse(localStorage.getItem("cart"))

        cartArray.map((item)=>{
            if (item.id === id){
                item.count++
            }

            return item
        })

        localStorage.setItem("cart", JSON.stringify(cartArray))
        renderItems(cartArray)
    }

    const decrementCount = (id) => {
        const cartArray = JSON.parse(localStorage.getItem("cart"))
        console.log(cartArray);
        cartArray.map((item)=>{
            if (item.id === id){
                item.count = item.count > 0 ? item.count - 1 : 0
            }
        })

        localStorage.setItem("cart", JSON.stringify(cartArray))
        renderItems(cartArray)
    }

    const renderItems = (data) => {
        body.innerHTML = " "

        data = data.filter(({count})=>{
            return count > 0
        })


        data.forEach(({name, price, id, count})=> {
            const cartElem = document.createElement("div")
            
            cartElem.classList.add("food-row")

            cartElem.innerHTML = `
                <span class="food-name">${name}</span>
                <strong class="food-price">${price} ₽</strong>
                <div class="food-counter">
                    <button class="counter-button btn-dec" data-index="${id}" >-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button btn-inc" data-index="${id}" >+</button>
                </div>
            `
            
            body.append(cartElem)
        })


        let sum = 0 

        data.map(({price, count}) => {
            sum = sum + price*count
            return sum
        })

        modalPricetag.innerHTML = `${sum} ₽`

        localStorage.setItem("cart", JSON.stringify(data))
    }

    body.addEventListener("click", (event)=>{
        event.preventDefault()
        
        if (event.target.classList.contains("btn-inc")){
            incrementCount(event.target.dataset.index)
        } else if (event.target.classList.contains("btn-dec")){
            decrementCount(event.target.dataset.index)
        }
    })

    buttonSend.addEventListener("click",()=>{
        const cartArray = JSON.parse(localStorage.getItem("cart"))

        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: cartArray
        })
        .then((response)=>{
            if(response.ok){
                resertCart()
            }
        })
        .catch((e)=>{
            console.error(e);
        })
    })

    buttonCart.addEventListener("click",()=>{
    if(localStorage.getItem("cart")){
        renderItems(JSON.parse(localStorage.getItem("cart")))
    }
 
        modalCart.classList.add("is-open")
    })
    close.addEventListener("click",()=>{
        modalCart.classList.remove("is-open")
    })
}
cart()