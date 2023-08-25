"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const gravatar_1 = __importDefault(require("gravatar"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const router = (0, express_1.Router)();
// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post("/", [
    (0, express_validator_1.check)("email", "Please include a valid email").isEmail(),
    (0, express_validator_1.check)("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "User already exists",
                    },
                ],
            });
        }
        const options = {
            s: "200",
            r: "pg",
            d: "mm",
        };
        const avatar = gravatar_1.default.url(email, options);
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashed = yield bcryptjs_1.default.hash(password, salt);
        // Build user object based on TUser
        const userFields = {
            email,
            password: hashed,
            avatar,
        };
        user = new User_1.default(userFields);
        yield user.save();
        const payload = {
            userId: user.id,
        };
        jsonwebtoken_1.default.sign(payload, config_1.default.get("jwtSecret"), { expiresIn: config_1.default.get("jwtExpiration") }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map