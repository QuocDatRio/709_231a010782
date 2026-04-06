
var PHONE_PRODUCTS = [
  {
    id: "1",
    slug: "iphone-17-pro-max",
    brand: "apple",
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
          { key: "natural", name: "Titan tự nhiên", hex: "#c4bfb6" },
          { key: "black", name: "Titan đen", hex: "#3a3a3c" },
          { key: "white", name: "Titan trắng", hex: "#f5f5f7" },
        ],
      },
      {
        gb: 512,
        price: 41990000,
        colors: [
          { key: "natural", name: "Titan tự nhiên", hex: "#c4bfb6" },
          { key: "black", name: "Titan đen", hex: "#3a3a3c" },
          { key: "blue", name: "Titan xanh", hex: "#4a6fa5" },
        ],
      },
      {
        gb: 1024,
        price: 48990000,
        colors: [
          { key: "natural", name: "Titan tự nhiên", hex: "#c4bfb6" },
          { key: "black", name: "Titan đen", hex: "#3a3a3c" },
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "iphone-15",
    brand: "apple",
    name: "iPhone 15",
    skuBase: "PS-IP15",
    photo: "images/iphone15.jpg",
    photoHover: "images/iphone15-2.jpg",
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
          { key: "black", name: "Đen", hex: "#1d1d1f" },
          { key: "blue", name: "Xanh dương", hex: "#d5e4f4" },
          { key: "green", name: "Xanh lá", hex: "#e0ebe2" },
          { key: "yellow", name: "Vàng", hex: "#fbf7d6" },
          { key: "pink", name: "Hồng", hex: "#f8e1e5" },
        ],
      },
      {
        gb: 256,
        price: 21990000,
        colors: [
          { key: "black", name: "Đen", hex: "#1d1d1f" },
          { key: "blue", name: "Xanh dương", hex: "#d5e4f4" },
          { key: "green", name: "Xanh lá", hex: "#e0ebe2" },
          { key: "pink", name: "Hồng", hex: "#f8e1e5" },
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
    photo: "images/s24-ultra.jpg",
    photoHover: "images/s24-ultra2.jpg",
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
          { key: "violet", name: "Tím Titanium", hex: "#6b5a7a" },
          { key: "gray", name: "Xám Titanium", hex: "#6e6e73" },
          { key: "black", name: "Đen Titanium", hex: "#2b2b2d" },
          { key: "yellow", name: "Vàng Titanium", hex: "#e8d4a8" },
        ],
      },
      {
        gb: 512,
        price: 28290000,
        colors: [
          { key: "violet", name: "Tím Titanium", hex: "#6b5a7a" },
          { key: "gray", name: "Xám Titanium", hex: "#6e6e73" },
          { key: "black", name: "Đen Titanium", hex: "#2b2b2d" },
        ],
      },
      {
        gb: 1024,
        price: 32290000,
        colors: [
          { key: "black", name: "Đen Titanium", hex: "#2b2b2d" },
          { key: "gray", name: "Xám Titanium", hex: "#6e6e73" },
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
    photo: "images/z-flip6.jpg",
    photoHover: "images/z-flip6-2.jpg",
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
          { key: "mint", name: "Xanh mint", hex: "#b8e0d2" },
          { key: "silver", name: "Bạc khói", hex: "#c8c8ce" },
          { key: "yellow", name: "Vàng chanh", hex: "#f5e6a8" },
          { key: "blue", name: "Xanh dương", hex: "#a8c4e8" },
        ],
      },
      {
        gb: 512,
        price: 25990000,
        colors: [
          { key: "mint", name: "Xanh mint", hex: "#b8e0d2" },
          { key: "silver", name: "Bạc khói", hex: "#c8c8ce" },
          { key: "black", name: "Đen ẩn", hex: "#1a1a1c" },
        ],
      },
    ],
  },
  {
    id: "5",
    slug: "xiaomi-14-ultra",
    brand: "xiaomi",
    name: "Xiaomi 14 Ultra",
    skuBase: "PS-MI14U",
    photo: "images/xiaomi14-ultra.jpg",
    photoHover: "images/xiaomi14-ultra2.jpg",
    highlights: [
      "Leica Summilux — hệ thống 4 camera",
      "Snapdragon 8 Gen 3, tản nhiệt lớn",
      "Màn hình AMOLED 120Hz, sạc nhanh",
    ],
    storages: [
      {
        gb: 512,
        price: 27990000,
        colors: [
          { key: "black", name: "Đen", hex: "#1a1a1a" },
          { key: "white", name: "Trắng", hex: "#ececec" },
        ],
      },
      {
        gb: 1024,
        price: 31990000,
        colors: [
          { key: "black", name: "Đen", hex: "#1a1a1a" },
          { key: "white", name: "Trắng", hex: "#ececec" },
          { key: "green", name: "Xanh Dragonfly", hex: "#2d4a3e" },
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
    photo: "images/redmi-note13-pro.jpg",
    photoHover: "images/redmi-note13-pro2.jpg",
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
          { key: "purple", name: "Tím Fusion", hex: "#7c6f9e" },
          { key: "black", name: "Đen", hex: "#232323" },
          { key: "white", name: "Trắng", hex: "#f2f2f2" },
        ],
      },
      {
        gb: 512,
        price: 11490000,
        colors: [
          { key: "purple", name: "Tím Fusion", hex: "#7c6f9e" },
          { key: "black", name: "Đen", hex: "#232323" },
        ],
      },
    ],
  },
];
