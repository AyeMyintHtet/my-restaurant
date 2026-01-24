"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitForm } from "@/actions/loginAction";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, Button, CircularProgress } from "@mui/material";

const LOGIN_DEFAULT = {
    email: "admin@gmail.com",
    password: "admin123"
}

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={pending}
            className={`mt-6 py-3 text-lg font-medium transition-all duration-300 ${pending ? "bg-gray-400" : "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800"
                }`}
            style={{
                textTransform: "none",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.39)",
            }}
        >
            {pending ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>
    );
};

export default function LoginForm() {
    const [state, formAction] = useActionState(submitForm, null);
    const [captchaToken, setCaptchaToken] = useState<string | undefined>();
    const [showPassword, setShowPassword] = useState(false);
    const captcha = useRef<HCaptcha>(null);
    const router = useRouter();

    useEffect(() => {
        if (state?.status === "success") {
            captcha.current?.resetCaptcha();
            window.location.reload();
        }
    }, [state, router]);

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-300">Enter your credentials to access the admin panel</p>
            </div>

            <form action={formAction} className="space-y-6">
                <div className="space-y-4">
                    <TextField
                        defaultValue={LOGIN_DEFAULT.email}
                        id="email"
                        name="email"
                        label="Email Address"
                        variant="filled"
                        fullWidth
                        required
                        InputProps={{
                            disableUnderline: true,
                            style: { color: "white", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "0.5rem" },
                        }}
                        InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                    />

                    <TextField
                        defaultValue={LOGIN_DEFAULT.password}
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="filled"
                        fullWidth
                        required
                        InputProps={{
                            disableUnderline: true,
                            style: { color: "white", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "0.5rem" },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        style={{ color: "rgba(255,255,255,0.7)" }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                    />
                </div>

                {process.env.NODE_ENV === "production" && (
                    <div className="flex justify-center">
                        <HCaptcha
                            ref={captcha}
                            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
                            onVerify={(token) => setCaptchaToken(token)}
                        />
                        <input type="hidden" name="captchaToken" value={captchaToken ?? ""} />
                    </div>
                )}

                {state?.error && (
                    <div className="p-3 text-sm text-center text-red-200 bg-red-900/50 rounded-lg border border-red-500/30">
                        {state.error}
                    </div>
                )}

                <SubmitButton />

                <div className="text-center mt-4">
                    <p className='text-gray-400 text-xs italic'>Default: {LOGIN_DEFAULT.email} / {LOGIN_DEFAULT.password}</p>
                </div>
            </form>
        </div>
    );
}
