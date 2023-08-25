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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const User_1 = __importDefault(require("../../models/User"));
const router = (0, express_1.Router)();
// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.userId).select("-password");
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post("/", [
    (0, express_validator_1.check)("email", "Please include a valid email").isEmail(),
    (0, express_validator_1.check)("password", "Password is required").exists(),
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
        if (!user) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "Invalid Credentials",
                    },
                ],
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "Invalid Credentials",
                    },
                ],
            });
        }
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
//# sourceMappingURL=auth.js.map