import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior: smooth; }
    body { font-family:'Outfit',sans-serif; background:#0f0f10; color:#e8e8e8; line-height:1.6; }
    a { text-decoration:none; }
    button { font-family:'Outfit',sans-serif; }
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:#0f0f10; }
    ::-webkit-scrollbar-thumb { background:#333; border-radius:3px; }
    .product-card:hover .add-btn { opacity:1 !important; transform:translateY(0) !important; }
    .product-card:hover .product-img { transform:scale(1.1); }
    .product-img { transition:transform 0.5s; width:100%; height:100%; object-fit:cover; }
    .nav-link { color:#a0a0a0; font-size:0.875rem; font-weight:500; transition:color 0.3s; }
    .nav-link:hover { color:#ff6b6b; }
    .footer-link { color:#a0a0a0; text-decoration:none; font-size:0.875rem; transition:color 0.3s; display:block; margin-bottom:0.5rem; }
    .footer-link:hover { color:#ff6b6b; }
    .dot-btn { width:12px; height:12px; border-radius:50%; border:none; cursor:pointer; transition:all 0.3s; }
    .category-btn { padding:0.5rem 1rem; border-radius:50px; border:none; background:#1a1a1b; color:#e8e8e8; cursor:pointer; font-size:0.875rem; font-weight:500; transition:all 0.3s; font-family:'Outfit',sans-serif; }
    .category-btn:hover, .category-btn.active { background:#c62828; color:white; }
    .login-btn-header { background:#c62828; color:white; border:none; padding:0.6rem 1.4rem; border-radius:50px; font-size:0.875rem; font-weight:500; cursor:pointer; transition:all 0.3s; font-family:'Outfit',sans-serif; }
    .login-btn-header:hover { background:#b71c1c; transform:translateY(-2px); box-shadow:0 8px 25px rgba(198,40,40,0.5); }
    .btn-primary { background:#c62828; color:white; border:none; padding:1rem 2rem; border-radius:12px; font-size:1rem; font-weight:500; cursor:pointer; transition:all 0.3s; display:inline-flex; align-items:center; gap:0.5rem; text-decoration:none; font-family:'Outfit',sans-serif; }
    .btn-primary:hover { background:#b71c1c; transform:translateY(-2px); box-shadow:0 10px 30px rgba(198,40,40,0.5); }
    .dropdown-item-link { display:block; padding:0.75rem 1.5rem; text-decoration:none; color:#a0a0a0; font-size:0.875rem; font-weight:500; transition:all 0.2s; border-bottom:1px solid #333; }
    .dropdown-item-link:last-child { border-bottom:none; }
    .dropdown-item-link:hover { background:#c62828; color:white; padding-left:2rem; }
    .form-input { width:100%; padding:1rem; border:2px solid #333; border-radius:12px; font-size:1rem; background:#0f1011; color:#e8e8e8; outline:none; transition:border-color 0.3s; font-family:'Outfit',sans-serif; }
    .form-input:focus { border-color:#e53935; }
    .form-input.error { border-color:#ff5252; }
    .submit-btn { width:100%; padding:1rem; border:none; background:#c62828; color:white; font-size:1rem; border-radius:12px; cursor:pointer; font-weight:500; transition:all 0.3s; font-family:'Outfit',sans-serif; margin-top:0.5rem; }
    .submit-btn:hover { background:#b71c1c; }
    @media (max-width:768px) {
      .hero-grid { grid-template-columns:1fr !important; }
      .about-grid { grid-template-columns:1fr !important; }
      .products-grid { grid-template-columns:repeat(2,1fr) !important; }
      .footer-grid { grid-template-columns:1fr 1fr !important; }
      .nav-menu-desktop { display:none !important; }
    }
    @media (max-width:480px) {
      .products-grid { grid-template-columns:1fr !important; }
    }
    @media (max-width:1024px) {
      .products-grid { grid-template-columns:repeat(3,1fr) !important; }
    }
  `}</style>
);

/* ─── PRODUCTS DATA ─────────────────────────────────────────── */
const products = [
  { id:1, name:"Men's Classic Shirt", price:59, category:"Mens", image:"https://www.beyours.in/cdn/shop/files/wine-classic-shirt-2.jpg?v=1692792800", description:"Cotton slim fit shirt", rating:4.5 },
  { id:2, name:"Men's Denim Jacket", price:80, category:"Mens", image:"https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1763810488_8013424.jpg", description:"Stylish denim jacket", rating:4.7 },
  { id:3, name:"Men's Leather Belt", price:39, category:"Mens", image:"https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/25304548/2023/10/2/a1a4e5a5-d614-4a5c-8ccd-851f2da293ad1696229519967Belts1.jpg", description:"Genuine leather belt", rating:4.6 },
  { id:4, name:"Men's Sneakers", price:80, category:"Mens", image:"https://d1pdzcnm6xgxlz.cloudfront.net/footwear/8905875568490-9.jpg", description:"Casual sport sneakers", rating:4.4 },
  { id:5, name:"Men's Watch", price:299, category:"Mens", image:"https://images.meesho.com/images/products/409332998/1f1ot_512.webp?width=512", description:"Waterproof wristwatch", rating:4.8 },
  { id:6, name:"Women's Floral Dress", price:79, category:"Womens", image:"https://images.pexels.com/photos/7066622/pexels-photo-7066622.jpeg", description:"Elegant summer dress", rating:4.7 },
  { id:7, name:"Women's Handbag", price:79, category:"Womens", image:"https://zouk.co.in/cdn/shop/files/Women_s_Office_Bag_ef380aed-d11c-4bf6-ab94-f4e1e2d67d28.jpg?v=1744018716&width=2048", description:"Designer leather handbag", rating:4.9 },
  { id:8, name:"Women's Sunglasses", price:199, category:"Womens", image:"https://negativeapparel.com/cdn/shop/files/square-simple-sunglasses-2025-small-frame-street-shooting-sunglasses-ladies-sunglasses-negative-apparel-884309.jpg?v=1743176151&width=800", description:"Stylish UV protection", rating:4.5 },
  { id:9, name:"Women's Boots", price:199, category:"Womens", image:"https://img.tatacliq.com/images/i19//437Wx649H/MP000000019583171_437Wx649H_202407291807201.jpeg", description:"Comfortable ankle boots", rating:4.7 },
  { id:10, name:"Women's Watch", price:89, category:"Womens", image:"https://www.lavieworld.com/cdn/shop/files/WTPG1370195M3_8.jpg?v=1756803261", description:"Classic fashion watch", rating:4.8 },
  { id:11, name:"Kids' T-shirt", price:29, category:"Kids", image:"https://www.chilins.in/cdn/shop/files/10_88348b09-2ebf-4ce2-95f3-a0ab55d61f8a.jpg?v=1748510794", description:"Soft cotton kids t-shirt", rating:4.6 },
  { id:12, name:"Kids' Sneakers", price:39, category:"Kids", image:"https://rukminim2.flixcart.com/image/480/640/xif0q/shopsy-kids-shoe/y/c/e/5-sh-tarzan-11-kids-asian-original-imahfzwurmyg8g8e.jpeg?q=90", description:"Lightweight sports shoes", rating:4.5 },
  { id:13, name:"Kids' Backpack", price:39, category:"Kids", image:"https://images-cdn.ubuy.co.in/66a1b8985a1cfb4bfd34db4c-boys-backpack-galaxy-backpack-for-boys.jpg", description:"Colorful school backpack", rating:4.7 },
  { id:14, name:"Kids' Cap", price:15, category:"Kids", image:"https://assets.mockey.ai/mockups/cap/hat-94-preview.png", description:"Fun summer cap", rating:4.4 },
  { id:15, name:"Kids' Jacket", price:39, category:"Kids", image:"https://img.cdn.mountainwarehouse.com/product/053103/053103_kha_seasons_2_kids_padded_jacket_ecom_lifestyle_ss25_01.jpg?w=348", description:"Warm winter jacket", rating:4.6 },
  { id:16, name:"Minimalist Watch", price:299, category:"Accessories", image:"https://images.squarespace-cdn.com/content/v1/5c9cb86ec46f6d68c6b63267/a1019f4c-ed5c-4473-8538-8b32387d8749/cheap-simple-watches.jpg?format=2500w", description:"Elegant minimalist watch", rating:4.8 },
  { id:17, name:"Sunglasses", price:139, category:"Accessories", image:"https://assets.ajio.com/medias/sys_master/root/20240713/MtI5/66923b226f60443f31082a20/-473Wx593H-465601331-black-MODEL.jpg", description:"Classic sunglasses", rating:4.5 },
  { id:18, name:"Leather Wallet", price:99, category:"Accessories", image:"https://imagescdn.vanheusenindia.com/img/app/product/3/39726061-15077966.jpg?auto=format&w=390", description:"Slim leather wallet", rating:4.7 },
  { id:19, name:"Wireless Headphones", price:249, category:"Electronics", image:"https://dlcdnwebimgs.asus.com/gain/FBAAC5C2-2ED4-406C-AA47-5A105797004A/w750/h470/fwebp", description:"Premium wireless headphones", rating:4.9 },
  { id:20, name:"Bluetooth Speaker", price:39, category:"Electronics", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0N8-u8G2Kv99KGNo-4llf0el3YN8bX7ZRHg&s", description:"Portable waterproof speaker", rating:4.8 },
  { id:21, name:"Smart Watch", price:339, category:"Electronics", image:"https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/24435058/2023/8/14/5e0fb72d-aa26-4de7-999a-199e01ed1df21691985473864SamsungGalaxyWatch6LTE44mmSilverCompatiblewithAndroidonly1.jpg", description:"Fitness tracking smartwatch", rating:4.7 },
  { id:22, name:"Ceramic Vase", price:89, category:"Home", image:"https://rukminim2.flixcart.com/image/480/640/xif0q/vase/s/z/e/7-5-nsv01a2-originalceramics-8-original-imagmcwjacfyhhzd.jpeg?q=90", description:"Modern ceramic vase", rating:4.6 },
  { id:23, name:"Plant Pot Set", price:59, category:"Home", image:"https://logam.in/cdn/shop/files/IMG_0037_800x.jpg?v=1697039870", description:"Set of 3 modern plant pots", rating:4.4 },
  { id:24, name:"Desk Lamp", price:119, category:"Home", image:"https://m.media-amazon.com/images/I/71D2YNJoNNL._AC_UF1000,1000_QL80_.jpg", description:"Adjustable desk lamp", rating:4.7 },
  { id:25, name:"Canvas Sneakers", price:129, category:"Footwear", image:"https://img.joomcdn.net/34152112550d8acc6a4d035f891088d1693de6e6_original.jpeg", description:"Comfortable canvas sneakers", rating:4.6 },
  { id:26, name:"Leather Loafers", price:249, category:"Footwear", image:"https://loveforleather.in/cdn/shop/files/ASK05522.jpg?v=1715678283&width=1445", description:"Italian leather loafers", rating:4.8 },
];

const testimonials = [
  { stars:5, text:"Absolutely stunning quality! The minimalist watch is my new favorite piece. EMPER exceeded all expectations.", name:"Sarah K.", role:"Verified Buyer", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80" },
  { stars:5, text:"Fast delivery and incredible packaging. The handbag is even better in person. Highly recommend!", name:"Mike R.", role:"Verified Buyer", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80" },
  { stars:5, text:"Perfect for gifting! My wife loved the earrings. Customer service was outstanding too.", name:"Priya S.", role:"Verified Buyer", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" },
  { stars:4, text:"Quality products and smooth shopping experience. Will definitely buy again from EMPER.", name:"Arjun M.", role:"Verified Buyer", avatar:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80" },
  { stars:5, text:"Excellent customer support and quick response times. The leather backpack is amazing.", name:"Nisha T.", role:"Verified Buyer", avatar:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80" },
  { stars:4, text:"I love the home décor collection. Stylish and modern design but still cozy.", name:"Rahul P.", role:"Verified Buyer", avatar:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80" },
];

/* ─── HEADER ─────────────────────────────────────────────────── */
function Header({ onLoginClick }) {
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const handleCategoryClick = (cat) => {
    setDropOpen(false);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(15,15,16,0.92)", backdropFilter:"blur(10px)", borderBottom:"1px solid #333" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 1rem", display:"flex", justifyContent:"space-between", alignItems:"center", height:64 }}>
        <a href="#" style={{ fontSize:"1.5rem", fontWeight:600, color:"#ff6b6b", textDecoration:"none" }}>EMPER</a>

        <nav className="nav-menu-desktop" style={{ display:"flex", gap:"2rem", alignItems:"center" }}>
          <a href="#" className="nav-link">Home</a>

          <div ref={dropRef} style={{ position:"relative" }}
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}>
            <span className="nav-link" style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:"0.25rem" }}>
              Shop <span style={{ fontSize:"0.75rem", transition:"transform 0.3s", display:"inline-block", transform: dropOpen ? "rotate(180deg)" : "none" }}>▼</span>
            </span>
            <div style={{
              position:"absolute", top:"100%", left:0, background:"#1a1a1b", minWidth:200,
              borderRadius:12, boxShadow:"0 20px 40px rgba(0,0,0,0.5)", border:"1px solid #333",
              padding:"0.5rem 0", zIndex:101,
              opacity: dropOpen ? 1 : 0, visibility: dropOpen ? "visible" : "hidden",
              transform: dropOpen ? "translateY(0)" : "translateY(-10px)", transition:"all 0.3s ease"
            }}>
              {["Mens","Womens","Kids","Accessories","Electronics"].map(cat => (
                <a key={cat} href="#products" className="dropdown-item-link" onClick={() => handleCategoryClick(cat)}>{cat}</a>
              ))}
            </div>
          </div>

          <a href="#about" className="nav-link">About</a>
          <button className="login-btn-header" onClick={onLoginClick}>Login</button>
        </nav>
      </div>
    </header>
  );
}

/* ─── HERO ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      padding:"5rem 1rem",
      backgroundImage:`linear-gradient(135deg,rgba(15,15,16,0.65) 0%,rgba(26,26,27,0.65) 100%), url("https://amythompsonphotography.com/wp-content/uploads/sites/7026/2019/05/professional-lifestyle-photographer-amy-thompson-photography_0017.jpg")`,
      backgroundSize:"cover", backgroundPosition:"center", borderRadius:15, margin:"1rem"
    }}>
      <div className="hero-grid" style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"center" }}>
        <div>
          <span style={{ display:"inline-block", background:"rgba(198,40,40,0.15)", color:"#ff6b6b", padding:"0.5rem 1rem", borderRadius:50, fontSize:"0.875rem", fontWeight:500, marginBottom:"1.5rem" }}>
            New Collection 2025
          </span>
          <h1 style={{ fontSize:"3.5rem", fontWeight:600, lineHeight:1.1, marginBottom:"1.5rem", color:"#e8e8e8" }}>
            Get Your <br /><span style={{ color:"#ff6b6b" }}>Professional Store</span>
          </h1>
          <p style={{ color:"#a0a0a0", fontSize:"1.125rem", marginBottom:"2rem", maxWidth:400 }}>
            Curated collection of premium products designed for modern living. Quality meets elegance in every piece.
          </p>
          <a href="#products" className="btn-primary">Shop Now →</a>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ background:"#1a1a1b", borderRadius:24, padding:"2rem", textAlign:"center" }}>
            <p style={{ fontSize:"2rem", fontWeight:600, color:"#ff6b6b" }}>500+</p>
            <p style={{ fontSize:"0.875rem", color:"#a0a0a0" }}>Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRODUCTS ───────────────────────────────────────────────── */
const CATEGORIES = ["All","Accessories","Electronics","Bags","Home","Footwear","Mens","Womens","Kids"];

function Products() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products : products.filter(p => p.category === active);

  return (
    <section id="products" style={{ padding:"5rem 1rem", maxWidth:1200, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:"3rem" }}>
        <h2 style={{ fontSize:"2rem", fontWeight:600, marginBottom:"0.5rem", color:"#e8e8e8" }}>Featured Products</h2>
        <p style={{ color:"#a0a0a0" }}>Handpicked selection of our finest products</p>
      </div>

      <div style={{ display:"flex", justifyContent:"center", gap:"0.5rem", marginBottom:"3rem", flexWrap:"wrap" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`category-btn${active===cat?" active":""}`} onClick={() => setActive(cat)}>{cat}</button>
        ))}
      </div>

      <div className="products-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"2rem" }}>
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card" style={{ cursor:"pointer" }}>
      <div style={{ position:"relative", aspectRatio:1, borderRadius:16, overflow:"hidden", background:"#1a1a1b", marginBottom:"1rem" }}>
        <img src={product.image} alt={product.name} className="product-img" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <button className="add-btn" style={{
          position:"absolute", bottom:"1rem", right:"1rem", width:40, height:40,
          borderRadius:"50%", background:"#c62828", color:"white", border:"none",
          cursor:"pointer", opacity:0, transform:"translateY(10px)", transition:"all 0.3s",
          fontSize:"1.5rem", display:"flex", alignItems:"center", justifyContent:"center"
        }}>+</button>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.25rem", marginBottom:"0.5rem" }}>
        <span style={{ color:"#ff6b6b" }}>★</span>
        <span style={{ color:"#a0a0a0", fontSize:"0.875rem" }}>{product.rating}</span>
      </div>
      <h3 style={{ fontWeight:500, marginBottom:"0.25rem", color:"#e8e8e8", fontSize:"0.95rem" }}>{product.name}</h3>
      <p style={{ color:"#a0a0a0", fontSize:"0.875rem", marginBottom:"0.5rem" }}>{product.description}</p>
      <p style={{ fontSize:"1.125rem", fontWeight:600, color:"#e8e8e8" }}>${product.price}</p>
    </div>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" style={{ padding:"5rem 1rem", background:"linear-gradient(135deg,#1a1a1b 0%,#0f0f10 100%)" }}>
      <div className="about-grid" style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }}>
        <div>
          <h2 style={{ fontSize:"2.5rem", fontWeight:600, marginBottom:"1rem", color:"#e8e8e8" }}>
            About, <span style={{ color:"#ff6b6b" }}>EMPER</span>
          </h2>
          <span style={{ fontSize:"1.125rem", color:"#ff6b6b", fontWeight:500, marginBottom:"2rem", display:"block" }}>
            Professional lifestyle curated for you
          </span>
          <p style={{ color:"#a0a0a0", fontSize:"1.125rem", marginBottom:"1.5rem", lineHeight:1.8 }}>
            EMPER is more than just a store—it's a celebration of refined taste and modern living. We handpick every piece from the world's finest artisans and designers, ensuring quality craftsmanship meets contemporary style.
          </p>
          <div style={{ display:"flex", gap:"2rem", marginTop:"2rem", flexWrap:"wrap" }}>
            {[["500+","Happy Customers"],["50+","Designers"],["2+","Years"]].map(([num,label]) => (
              <div key={label} style={{ textAlign:"center" }}>
                <span style={{ display:"block", fontSize:"2.5rem", fontWeight:700, color:"#ff6b6b", lineHeight:1 }}>{num}</span>
                <span style={{ fontSize:"0.875rem", color:"#a0a0a0", fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1484788984921-03950022c9ef?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0" alt="About EMPER" style={{ width:"100%", borderRadius:24, boxShadow:"0 20px 50px rgba(0,0,0,0.3)" }} />
        </div>
      </div>
    </section>
  );
}

/* ─── FEEDBACK SLIDER ────────────────────────────────────────── */
function Feedback() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  const dotsCount = 3;

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % total), 5000);
    return () => clearInterval(timer);
  }, [total]);

  const t = testimonials[current];

  return (
    <section style={{ padding:"5rem 1rem", background:"#0f0f10" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"4rem" }}>
          <h2 style={{ fontSize:"2.5rem", fontWeight:600, marginBottom:"1rem", color:"#e8e8e8" }}>What Our Customers Say</h2>
          <p style={{ color:"#a0a0a0", fontSize:"1.125rem" }}>Don't just take our word for it</p>
        </div>

        <div style={{ maxWidth:500, margin:"0 auto" }}>
          <div style={{ background:"#1a1a1b", padding:"2.5rem", borderRadius:24, boxShadow:"0 20px 60px rgba(0,0,0,0.4)", textAlign:"center" }}>
            <div style={{ marginBottom:"1.5rem" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < t.stars ? "#ff6b6b" : "#555", fontSize:"1.5rem" }}>★</span>
              ))}
            </div>
            <p style={{ fontSize:"1.125rem", color:"#e8e8e8", lineHeight:1.7, marginBottom:"2rem", fontStyle:"italic" }}>"{t.text}"</p>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
              <img src={t.avatar} alt={t.name} style={{ width:50, height:50, borderRadius:"50%", objectFit:"cover", border:"3px solid #333" }} />
              <div style={{ textAlign:"left" }}>
                <h4 style={{ fontWeight:600, color:"#e8e8e8", margin:"0 0 0.25rem" }}>{t.name}</h4>
                <span style={{ color:"#a0a0a0", fontSize:"0.875rem" }}>{t.role}</span>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"center", gap:"0.75rem", marginTop:"2rem" }}>
            {Array.from({ length: dotsCount }).map((_, i) => (
              <button key={i} className="dot-btn"
                onClick={() => setCurrent(i * 2)}
                style={{ background: Math.floor(current / 2) === i ? "#c62828" : "#333", transform: Math.floor(current / 2) === i ? "scale(1.2)" : "none" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:"#1a1a1b", borderTop:"1px solid #333", padding:"3rem 1rem" }}>
      <div className="footer-grid" style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"2rem" }}>
        <div>
          <h3 style={{ fontSize:"1.5rem", fontWeight:600, marginBottom:"1rem", color:"#ff6b6b" }}>EMPER</h3>
          <p style={{ color:"#a0a0a0", fontSize:"0.875rem" }}>Curated collection of professional products.</p>
        </div>
        <div>
          <h4 style={{ fontWeight:500, marginBottom:"1rem", color:"#e8e8e8" }}>Shop</h4>
          <a href="#" className="footer-link">↗ New Arrivals</a>
          <a href="#" className="footer-link">⭐ Best Sellers</a>
          <a href="#" className="footer-link">⚖ Sale</a>
        </div>
        <div>
          <h4 style={{ fontWeight:500, marginBottom:"1rem", color:"#e8e8e8" }}>Help</h4>
          <a href="#" className="footer-link">📞 Contact Us</a>
          <a href="#" className="footer-link">🚢 Shipping</a>
          <a href="#" className="footer-link">↩ Returns</a>
        </div>
        <div>
          <h4 style={{ fontWeight:500, marginBottom:"1rem", color:"#e8e8e8" }}>Connect</h4>
          <a href="#" className="footer-link">📸 Instagram</a>
          <a href="#" className="footer-link">🐦 Twitter</a>
          <a href="#" className="footer-link">📘 Facebook</a>
        </div>
      </div>
    </footer>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────────── */
function HomePage({ onLoginClick }) {
  return (
    <>
      <Header onLoginClick={onLoginClick} />
      <main>
        <Hero />
        <Products />
        <About />
        <Feedback />
      </main>
      <Footer />
    </>
  );
}

/* ─── AUTH PAGE ──────────────────────────────────────────────── */
function AuthPage({ onBack }) {
  const [mode, setMode] = useState("login");
  const [alert, setAlert] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regCPass, setRegCPass] = useState("");

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem("emper_users") || "[]"); } catch { return []; }
  };
  const saveUsers = (users) => localStorage.setItem("emper_users", JSON.stringify(users));

  const showAlert = (msg) => {
    setAlert(msg);
    setLoginEmail(""); setLoginPass("");
    setRegName(""); setRegEmail(""); setRegPass(""); setRegCPass("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getUsers();
    const user = users.find(u => u.email === loginEmail);
    if (!user) return showAlert("No account found. Please register first.");
    if (user.password !== loginPass) return showAlert("Incorrect password!");
    localStorage.setItem("emper_loggedIn", JSON.stringify(user));
    showAlert("Login Successful! Redirecting...");
    setTimeout(onBack, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = getUsers();
    if (users.some(u => u.email === regEmail)) return showAlert("This email is already registered!");
    if (regName.length < 3) return showAlert("Name must be at least 3 characters.");
    if (!regEmail.includes("@")) return showAlert("Enter a valid email.");
    if (regPass.length < 6) return showAlert("Password must be at least 6 characters.");
    if (regPass !== regCPass) return showAlert("Passwords do not match!");
    saveUsers([...users, { name: regName, email: regEmail, password: regPass }]);
    showAlert("Registration Successful! You can now login.");
    setMode("login");
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#0f0f10" }}>
      <header style={{ padding:"1rem 2rem", borderBottom:"1px solid #333" }}>
        <a href="#" onClick={onBack} style={{ color:"#ff6b6b", fontSize:"1.5rem", fontWeight:600, textDecoration:"none" }}>← EMPER</a>
      </header>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ width:360, background:"#1a1a1b", padding:"2rem", borderRadius:16, boxShadow:"0 6px 30px rgba(0,0,0,0.6)" }}>

          {alert && (
            <div style={{ background:"rgba(198,40,40,0.15)", border:"1px solid #c62828", color:"#ff6b6b", padding:"0.75rem 1rem", borderRadius:8, marginBottom:"1.5rem", fontSize:"0.875rem" }}>
              {alert}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <h2 style={{ textAlign:"center", marginBottom:"1.5rem", color:"#e8e8e8", fontWeight:600 }}>Login</h2>
              <div style={{ marginBottom:"1.25rem" }}>
                <label style={{ display:"block", marginBottom:"0.5rem", fontWeight:500, color:"#e8e8e8", fontSize:"0.875rem" }}>Email</label>
                <input type="email" className="form-input" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required placeholder="you@email.com" />
              </div>
              <div style={{ marginBottom:"1.25rem" }}>
                <label style={{ display:"block", marginBottom:"0.5rem", fontWeight:500, color:"#e8e8e8", fontSize:"0.875rem" }}>Password</label>
                <input type="password" className="form-input" value={loginPass} onChange={e => setLoginPass(e.target.value)} required placeholder="••••••••" />
              </div>
              <button type="submit" className="submit-btn">Login</button>
              <p style={{ textAlign:"center", marginTop:"1rem", color:"#a0a0a0", fontSize:"0.875rem" }}>
                Don't have an account?{" "}
                <span style={{ color:"#ff6b6b", cursor:"pointer", fontWeight:"bold" }} onClick={() => { setMode("register"); setAlert(""); }}>Register</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h2 style={{ textAlign:"center", marginBottom:"1.5rem", color:"#e8e8e8", fontWeight:600 }}>Register</h2>
              {[
                { label:"Full Name", type:"text", val:regName, set:setRegName, ph:"Your Name" },
                { label:"Email", type:"email", val:regEmail, set:setRegEmail, ph:"you@email.com" },
                { label:"Password", type:"password", val:regPass, set:setRegPass, ph:"••••••••" },
                { label:"Confirm Password", type:"password", val:regCPass, set:setRegCPass, ph:"••••••••" },
              ].map(({ label, type, val, set, ph }) => (
                <div key={label} style={{ marginBottom:"1.25rem" }}>
                  <label style={{ display:"block", marginBottom:"0.5rem", fontWeight:500, color:"#e8e8e8", fontSize:"0.875rem" }}>{label}</label>
                  <input type={type} className="form-input" value={val} onChange={e => set(e.target.value)} required placeholder={ph} />
                </div>
              ))}
              <button type="submit" className="submit-btn">Register</button>
              <p style={{ textAlign:"center", marginTop:"1rem", color:"#a0a0a0", fontSize:"0.875rem" }}>
                Already have an account?{" "}
                <span style={{ color:"#ff6b6b", cursor:"pointer", fontWeight:"bold" }} onClick={() => { setMode("login"); setAlert(""); }}>Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <GlobalStyle />
      {page === "home"
        ? <HomePage onLoginClick={() => setPage("auth")} />
        : <AuthPage onBack={() => setPage("home")} />
      }
    </>
  );
}

