import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsSHA from "jssha";

const Login = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const hash = "68b7f168023ad7d82a8f62acd0843e8d7e98d9bf9d319f3ddfcdf95569b870901bad678b1770ac2d73a01ed5bbe1123898fba83be2b825683bdfa90fa832d403";

    const handleLogin = (e) => {
        e.preventDefault();
        var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
        hashObj.update(password);
        var hashedPassword = hashObj.getHash("HEX");
        
        if (hashedPassword === hash) {
            localStorage.setItem("authToken", "true");
            navigate("/");
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input type="password" placeholder="Password..." value={password} onChange={(event) => setPassword(event.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;