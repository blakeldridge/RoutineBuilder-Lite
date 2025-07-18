import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();
function popup() {
    const notify = () => {
        toast.success("Successful", { autoClose: 3000 });
    };

    return (
        <div>
            <button onClick={notify}>Click me</button>
        </div>
    );
}