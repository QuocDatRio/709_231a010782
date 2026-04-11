

var PHONE_PRODUCTS = [
  
  {
    id: "1",
    slug: "iphone-17-pro-max",
    brand: "iphone",
    name: "iPhone 17 Pro Max",
    skuBase: "PS-IP17PM",
    photo: "images/iphone2.jpg",
    photoHover: "images/ip17prm.jpg",
    highlights: [
      "Chip A19 Pro, Neural Engine thế hệ mới",
      "Khung titan, màn hình Super Retina XDR 6.9 inch",
      "Camera 48MP Fusion, quay 4K Dolby Vision",
    ],
    storages: [
      {
        gb: 256,
        price: 36990000,
        colors: [
          { key: "blue", name: "Titan xanh biển", hex: "#2b2b50", img: "images/ip17prmblue.jpg" },
          { key: "white", name: "Titan trắng", hex: "#f5f5f7", img: "images/ip17prmw.jpg" },
          { key: "orange", name: "Titan cam", hex: "#f9a825", img: "images/ip17prm.jpg" },
        ],
      },
      {
        gb: 512,
        price: 41990000,
        colors: [
          { key: "blue", name: "Titan xanh biển", hex: "#2b2b50", img: "images/ip17prmblue.jpg" },
          { key: "white", name: "Titan trắng", hex: "#f5f5f7", img: "images/ip17prmw.jpg" },
          { key: "orange", name: "Titan cam", hex: "#f9a825", img: "images/ip17prm.jpg" },
        ],
      },
      {
        gb: 1024,
        price: 48990000,
        colors: [
            { key: "white", name: "Titan trắng", hex: "#f5f5f7", img: "images/ip17prmw.jpg" },
          { key: "orange", name: "Titan cam", hex: "#f9a825", img: "images/ip17prm.jpg" },
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "iphone-15",
    brand: "iphone",
    name: "iPhone 15",
    skuBase: "PS-IP15",
    photo: "images/ip15.jpg",
    photoHover: "images/ip15(1).jpg",
    highlights: [
      "Dynamic Island, chip A16 Bionic",
      "Camera chính 48MP, chế độ chân dung",
      "USB-C, pin cả ngày",
    ],
    storages: [
      {
        gb: 128,
        price: 18990000,
        colors: [
          { key: "black", name: "Đen", hex: "#1d1d1f", img: "images/ip15den.jpg" },
          { key: "blue", name: "Xanh dương", hex: "#638ab5", img: "images/ip15blue.jpg" },
          { key: "green", name: "Xanh lá", hex: "#3ac653", img: "images/ip15green.jpg" },
          { key: "yellow", name: "Vàng", hex: "#b1be2b", img: "images/ip15yellow.jpg" },
          { key: "pink", name: "Hồng", hex: "#ce50b5", img: "images/ip15(1).jpg" },
        ],
      },
      {
        gb: 256,
        price: 21990000,
        colors: [
          { key: "black", name: "Đen", hex: "#1d1d1f", img: "images/ip15den.jpg" },
          { key: "blue", name: "Xanh dương", hex: "#5c98d8", img: "images/ip15blue.jpg" },
          { key: "green", name: "Xanh lá", hex: "#3ac653", img: "images/ip15green.jpg" },
          { key: "pink", name: "Hồng", hex: "#ce50b5", img: "images/ip15(1).jpg" },
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "galaxy-s24-ultra",
    brand: "samsung",
    name: "Samsung Galaxy S24 Ultra",
    skuBase: "PS-S24U",
    photo: "images/s24u.jpg",
    photoHover: "images/s24u_xam.jpg",
    highlights: [
      "S Pen tích hợp, màn hình 6,8 inch QHD+",
      "Galaxy AI — phiên dịch, tóm tắt thông minh",
      "Camera 200MP, zoom quang học",
    ],
    storages: [
      {
        gb: 256,
        price: 25290000,
        colors: [
          { key: "violet", name: "Tím ", hex: "#6b5a7a", img: "images/s24u_tim.jpg" },
          { key: "gray", name: "Xám ", hex: "#6e6e73", img: "images/s24u_xam.jpg" },
          { key: "black", name: "Đen ", hex: "#2b2b2d", img: "images/s24u_den.jpg" },
          { key: "yellow", name: "Vàng ", hex: "#e8d4a8", img: "images/s24u_vang.jpg" },
        ],
      },
      {
        gb: 512,
        price: 28290000,
        colors: [
  { key: "violet", name: "Tím ", hex: "#6b5a7a", img: "images/s24u_tim.jpg" },
          { key: "gray", name: "Xám ", hex: "#6e6e73", img: "images/s24u_xam.jpg" },
          { key: "black", name: "Đen ", hex: "#2b2b2d", img: "images/s24u_den.jpg" },
          { key: "yellow", name: "Vàng ", hex: "#e8d4a8", img: "images/s24u_vang.jpg" },
        ],
      },
      {
        gb: 1024,
        price: 32290000,
        colors: [
           { key: "black", name: "Đen ", hex: "#2b2b2d", img: "images/s24u_den.jpg" },
          { key: "gray", name: "Xám ", hex: "#6e6e73", img: "images/s24u_xam.jpg" },
        ],
      },
    ],
  },
  {
    id: "4",
    slug: "galaxy-z-flip6",
    brand: "samsung",
    name: "Samsung Galaxy Z Flip6",
    skuBase: "PS-FLIP6",
    photo: "images/flip6.jpg",
    photoHover: "images/flip6_mint.jpg",
    highlights: [
      "Màn hình gập Flex, thiết kế nhỏ gọn",
      "FlexCam chụp selfie từ nhiều góc",
      "Pin cải tiến, bản lề bền bỉ",
    ],
    storages: [
      {
        gb: 256,
        price: 22990000,
        colors: [
          { key: "mint", name: "Xanh mint", hex: "#b8e0d2", img: "images/flip6_mint.jpg" },
          { key: "silver", name: "Bạc khói", hex: "#c8c8ce" , img: "images/flip6_silver.jpg"},
          { key: "yellow", name: "Vàng chanh", hex: "#f5e6a8" , img: "images/flip6_yellow.jpg"},
          { key: "blue", name: "Xanh dương", hex: "#a8c4e8", img: "images/flip6_blue.jpg" },
        ],
      },
      {
        gb: 512,
        price: 25990000,
        colors: [
          { key: "mint", name: "Xanh mint", hex: "#b8e0d2", img: "images/flip6_mint.jpg" },
          { key: "silver", name: "Bạc khói", hex: "#c8c8ce" , img: "images/flip6_silver.jpg"},
          { key: "black", name: "Đen ẩn", hex: "#1a1a1c" , img: "images/flip6_black.jpg"},
        ],
      },
    ],
  },
  {
    id: "5",
    slug: "xiaomi-17-ultra",
    brand: "xiaomi",
    name: "Xiaomi 17 Ultra",
    skuBase: "PS-MI17U",
    photo: "images/xiaomi17u.jpg",
    photoHover: "images/xiaomi17u_den.jpg",
    highlights: [
      "Android 16",
      "Qualcomm Snapdragon 8 Elite Gen 5 8 nhân, tản nhiệt lớn",
      "2 nhân 4.6 GHz & 6 nhân 3.62 GHz , RAM 16 GB",
      "Màn hình - Tần số quét 120 Hz, sạc nhanh , 6000 mAh",
    ],
    storages: [
      {
        gb: 512,
        price: 32190000,
        colors: [
          { key: "black", name: "Đen", hex: "#1a1a1a" ,img: "images/xiaomi17u_den.jpg" },
          { key: "green", name: "Xanh lá", hex: "#2d4a3e" ,img: "images/xiaomi17u_xanh.jpg" },
          { key: "white", name: "Trắng", hex: "#ececec" ,img: "images/xiaomi17u_trang.jpg" },
        ],
      },
      {
        gb: 1024,
        price: 35190000,
        colors: [
          { key: "black", name: "Đen", hex: "#1a1a1a", img: "images/xiaomi17u_den.jpg" },
          { key: "white", name: "Trắng", hex: "#ececec", img: "images/xiaomi17u_trang.jpg" },
          { key: "green", name: "Xanh Dragonfly", hex: "#2d4a3e", img: "images/xiaomi17u_xanh.jpg" },
        ],
      },
    ],
  },
  {
    id: "6",
    slug: "redmi-note-13-pro-plus",
    brand: "xiaomi",
    name: "Redmi Note 13 Pro+",
    skuBase: "PS-RN13P",
    photo: "images/13proplus.jpg",
    photoHover: "images/13proplus_trang.jpg",
    highlights: [
      "Camera 200MP, OIS",
      "Sạc siêu nhanh 120W",
      "Màn hình cong AMOLED 1,5K",
    ],
    storages: [
      {
        gb: 256,
        price: 9990000,
        colors: [
          { key: "purple", name: "Tím Fusion", hex: "#7c6f9e", img: "images/13proplus_tim.jpg"},
          { key: "black", name: "Đen", hex: "#232323" , img: "images/13proplus_den.jpg"},
          { key: "white", name: "Trắng", hex: "#f2f2f2", img: "images/13proplus_trang.jpg" },
        ],
      },
      {
        gb: 512,
        price: 11490000,
        colors: [
          { key: "purple", name: "Tím Fusion", hex: "#7c6f9e" , img: "images/13proplus_tim.jpg"},
          { key: "black", name: "Đen", hex: "#232323", img: "images/13proplus_den.jpg" },
        ],
      },
    ],
  },
   {
    id: "7",
    slug: "find-x9-pro",
    brand: "oppo",
    name: "Find X9 Pro",
    skuBase: "PS-FX9P",
    photo: "images/findx9pro.webp",
    photoHover: "images/findx9pro_trang.jpg",
    highlights: [
      "	Dimensity 9500 5G, RAM 16GB, ROM 512GB",
      "50MP OIS (Chính) + 200MP OIS (Tele) + 50MP (Góc rộng) , 2MP (MMono)",
      "50MP; f/2.0; FOV 90°; Ống kính 5P; Hỗ trợ lấy nét AF",
      "7500mAh , ColorOS 16, nền tảng Android 16",
      "6.78 inches, AMOLED, 120Hz, HDR10+",
    ],
    storages: [
      {
        gb: 256,
        price: 22990000,
        colors: [
         { key: "red", name: "Đỏ ", hex: "#d13118", img: "images/findx9pro_do.jpg"},
          { key: "gray", name: "Xám", hex: "#6f6e70" , img: "images/findx9pro_xam.jpg"},
          { key: "white", name: "Trắng", hex: "#f2f2f2", img: "images/findx9pro_trang.jpg" },
        ],
      },
      {
        gb: 512,
        price: 27990000,
        colors: [
           { key: "red", name: "Đỏ ", hex: "#d13118", img: "images/findx9pro_do.jpg"},
          { key: "gray", name: "Xám", hex: "#6f6e70" , img: "images/findx9pro_xam.jpg"},
          { key: "white", name: "Trắng", hex: "#f2f2f2", img: "images/findx9pro_trang.jpg" },
        ],
      },
    ],
  },
   {
    id: "8",
    slug: "reno-15",
    brand: "oppo",
    name: "Reno 15",
    skuBase: "PS-RN15",
    photo: "images/reno15.jpg",
    photoHover: "images/reno15_trang.jpg",
    highlights: [
      "Qualcomm Snapdragon 7 Gen4 5G , 8GB RAM , 256GB ROM",
      "6500 mAh , sạc nhanh 67W",
      "Màn hình AMOLED 6.59 inches , FHD+ 120Hz , HDR10+",
    ],
    storages: [
      {
        gb: 256,
        price: 16900000,
        colors: [
           { key: "xanh", name: "xanh", hex: "#252039" , img: "images/reno15_xanh.jpg"},
          { key: "white", name: "Trắng", hex: "#f2f2f2", img: "images/reno15_trang.jpg" },
        ],
      },
    ],
  },
];
