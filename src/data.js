export const products = [
    {
        id: 1,
        name: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry leading noise canceling headphones.",
        price: 5200000,
        category: "Elektronik",
        type: "Fisik",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 101, user: "Andi Wijaya", rating: 5, comment: "Kualitas suaranya luar biasa, noise cancelling terbaik di kelasnya!" },
            { id: 102, user: "Budi Santoso", rating: 4, comment: "Bagus banget, tapi harganya lumayan mahal." }
        ]
    },
    {
        id: 2,
        name: "Premium E-Book: Advanced Web Development",
        description: "Comprehensive guide to modern web architecture and React.",
        price: 150000,
        category: "Digital",
        type: "Digital",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 103, user: "Citra Lestari", rating: 5, comment: "Isinya daging semua, sangat membantu untuk karir frontend developer." },
            { id: 104, user: "Deni Pratama", rating: 5, comment: "Penjelasan React hooks sangat detail." }
        ]
    },
    {
        id: 3,
        name: "Minimalist Smartwatch Series 8",
        description: "Advanced health tracking with an elegant design.",
        price: 4500000,
        category: "Elektronik",
        type: "Fisik",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 105, user: "Eka Yulianti", rating: 4, comment: "Desainnya cantik, baterai awet seharian." },
            { id: 106, user: "Faisal Rahman", rating: 3, comment: "Terkadang sync ke HP agak lambat, tapi overal oke." }
        ]
    },
    {
        id: 4,
        name: "Subscription: Design Assets Pro (1 Year)",
        description: "Unlimited access to premium UI kits, icons, and illustrations.",
        price: 750000,
        category: "Digital",
        type: "Digital",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 107, user: "Gita Wirjawan", rating: 5, comment: "Asetnya premium dan up to date terus. Sangat worth it buat desainer UI." }
        ]
    },
    {
        id: 5,
        name: "Classic Leather Jacket",
        description: "Timeless black leather jacket made from premium materials.",
        price: 1250000,
        category: "Fashion",
        type: "Fisik",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 108, user: "Hendra Gunawan", rating: 5, comment: "Kualitas kulit aslinya terasa banget, jahitannya juga rapi." },
            { id: 109, user: "Irfan Hakim", rating: 4, comment: "Ukurannya agak ngepas, saran ambil 1 size lebih besar." }
        ]
    },
    {
        id: 6,
        name: "Mechanical Keyboard Keychron K2",
        description: "Compact wireless mechanical keyboard for mac and windows.",
        price: 1350000,
        category: "Elektronik",
        type: "Fisik",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 110, user: "Joko Anwar", rating: 5, comment: "Tactile feel nya mantap, cocok buat ngetik berjam-jam." }
        ]
    },
    {
        id: 7,
        name: "Software License: Video Editor Pro",
        description: "Lifetime license for professional video editing software.",
        price: 2500000,
        category: "Digital",
        type: "Digital",
        image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 111, user: "Kevin Julio", rating: 4, comment: "Fitur rendernya lumayan kencang, tapi butuh spesifikasi PC yang dewa." }
        ]
    },
    {
        id: 8,
        name: "Signature Artisan Coffee Beans",
        description: "1Kg of freshly roasted Ethiopian Yirgacheffe beans.",
        price: 350000,
        category: "Kopi",
        type: "Fisik",
        image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 112, user: "Leo Syafiq", rating: 5, comment: "Aromanya kuat dan fruity, sangat direkomendasikan buat pecinta filter coffee." },
            { id: 113, user: "Maria Ulfa", rating: 5, comment: "Selalu repeat order di sini." }
        ]
    },
    {
        id: 9,
        name: "Ergonomic Office Chair Premium",
        description: "Kursi kerja ergonomis dengan penyangga pinggang dan material breathable mesh.",
        price: 2150000,
        category: "Elektronik", // We use existing categories
        type: "Fisik",
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 114, user: "Rudi Hartono", rating: 5, comment: "Sangat nyaman untuk WFH berjam-jam, punggung tidak sakit lagi." }
        ]
    },
    {
        id: 10,
        name: "Spotify Premium 1 Tahun (Family)",
        description: "Akun Spotify Premium resmi durasi 12 bulan bergaransi.",
        price: 350000,
        category: "Digital",
        type: "Digital",
        image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 115, user: "Nina M", rating: 5, comment: "Seller fast respon, akun langsung aktif tanpa kendala." },
            { id: 116, user: "Andi Saputra", rating: 5, comment: "Mantap, dengerin lagu tanpa iklan." }
        ]
    },
    {
        id: 11,
        name: "MacBook Pro M3 Max 16-inch",
        description: "Apple MacBook Pro dengan chip M3 Max yang luar biasa cepat, RAM 36GB.",
        price: 58000000,
        category: "Elektronik",
        type: "Fisik",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 117, user: "Reza Arahap", rating: 5, comment: "Mesin monster, render video 4K berasa render gambar JPG." }
        ]
    },
    {
        id: 12,
        name: "Template UI Figma E-Commerce SaaS",
        description: "Sistem desain rapi dengan 200+ komponen premium dan varian untuk aplikasi SaaS.",
        price: 499000,
        category: "Digital",
        type: "Digital",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=600",
        reviews: [
            { id: 118, user: "Desi Anwar", rating: 4, comment: "Layer sangat rapi, sangat membantu mempercepat project." }
        ]
    }
];
