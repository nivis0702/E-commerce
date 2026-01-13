const headerEl = document.querySelector("header");
const mainEl = document.querySelector("main");
const asideEl = document.querySelector("aside");

// Empty array for cart storing
let arrOfCart = JSON.parse(localStorage.getItem("Cart")) || [];

let arrOfObj = {};
// Fetch data from `data.json`
async function fetchData() {
  try  {
    const res = await fetch("./asset/data.json");
    const data = await res.json();
    renderData(data);
    arrOfObj = data;
    // console.info(data);
  } catch (err) {
    console.error(err);
  }   
}

fetchData();

// Show pages function
const allpages = mainEl.querySelectorAll("section");
// console.info(allpages);

// Show pages (Function)
function showpages(pageId){
allpages.forEach((pages) => {
    pages.style.display = pages.id === pageId? "block" :"none";
});
}

showpages("shop");

// Click to `home` page
const homePage = headerEl.querySelector("h1");
homePage.addEventListener("click", () => {
  showpages(homePage.dataset.page);
});

// Click to show pages
const navLi = headerEl.querySelectorAll("ul li");
navLi.forEach((list) => {
    list.addEventListener("click",() => {
        const pageId = list.dataset.page;

        showpages(pageId);
    });
});

// Show cart (Function)
function showCart(display) {
    asideEl.classList.toggle(display);
}

const isCartOpen = headerEl.querySelector("#cart-btn");
isCartOpen.addEventListener("click",() => {
    showCart("!block");
});

//Cart item (Function)
function showCartItems(cartItems){
    const ulEl = asideEl.querySelector("ul");

    ulEl.innerHTML =`
    ${cartItems
      .map(
        (item) => `
        <li class="flex items-center gap-3 px-3">
        <figure class="w-30">
        <img src="${item.images[0].url}" alt="" />
        </figure>
        <div class="flex-1">
        <h1 class="line-clamp-1">${item.name}</h1>
        <div class="flex items-center gap-5 mt-2">
        <button onclick="handleIncrease(${
          item.id
        })" class="outline w-5 rounded hover:bg-black hover:text-white">+</button>
        <span>${item.qty || 1}</span>
        <button onclick="handleDecrease(${
          item.id
        })" class="outline w-5 rounded hover:bg-black hover:text-white">-</button>
        </div>
        </div>
        <div>₹ ${(item.price * 90 * (item.qty || 1)).toFixed(2)}/-</div>
        <div>
        <button onclick="handleRemove(${
          item.id
        })" class="outline text-rose-500 hover:bg-rose-500 hover:text-white rounded px-2">Remove</button>
        </div>
        </li> 
        `
      )
      .join("")}
      `;
      totalPrice(cartItems);
    }

    showCartItems(arrOfCart)

    // Handle to increase quantity
    function handleIncrease(id) {
      // console.info(id)

      arrOfCart = arrOfCart.map((item) => 
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
      );

      localStorage.setItem("Cart", JSON.stringify(arrOfCart));
      showCartItems(arrOfCart);
      totalPrice(arrOfCart);
    }

    function handleDecrease(id) {
      arrOfCart = arrOfCart.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) - 1 } : item
    );

    localStorage.setItem("Cart", JSON.stringify(arrOfCart));
      showCartItems(arrOfCart);
      totalPrice(arrOfCart);
    }

    function totalPrice(carts) {
  const displayTotalPrice = asideEl.querySelector("#displayTotalPrice");
  const total = carts.reduce((acc, items) => {
    return acc + items.price * 90 * (items.qty || 1);
  }, 0);

  displayTotalPrice.textContent = `₹ ${total.toFixed(2)}/-`;
}

function handleRemove(id) {
  arrOfCart = arrOfCart.filter((item) => item.id !== id);
  localStorage.setItem("Cart", JSON.stringify(arrOfCart));
  showCartItems(arrOfCart);
}

// Render data (Function)
const shopPage = mainEl.querySelector("#shop");
function renderData(data) {
  // console.info(data);
  const ulEl = shopPage.querySelector("ul");

  const firstKey = Object.keys(data)[0];
    // console.info(firstKey)
    productCard(data[firstKey]);

  ulEl.innerHTML =`
  ${Object.keys(data)
    .map(
      (keyName) => `
      <li class="capitalize" data-key="${keyName}">${keyName
      .split("_")
      .join(" ")}</li>
      `
    )
  .join("")}
  `;

  const navigateProduct = ulEl.querySelectorAll("li");
  // console.info(navigateproduct
  navigateProduct.forEach((list) => {
    list.addEventListener("click", () => {
      productCard(data[list.dataset.key]);
    });
  });
}

//Shop product card (Function)
function productCard(data) {
  // console.info(data)
  const cardContainer = shopPage.querySelector("#cardContainer");

  cardContainer.innerHTML =`
  ${
    data && 
    data
    .map(
      (item) => `
    <figure>
    <div class="">
    <img src="${item.images[0].url}" alt="">
    </div>
    <figcaption>
    <table class="w-full [&_td]:p-2">
    <tbody>
    <tr>
    <td>Name: </td>
    <td>${item.name}</td>
    </tr>
    <tr>
    <td>Brand: </td>
    <td>${item.brand}</td>
    </tr>
    <tr>
    <td>Description: </td>
    <td>
    <p class="line-clamp-1">${item.description}</p>
    </td>
    </tr>
    <tr>
    <td>Price: </td>
    <td>${(item.price * 90).toFixed(2)}</td>
    </tr>
    <tr>
    <td>
    <button onclick="handleView(${
      item.id
    })" class="outline w-full text-rose-500 hover:bg-rose-500 hover:text-white">View</button>
    </td>
    <td>
    <button id="addToCartBtn" data-cartid="${
       item.id
    }" class="outline w-full text-sky-500 hover:bg-sky-500 hover:text-white">Add To Cart</button>
    </td>
    </tr>
    </tbody>
    </table>
    </figcaption>
    </figure>
    `
  )
  .join("")
}
    `;

   const cartBtn = cardContainer.querySelectorAll("#addToCartBtn");

  cartBtn.forEach((btn) => {
    // console.info(btn)
    btn.addEventListener("click", () => {
      // console.info(btn);
      const itemId = btn.dataset.cartid;
      // console.info(itemId)

      const cartObj = data.find((f) => f.id == itemId);
      // console.info(cartObj);
      arrOfCart.push(cartObj);
      // console.info(arrOfCart);
      showCartItems(arrOfCart);
      localStorage.setItem("Cart", JSON.stringify(arrOfCart));
    });
  }); 
}

const viewPage = mainEl.querySelector("#view article");
function handleView(id) {
  // console.info(id);
  showpages("view");

  const allArrOfData = Object.values(arrOfObj).flat();
  // console.info(allArrOfData)

  const findData = allArrOfData.find((item) => item.id === id);

  // console.info(findData);

  viewPage.innerHTML = `
    <figure class="w-[500px]">
      <div>
        <img src="${findData.images[0].url}" alt="">
      </div>
      <figcaption>
        <table>
          <tbody>
            <tr>
              <td>Name: </td>
              <td>${findData.name}</td>
            </tr>
            <tr>
            <td>Brand: </td>
              <td>${findData.brand}</td>
            </tr>
            <tr>
              <td>Description: </td>
              <td>${findData.description}</td>
            </tr>
            <tr>
              <td>Price: </td>
              <td>${findData.price}</td>
            </tr>
          </tbody>
        </table>
      </figcaption>
    </figure>
  `
}

const btn =document.getElementById('menu-btn');
const menu=document.querySelectorAll('.menu');
btn.addEventListener('click',()=>{
  menu.forEach((list)=>{
    list.classList.toggle('hidden');
  });

});