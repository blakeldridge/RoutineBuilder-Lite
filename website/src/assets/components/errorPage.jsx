import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    }

    return (
        <div>
            You entered an invalid url!
            <button onClick={handleClick}>Return Home</button>
        </div>
    );
};

export default ErrorPage;