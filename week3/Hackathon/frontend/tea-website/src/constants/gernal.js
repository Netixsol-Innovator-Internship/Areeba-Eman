import person from "../assets/header/Person.svg";
import local_mall from "../assets/header/local_mall.svg";
import Search from "../assets/header/Search.png";


// New feature icons 
import teaCup from "../assets/home/features/local_cafe.svg";
import organicBadge from "../assets/home/features/redeem.svg";
import deliveryTruck from "../assets/home/features/local_shipping.svg";
import sampleTag from "../assets/home/features/sell.svg";

// Tea collection images
import blackTea from "../assets/home/collections/Image Holder.svg";
import greenTea from "../assets/home/collections/Image Holder1.svg";
import whiteTea from "../assets/home/collections/Image Holder2.svg";
import matcha from "../assets/home/collections/Image Holder3.svg";
import herbalTea from "../assets/home/collections/Image Holder4.svg";
import chai from "../assets/home/collections/Image Holder5.svg";
import oolong from "../assets/home/collections/Image Holder6.svg";
import rooibos from "../assets/home/collections/Image Holder7.svg";
import teaware from "../assets/home/collections/Image Holder8.svg";

// Products
import img1 from "../assets/collections/img1.jpg"
import img2 from "../assets/collections/img2.jpg"
import img3 from "../assets/collections/img3.jpg"
import img4 from "../assets/collections/img4.jpg"
import img5 from "../assets/collections/img5.jpg"
import img6 from "../assets/collections/img6.jpg"

export const NavList = {
    tea_collections: {
        id: 1,
        value: "TEA COLLECTIONS",
        path: "/collections",
    },
    accessories: {
        id: 2,
        value: "accessories",
        path: "/",
    },
    blog: {
        id: 3,
        value: "blog",
        path: "/",
    },
    contact_us: {
        id: 4,
        value: " contact us",
        path: "/"
    }
};


export const Icons = {
    search: {
        id: 1,
        src: Search,
        alt: "Search Icon",
        path: "/"
    },
    user: {
        id: 2,
        src: person,
        alt: "person Icon",
        path: "/login"
    },
    cart: {
        id: 3,
        src: local_mall,
        alt: "cart Icon",
        path: "/"
    }
};

// home page feature list 
export const Features = [
    { id: 1, icon: teaCup, text: "450+ KIND OF LOOSEF TEA" },
    { id: 2, icon: organicBadge, text: "CERTIFICATED ORGANIC TEAS" },
    { id: 3, icon: deliveryTruck, text: "FREE DELIVERY" },
    { id: 4, icon: sampleTag, text: "SAMPLE FOR ALL TEAS" }
];


// Collections data
export const Collections = [
    { id: 1, img: blackTea, title: "BLACK TEA" },
    { id: 2, img: greenTea, title: "GREEN TEA" },
    { id: 3, img: whiteTea, title: "WHITE TEA" },
    { id: 4, img: matcha, title: "MATCHA" },
    { id: 5, img: herbalTea, title: "HERBAL TEA" },
    { id: 6, img: chai, title: "CHAI" },
    { id: 7, img: oolong, title: "OOLONG" },
    { id: 8, img: rooibos, title: "ROOIBOS" },
    { id: 9, img: teaware, title: "TEAWARE" }
];




// footer content
export const footerData = {
    collections: [
        "Black teas",
        "Green teas",
        "White teas",
        "Herbal teas",
        "Matcha",
        "Chai",
        "Oolong",
        "Rooibos",
        "Teaware",
    ],
    learn: [
        "About us",
        "About our teas",
        "Tea academy",
    ],
    customerService: [
        "Ordering and payment",
        "Delivery",
        "Privacy and policy",
        "Terms & Conditions",
    ],
};

export const Products = {

}
export const products = [
    {
        id: 1,
        image: img1,
        title: "Ceylon Ginger Cinnamon chai tea",
        price: "4.85",
    },
    {
        id: 2,
        image: img2,
        title: "Ceylon Ginger Cinnamon chai tea",
        price: "5.20",
    },
    {
        id: 3,
        image: img3,
        title: "Ceylon Ginger Cinnamon chai tea",
        price: "6.10",
    },
    {
        id: 4,
        image: img4,
        title: "Ceylon Ginger Cinnamon chai tea",
        price: "7.50",
    },
    {
        id: 5,
        image: img5,
        title: "Ceylon Ginger Cinnamon chai tea",
        price: "7.50",
    },
    {
        id: 6,
        image: img6,
        title: "Ceylon Ginger Cinnamon chai tea",
        price: "7.50",
    },
]


// filters
export const filters = [
    "black teas", " Green teas", "White teas", "chai", "matcha", "herbal teas", " oolong", "rooibos", " Teasware"
]
