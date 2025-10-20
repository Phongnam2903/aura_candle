const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_KEY; // nên để trong .env
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../../utils/sendemail");
const client = new OAuth2Client(process.env.O2Auth_Key);

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // Tạo token, chứa thông tin cần thiết (ví dụ: id, email, role)
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role || "Customer", // nếu có phân quyền
            },
            JWT_SECRET,
            { expiresIn: "1d" } // token hết hạn sau 1 ngày
        );

        // Gửi lại token cùng user info (loại bỏ mật khẩu trước)
        const { Password: _, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            message: "Login successful",
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to login", error });
    }
};


const register = async (req, res) => {
    const { name, email, gender, password, phone } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            gender,
            password: hashed,
            phone,
        });

        await user.save();
        res.json({ message: "Đăng ký thành công." });
    } catch (error) {
        res.status(500).json({ message: "Failed to register", error });
    }
};


const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Xác thực token từ Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, given_name, family_name, picture } = payload;

        // Kiểm tra xem user đã tồn tại chưa
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: `${given_name || ""} ${family_name || ""}`.trim() || "Google User",
                email,
                password: "", // Google login nên không cần password
                role: "customer",
                status: "active",
            });

            await user.save();
        }

        //  Tạo JWT token
        const tokenJWT = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role || "customer",
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Đăng nhập Google thành công",
            user,
            token: tokenJWT,
        });
    } catch (error) {
        console.error("Lỗi khi đăng nhập Google:", error);
        res.status(401).json({ message: "Token không hợp lệ hoặc lỗi server" });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user?.id;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
        }

        // Kiểm tra xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
        }

        // Kiểm tra độ mạnh của mật khẩu
        const strongPasswordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!strongPasswordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: "Đổi mật khẩu thành công." });
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        res.status(500).json({ message: "Lỗi server khi đổi mật khẩu." });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ ok: false, message: "Email không tồn tại trong hệ thống" });

        // Tạo token hết hạn sau 15 phút
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "15m" });
        if (!process.env.SECRET_KEY) {
            console.error("❌ Missing SECRET_KEY in environment variables");
            return res.status(500).json({ ok: false, message: "Server configuration error" });
        }

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const html = `
      <div style="font-family:Arial,sans-serif;">
        <h2>Xin chào ${user.name || "bạn"},</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Aura Candle.</p>
        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetLink}" 
           style="display:inline-block;background:#16a34a;color:white;
                  padding:10px 20px;border-radius:8px;text-decoration:none;
                  font-weight:bold;">Đặt lại mật khẩu</a>
        <p style="margin-top:20px;">Liên kết này sẽ hết hạn sau <b>15 phút</b>.</p>
      </div>
    `;

        await sendEmail(email, "Đặt lại mật khẩu - Aura Candle", html);

        res.json({ ok: true, message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Có lỗi xảy ra khi gửi email." });
    }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        res.json({ ok: true, message: "Mật khẩu đã được đặt lại thành công!" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ ok: false, message: "Liên kết không hợp lệ hoặc đã hết hạn." });
    }
};
module.exports = { register, login, googleLogin, changePassword, forgotPassword, resetPassword };
