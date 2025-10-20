const { User } = require("../../models");

// Hàm kiểm tra email hợp lệ
const isValidEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
};

// Hàm kiểm tra số điện thoại Việt Nam hợp lệ
const isValidPhone = (phone) => {
    const regex = /^(0|\+84)[0-9]{9}$/;
    return regex.test(phone);
};

// Hàm kiểm tra tên hợp lệ (ít nhất 2 ký tự)
const isValidName = (name) => {
    return typeof name === "string" && name.trim().length >= 2;
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

const updateInforUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Validate input
        if (!isValidName(name)) {
            return res.status(400).json({ message: "Tên không hợp lệ (ít nhất 2 ký tự)" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Email không hợp lệ" });
        }

        if (phone && !isValidPhone(phone)) {
            return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true }
        );

        if (!updatedUser)
            return res.status(404).json({ message: "Không tìm thấy user" });

        res.json({ message: "Cập nhật thành công", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = { getUserById, updateInforUser };
