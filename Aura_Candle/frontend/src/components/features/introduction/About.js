// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaSpa, FaLeaf, FaFeatherAlt } from "react-icons/fa";

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fffaf7] to-[#fefefe] text-gray-800">
            {/* 🌸 Hero Section */}
            <section className="relative text-center py-20 px-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#c47a63] tracking-wide">
                        Aura Candles
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-4 leading-relaxed">
                        Nơi mỗi ngọn nến là một câu chuyện — ánh sáng và hương thơm
                        mang thông điệp ẩn dành riêng cho tâm hồn bạn.
                    </p>
                </motion.div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30"></div>
            </section>

            {/* 🕯️ About Section */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center py-20">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl font-bold text-gray-900">
                        Về chúng tôi
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        Aura Candles ra đời với sứ mệnh mang đến không gian an yên,
                        nơi mỗi ngọn nến không chỉ tỏa sáng mà còn truyền đi năng lượng tích cực.
                        Chúng tôi tin rằng mùi hương là cầu nối giữa cảm xúc và ký ức —
                        mỗi sản phẩm đều chứa đựng <strong>“thông điệp ẩn”</strong> dành riêng cho bạn.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        Từ thiên nhiên đến nghệ thuật, Aura kết hợp sự tinh tế và sáng tạo
                        để tạo nên những ngọn nến mang phong cách sống thanh lịch, hiện đại
                        và đầy cảm xúc.
                    </p>
                </motion.div>

                <motion.img
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    src="/assets/banner_nenthom.jpg"
                    alt="Aura Candls"
                    className="rounded-3xl shadow-lg object-cover"
                />
            </section>

            {/* 🌿 Values Section */}
            <section className="bg-gradient-to-r from-[#fff7f4] to-[#fffaf7] py-20">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                    Giá trị của Aura Candles
                </h2>
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 px-6">
                    {[
                        {
                            icon: <FaLeaf className="text-green-600 text-5xl mb-4" />,
                            title: "Tự nhiên & Thuần khiết",
                            desc: "Sáp đậu nành hữu cơ, tinh dầu nguyên chất và bấc cotton – an toàn cho bạn và môi trường."
                        },
                        {
                            icon: <FaSpa className="text-[#c47a63] text-5xl mb-4" />,
                            title: "Thủ công tinh tế",
                            desc: "Mỗi ngọn nến là một tác phẩm nghệ thuật được tạo ra bằng tay với niềm đam mê và tỉ mỉ."
                        },
                        {
                            icon: <FaFeatherAlt className="text-yellow-500 text-5xl mb-4" />,
                            title: "Thông điệp ẩn",
                            desc: "Ẩn chứa những lời nhắn gửi – niềm tin, hy vọng và yêu thương – dành riêng cho người đón nhận."
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-3xl p-8 text-center shadow-md hover:shadow-xl transition-all border border-[#f8e9e5]"
                        >
                            {item.icon}
                            <h3 className="font-semibold text-xl mb-3 text-gray-800">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ✨ Vision Section */}
            <section className="text-center py-24 px-6 bg-[#fffaf8]">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-gray-900 mb-6"
                >
                    Tầm nhìn của chúng tôi
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed"
                >
                    Aura Candls hướng đến trở thành thương hiệu nến thơm hàng đầu Việt Nam,
                    mang đến trải nghiệm sống tích cực, thư giãn và kết nối cảm xúc —
                    để mỗi ánh sáng tỏa ra là một lời nhắn gửi yêu thương.
                </motion.p>
            </section>

            {/* 🪔 Footer */}
            <footer className="text-center py-10 border-t border-gray-200 text-gray-500 text-sm bg-white">
                <em className="block text-gray-600 text-base">
                    “Thắp sáng không gian – khơi dậy cảm xúc – lan tỏa yêu thương.”
                </em>
            </footer>
        </div>
    );
}
